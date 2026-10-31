package com.seatease.service;

import com.seatease.dao.SeatDAO;
import com.seatease.model.Seat;

import java.sql.SQLException;
import java.util.List;

/**
 * SeatService
 * Handles business logic and validations regarding seats.
 */
public class SeatService {

    private final SeatDAO seatDAO;

    public SeatService() {
        this.seatDAO = new SeatDAO();
    }

    public SeatService(SeatDAO seatDAO) {
        this.seatDAO = seatDAO;
    }

    public List<Seat> getAllSeats() throws SQLException {
        return seatDAO.getAllSeats();
    }

    public List<Seat> getAvailableSeats() throws SQLException {
        return seatDAO.getAvailableSeats();
    }

    public Seat getSeatById(String seatId) throws SQLException {
        if (seatId == null || seatId.trim().isEmpty()) {
            throw new IllegalArgumentException("Seat ID must not be empty.");
        }
        return seatDAO.getSeatById(seatId.trim().toUpperCase());
    }

    public boolean isSeatAvailable(String seatId) throws SQLException {
        Seat seat = getSeatById(seatId);
        return seat != null && seat.isAvailable();
    }
}
