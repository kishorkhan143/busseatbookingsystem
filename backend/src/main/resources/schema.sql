-- ======================================================================
-- SeatEase - Online Seat Booking System Database Schema
-- Database Name: seatease_db
-- ======================================================================

CREATE DATABASE IF NOT EXISTS seatease_db;
USE seatease_db;

-- 1. Table: seats
DROP TABLE IF EXISTS booking_seats;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS seats;

CREATE TABLE seats (
    seat_id VARCHAR(5) PRIMARY KEY,
    row_name VARCHAR(1) NOT NULL,
    seat_number INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE'
);

-- 2. Table: customers
CREATE TABLE customers (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    mobile VARCHAR(10) NOT NULL,
    email VARCHAR(150)
);

-- 3. Table: bookings
CREATE TABLE bookings (
    booking_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    booking_status VARCHAR(20) NOT NULL DEFAULT 'CONFIRMED',
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE
);

-- 4. Table: booking_seats (Many-to-Many mapping)
CREATE TABLE booking_seats (
    booking_id INT NOT NULL,
    seat_id VARCHAR(5) NOT NULL,
    PRIMARY KEY (booking_id, seat_id),
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE,
    FOREIGN KEY (seat_id) REFERENCES seats(seat_id) ON DELETE CASCADE
);

-- ======================================================================
-- Initial Data Seeding: 30 Seats (5 Rows A-E, 6 Seats each, Rs. 150 each)
-- ======================================================================
INSERT INTO seats (seat_id, row_name, seat_number, price, status) VALUES
-- Row A
('A1', 'A', 1, 150.00, 'AVAILABLE'),
('A2', 'A', 2, 150.00, 'AVAILABLE'),
('A3', 'A', 3, 150.00, 'AVAILABLE'),
('A4', 'A', 4, 150.00, 'AVAILABLE'),
('A5', 'A', 5, 150.00, 'AVAILABLE'),
('A6', 'A', 6, 150.00, 'AVAILABLE'),

-- Row B
('B1', 'B', 1, 150.00, 'AVAILABLE'),
('B2', 'B', 2, 150.00, 'AVAILABLE'),
('B3', 'B', 3, 150.00, 'AVAILABLE'),
('B4', 'B', 4, 150.00, 'AVAILABLE'),
('B5', 'B', 5, 150.00, 'AVAILABLE'),
('B6', 'B', 6, 150.00, 'AVAILABLE'),

-- Row C
('C1', 'C', 1, 150.00, 'AVAILABLE'),
('C2', 'C', 2, 150.00, 'AVAILABLE'),
('C3', 'C', 3, 150.00, 'AVAILABLE'),
('C4', 'C', 4, 150.00, 'AVAILABLE'),
('C5', 'C', 5, 150.00, 'AVAILABLE'),
('C6', 'C', 6, 150.00, 'AVAILABLE'),

-- Row D
('D1', 'D', 1, 150.00, 'AVAILABLE'),
('D2', 'D', 2, 150.00, 'AVAILABLE'),
('D3', 'D', 3, 150.00, 'AVAILABLE'),
('D4', 'D', 4, 150.00, 'AVAILABLE'),
('D5', 'D', 5, 150.00, 'AVAILABLE'),
('D6', 'D', 6, 150.00, 'AVAILABLE'),

-- Row E
('E1', 'E', 1, 150.00, 'AVAILABLE'),
('E2', 'E', 2, 150.00, 'AVAILABLE'),
('E3', 'E', 3, 150.00, 'AVAILABLE'),
('E4', 'E', 4, 150.00, 'AVAILABLE'),
('E5', 'E', 5, 150.00, 'AVAILABLE'),
('E6', 'E', 6, 150.00, 'AVAILABLE');

-- Verification Query
-- SELECT COUNT(*) AS total_seats, status FROM seats GROUP BY status;
