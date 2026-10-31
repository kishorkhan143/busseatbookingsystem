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
 * SeatDAO (Data Access Object)
 * Encapsulates all SQL & JDBC operations for the seats table.
 * Uses PreparedStatements for all parameterized queries.
 */
public class SeatDAO {

    public List<Seat> getAllSeats() throws SQLException {
        List<Seat> seats = new ArrayList<>();
        String sql = "SELECT seat_id, row_name, seat_number, price, status FROM seats ORDER BY row_name ASC, seat_number ASC";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                seats.add(mapResultSetToSeat(rs));
            }
        }
        return seats;
    }

    public List<Seat> getAvailableSeats() throws SQLException {
        List<Seat> seats = new ArrayList<>();
        String sql = "SELECT seat_id, row_name, seat_number, price, status FROM seats WHERE status = 'AVAILABLE' ORDER BY row_name ASC, seat_number ASC";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                seats.add(mapResultSetToSeat(rs));
            }
        }
        return seats;
    }

    public Seat getSeatById(String seatId) throws SQLException {
        String sql = "SELECT seat_id, row_name, seat_number, price, status FROM seats WHERE seat_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, seatId);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToSeat(rs);
                }
            }
        }
        return null;
    }

    /**
     * Updates seat status using a provided transaction Connection.
     */
    public boolean updateSeatStatus(String seatId, String status, Connection conn) throws SQLException {
        String sql = "UPDATE seats SET status = ? WHERE seat_id = ?";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, status);
            stmt.setString(2, seatId);
            return stmt.executeUpdate() > 0;
        }
    }

    private Seat mapResultSetToSeat(ResultSet rs) throws SQLException {
        Seat seat = new Seat();
        seat.setSeatId(rs.getString("seat_id"));
        seat.setRowName(rs.getString("row_name"));
        seat.setSeatNumber(rs.getInt("seat_number"));
        seat.setPrice(rs.getBigDecimal("price"));
        seat.setStatus(rs.getString("status"));
        return seat;
    }
}
