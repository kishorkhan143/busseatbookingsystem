package com.seatease.dao;

import com.seatease.database.DatabaseConnection;
import com.seatease.model.Seat;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * BookingSeatDAO
 * Manages the junction table booking_seats.
 */
public class BookingSeatDAO {

    /**
     * Maps seats to a booking inside an ongoing JDBC transaction.
     */
    public void saveBookingSeats(int bookingId, List<String> seatIds, Connection conn) throws SQLException {
        String sql = "INSERT INTO booking_seats (booking_id, seat_id) VALUES (?, ?)";

        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            for (String seatId : seatIds) {
                stmt.setInt(1, bookingId);
                stmt.setString(2, seatId);
                stmt.addBatch();
            }
            stmt.executeBatch();
        }
    }

    /**
     * Retrieves all seats mapped to a specific booking ID with seat details.
     */
    public List<Seat> getSeatsByBookingId(int bookingId) throws SQLException {
        List<Seat> seats = new ArrayList<>();
        String sql = "SELECT s.seat_id, s.row_name, s.seat_number, s.price, s.status " +
                     "FROM seats s " +
                     "JOIN booking_seats bs ON s.seat_id = bs.seat_id " +
                     "WHERE bs.booking_id = ? " +
                     "ORDER BY s.row_name, s.seat_number";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, bookingId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    Seat seat = new Seat();
                    seat.setSeatId(rs.getString("seat_id"));
                    seat.setRowName(rs.getString("row_name"));
                    seat.setSeatNumber(rs.getInt("seat_number"));
                    seat.setPrice(rs.getBigDecimal("price"));
                    seat.setStatus(rs.getString("status"));
                    seats.add(seat);
                }
            }
        }
        return seats;
    }
}
