package com.seatease.model;

import java.math.BigDecimal;

/**
 * Seat Model Class
 * Demonstrates:
 * - Encapsulation (private fields, public getters/setters)
 * - Constructor initialization
 */
public class Seat {
    private String seatId;       // e.g., "A1", "B3"
    private String rowName;      // e.g., "A", "B"
    private int seatNumber;      // e.g., 1, 2, 3
    private BigDecimal price;    // e.g., 150.00
    private String status;       // "AVAILABLE", "SELECTED", "BOOKED"

    // Default constructor (required for serialization/frameworks)
    public Seat() {
    }

    // Parameterized constructor
    public Seat(String seatId, String rowName, int seatNumber, BigDecimal price, String status) {
        this.seatId = seatId;
        this.rowName = rowName;
        this.seatNumber = seatNumber;
        this.price = price;
        this.status = status;
    }

    // Getters and Setters (Encapsulation)
    public String getSeatId() {
        return seatId;
    }

    public void setSeatId(String seatId) {
        this.seatId = seatId;
    }

    public String getRowName() {
        return rowName;
    }

    public void setRowName(String rowName) {
        this.rowName = rowName;
    }

    public int getSeatNumber() {
        return seatNumber;
    }

    public void setSeatNumber(int seatNumber) {
        this.seatNumber = seatNumber;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public boolean isAvailable() {
        return "AVAILABLE".equalsIgnoreCase(this.status);
    }

    @Override
    public String toString() {
        return "Seat{" +
                "seatId='" + seatId + '\'' +
                ", rowName='" + rowName + '\'' +
                ", seatNumber=" + seatNumber +
                ", price=" + price +
                ", status='" + status + '\'' +
                '}';
    }
}
