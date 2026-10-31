package com.seatease.service;

import com.seatease.dao.BookingDAO;
import com.seatease.dao.BookingSeatDAO;
import com.seatease.dao.CustomerDAO;
import com.seatease.dao.SeatDAO;
import com.seatease.database.DatabaseConnection;
import com.seatease.model.Booking;
import com.seatease.model.Customer;
import com.seatease.model.Seat;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.regex.Pattern;

/**
 * BookingService
 * Main business logic orchestrator for SeatEase.
 * Implements strict ACID JDBC Transactions to prevent duplicate seat bookings:
 * - Locks candidate rows using "SELECT ... FOR UPDATE"
 * - Rejects any unavailable seat atomically with complete rollback
 * - Calculates total price safely in backend (150 INR per seat)
 * - Releases seats upon cancellation atomically
 */
public class BookingService {

    public static final BigDecimal PRICE_PER_SEAT = new BigDecimal("150.00");
    private static final Pattern MOBILE_PATTERN = Pattern.compile("^[0-9]{10}$");

    private final CustomerDAO customerDAO;
    private final BookingDAO bookingDAO;
    private final BookingSeatDAO bookingSeatDAO;
    private final SeatDAO seatDAO;

    public BookingService() {
        this.customerDAO = new CustomerDAO();
        this.bookingDAO = new BookingDAO();
        this.bookingSeatDAO = new BookingSeatDAO();
        this.seatDAO = new SeatDAO();
    }

    public BookingService(CustomerDAO customerDAO, BookingDAO bookingDAO,
                          BookingSeatDAO bookingSeatDAO, SeatDAO seatDAO) {
        this.customerDAO = customerDAO;
        this.bookingDAO = bookingDAO;
        this.bookingSeatDAO = bookingSeatDAO;
        this.seatDAO = seatDAO;
    }

    /**
     * Creates a new booking with ACID transaction safety and pessimistic row locking.
     */
    public Booking createBooking(String customerName, String mobile, String email, List<String> seatIds)
            throws IllegalArgumentException, IllegalStateException, SQLException {

        // 1. Validation
        validateCustomerInput(customerName, mobile, seatIds);

        // Sanitize and deduplicate seat IDs
        Set<String> cleanSeats = new HashSet<>();
        for (String id : seatIds) {
            cleanSeats.add(id.trim().toUpperCase());
        }
        List<String> uniqueSeats = new ArrayList<>(cleanSeats);

        Connection conn = null;
        try {
            conn = DatabaseConnection.getConnection();
            conn.setAutoCommit(false); // START TRANSACTION

            // 2. Lock candidate seat rows and verify availability (SELECT ... FOR UPDATE)
            StringBuilder lockSql = new StringBuilder("SELECT seat_id, price, status FROM seats WHERE seat_id IN (");
            for (int i = 0; i < uniqueSeats.size(); i++) {
                lockSql.append("?");
                if (i < uniqueSeats.size() - 1) {
                    lockSql.append(", ");
                }
            }
            lockSql.append(") FOR UPDATE");

            List<Seat> lockedSeats = new ArrayList<>();
            try (PreparedStatement lockStmt = conn.prepareStatement(lockSql.toString())) {
                for (int i = 0; i < uniqueSeats.size(); i++) {
                    lockStmt.setString(i + 1, uniqueSeats.get(i));
                }

                try (ResultSet rs = lockStmt.executeQuery()) {
                    while (rs.next()) {
                        Seat s = new Seat();
                        s.setSeatId(rs.getString("seat_id"));
                        s.setPrice(rs.getBigDecimal("price"));
                        s.setStatus(rs.getString("status"));
                        lockedSeats.add(s);
                    }
                }
            }

            // Verify all requested seats exist
            if (lockedSeats.size() != uniqueSeats.size()) {
                conn.rollback();
                throw new IllegalArgumentException("One or more selected seats do not exist in the theater/bus.");
            }

            // Verify every selected seat is currently AVAILABLE
            List<String> conflictSeats = new ArrayList<>();
            for (Seat seat : lockedSeats) {
                if (!"AVAILABLE".equalsIgnoreCase(seat.getStatus())) {
                    conflictSeats.add(seat.getSeatId());
                }
            }

            if (!conflictSeats.isEmpty()) {
                conn.rollback();
                throw new IllegalStateException("Seats already booked or unavailable: " + String.join(", ", conflictSeats));
            }

            // 3. Calculate total amount in Java
            BigDecimal totalAmount = PRICE_PER_SEAT.multiply(new BigDecimal(uniqueSeats.size()));

            // 4. Save Customer
            Customer customer = new Customer(customerName.trim(), mobile.trim(), email != null ? email.trim() : "");
            customerDAO.saveCustomer(customer, conn);

            // 5. Create Booking
            Booking booking = new Booking();
            booking.setCustomer(customer);
            booking.setTotalAmount(totalAmount);
            booking.setBookingStatus("CONFIRMED");
            bookingDAO.createBooking(booking, conn);

            // 6. Map seats in booking_seats
            bookingSeatDAO.saveBookingSeats(booking.getBookingId(), uniqueSeats, conn);

            // 7. Update seats status to 'BOOKED'
            for (String seatId : uniqueSeats) {
                seatDAO.updateSeatStatus(seatId, "BOOKED", conn);
            }

            // 8. Commit Transaction
            conn.commit();

            // Populate returned booking object
            booking.setSelectedSeats(lockedSeats);
            booking.setSeatIds(uniqueSeats);
            booking.setBookingDate(new java.sql.Timestamp(System.currentTimeMillis()));

            return booking;

        } catch (SQLException | RuntimeException e) {
            if (conn != null) {
                try {
                    conn.rollback();
                } catch (SQLException rollbackEx) {
                    System.err.println("[BookingService] Rollback error: " + rollbackEx.getMessage());
                }
            }
            throw e;
        } finally {
            if (conn != null) {
                try {
                    conn.setAutoCommit(true);
                    conn.close();
                } catch (SQLException closeEx) {
                    System.err.println("[BookingService] Connection close error: " + closeEx.getMessage());
                }
            }
        }
    }

    /**
     * Cancels a booking, updates its status to CANCELLED, and releases seats back to AVAILABLE.
     */
    public boolean cancelBooking(int bookingId) throws SQLException, IllegalStateException, IllegalArgumentException {
        if (bookingId <= 0) {
            throw new IllegalArgumentException("Invalid booking ID.");
        }

        Connection conn = null;
        try {
            conn = DatabaseConnection.getConnection();
            conn.setAutoCommit(false); // START TRANSACTION

            // Check current booking status with lock
            String checkSql = "SELECT booking_status FROM bookings WHERE booking_id = ? FOR UPDATE";
            String currentStatus = null;
            try (PreparedStatement checkStmt = conn.prepareStatement(checkSql)) {
                checkStmt.setInt(1, bookingId);
                try (ResultSet rs = checkStmt.executeQuery()) {
                    if (rs.next()) {
                        currentStatus = rs.getString("booking_status");
                    }
                }
            }

            if (currentStatus == null) {
                conn.rollback();
                throw new IllegalArgumentException("Booking with ID " + bookingId + " not found.");
            }

            if ("CANCELLED".equalsIgnoreCase(currentStatus)) {
                conn.rollback();
                throw new IllegalStateException("Booking is already CANCELLED.");
            }

            // Fetch seats assigned to this booking
            List<String> bookedSeats = new ArrayList<>();
            String seatsSql = "SELECT seat_id FROM booking_seats WHERE booking_id = ?";
            try (PreparedStatement seatStmt = conn.prepareStatement(seatsSql)) {
                seatStmt.setInt(1, bookingId);
                try (ResultSet rs = seatStmt.executeQuery()) {
                    while (rs.next()) {
                        bookedSeats.add(rs.getString("seat_id"));
                    }
                }
            }

            // Update booking status to CANCELLED
            bookingDAO.cancelBooking(bookingId, conn);

            // Release seats back to AVAILABLE
            for (String seatId : bookedSeats) {
                seatDAO.updateSeatStatus(seatId, "AVAILABLE", conn);
            }

            conn.commit(); // COMMIT TRANSACTION
            return true;

        } catch (SQLException | RuntimeException e) {
            if (conn != null) {
                try {
                    conn.rollback();
                } catch (SQLException rollbackEx) {
                    System.err.println("[BookingService] Cancellation rollback error: " + rollbackEx.getMessage());
                }
            }
            throw e;
        } finally {
            if (conn != null) {
                try {
                    conn.setAutoCommit(true);
                    conn.close();
                } catch (SQLException closeEx) {
                    System.err.println("[BookingService] Connection close error: " + closeEx.getMessage());
                }
            }
        }
    }

    /**
     * Retrieves full booking details including customer and seats.
     */
    public Booking getBookingDetails(int bookingId) throws SQLException {
        Booking booking = bookingDAO.getBookingById(bookingId);
        if (booking != null) {
            List<Seat> seats = bookingSeatDAO.getSeatsByBookingId(bookingId);
            booking.setSelectedSeats(seats);
        }
        return booking;
    }

    private void validateCustomerInput(String customerName, String mobile, List<String> seatIds) {
        if (customerName == null || customerName.trim().isEmpty()) {
            throw new IllegalArgumentException("Customer name is required.");
        }
        if (mobile == null || !MOBILE_PATTERN.matcher(mobile.trim()).matches()) {
            throw new IllegalArgumentException("Mobile number must contain exactly 10 numeric digits.");
        }
        if (seatIds == null || seatIds.isEmpty()) {
            throw new IllegalArgumentException("At least one seat must be selected.");
        }
    }
}
