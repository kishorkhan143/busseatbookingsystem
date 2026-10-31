package com.seatease.model;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

/**
 * Booking Model Class
 * Demonstrates:
 * - Composition (Booking HAS-A Customer, Booking HAS-MANY Seats)
 * - Encapsulation (private fields, accessors, mutators)
 */
public class Booking {
    private int bookingId;
    private Customer customer;
    private List<Seat> selectedSeats = new ArrayList<>();
    private List<String> seatIds = new ArrayList<>();
    private BigDecimal totalAmount;
    private Timestamp bookingDate;
    private String bookingStatus; // "CONFIRMED", "CANCELLED"

    public Booking() {
    }

    public Booking(Customer customer, List<Seat> selectedSeats, BigDecimal totalAmount, String bookingStatus) {
        this.customer = customer;
        this.selectedSeats = selectedSeats;
        this.totalAmount = totalAmount;
        this.bookingStatus = bookingStatus;
        if (selectedSeats != null) {
            for (Seat s : selectedSeats) {
                this.seatIds.add(s.getSeatId());
            }
        }
    }

    public int getBookingId() {
        return bookingId;
    }

    public void setBookingId(int bookingId) {
        this.bookingId = bookingId;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public List<Seat> getSelectedSeats() {
        return selectedSeats;
    }

    public void setSelectedSeats(List<Seat> selectedSeats) {
        this.selectedSeats = selectedSeats;
        if (selectedSeats != null) {
            this.seatIds = new ArrayList<>();
            for (Seat s : selectedSeats) {
                this.seatIds.add(s.getSeatId());
            }
        }
    }

    public List<String> getSeatIds() {
        return seatIds;
    }

    public void setSeatIds(List<String> seatIds) {
        this.seatIds = seatIds;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public Timestamp getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(Timestamp bookingDate) {
        this.bookingDate = bookingDate;
    }

    public String getBookingStatus() {
        return bookingStatus;
    }

    public void setBookingStatus(String bookingStatus) {
        this.bookingStatus = bookingStatus;
    }

    @Override
    public String toString() {
        return "Booking{" +
                "bookingId=" + bookingId +
                ", customer=" + customer +
                ", seatIds=" + seatIds +
                ", totalAmount=" + totalAmount +
                ", bookingDate=" + bookingDate +
                ", bookingStatus='" + bookingStatus + '\'' +
                '}';
    }
}
