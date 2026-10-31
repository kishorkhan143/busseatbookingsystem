package com.seatease.dao;

import com.seatease.database.DatabaseConnection;
import com.seatease.model.Booking;
import com.seatease.model.Customer;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

/**
 * BookingDAO
 * Handles CRUD operations for bookings.
 * Participates in transactions and executes simple SQL.
 */
public class BookingDAO {

    /**
     * Creates a booking record within an existing JDBC transaction.
     */
    public int createBooking(Booking booking, Connection conn) throws SQLException {
        String sql = "INSERT INTO bookings (customer_id, total_amount, booking_status) VALUES (?, ?, ?)";

        try (PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setInt(1, booking.getCustomer().getCustomerId());
            stmt.setBigDecimal(2, booking.getTotalAmount());
            stmt.setString(3, booking.getBookingStatus() != null ? booking.getBookingStatus() : "CONFIRMED");

            stmt.executeUpdate();

            try (ResultSet rs = stmt.getGeneratedKeys()) {
                if (rs.next()) {
                    int bookingId = rs.getInt(1);
                    booking.setBookingId(bookingId);
                    return bookingId;
                } else {
                    throw new SQLException("Creating booking failed, no generated ID returned.");
                }
            }
        }
    }

    /**
     * Retrieves booking details with customer information using SQL JOIN.
     */
    public Booking getBookingById(int bookingId) throws SQLException {
        String sql = "SELECT b.booking_id, b.total_amount, b.booking_date, b.booking_status, " +
                     "c.customer_id, c.name, c.mobile, c.email " +
                     "FROM bookings b " +
                     "JOIN customers c ON b.customer_id = c.customer_id " +
                     "WHERE b.booking_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, bookingId);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    Booking booking = new Booking();
                    booking.setBookingId(rs.getInt("booking_id"));
                    booking.setTotalAmount(rs.getBigDecimal("total_amount"));
                    booking.setBookingDate(rs.getTimestamp("booking_date"));
                    booking.setBookingStatus(rs.getString("booking_status"));

                    Customer customer = new Customer();
                    customer.setCustomerId(rs.getInt("customer_id"));
                    customer.setName(rs.getString("name"));
                    customer.setMobile(rs.getString("mobile"));
                    customer.setEmail(rs.getString("email"));

                    booking.setCustomer(customer);
                    return booking;
                }
            }
        }
        return null;
    }

    /**
     * Updates booking status to CANCELLED within a transaction.
     */
    public boolean cancelBooking(int bookingId, Connection conn) throws SQLException {
        String sql = "UPDATE bookings SET booking_status = 'CANCELLED' WHERE booking_id = ? AND booking_status = 'CONFIRMED'";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, bookingId);
            int rowsUpdated = stmt.executeUpdate();
            return rowsUpdated > 0;
        }
    }
}
