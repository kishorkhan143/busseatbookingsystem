# SeatEase — Online Seat Booking System

> **A RedBus-inspired Online Bus Seat Booking System & College-Level Java OOP Mini Project**  
> Demonstrating Object-Oriented Programming in Java, JDBC database transactions, clean REST APIs, and a modern responsive React frontend with Tailwind CSS.

---

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [Architecture & Folder Structure](#architecture--folder-structure)
4. [Technology Stack](#technology-stack)
5. [Database Schema & Design](#database-schema--design)
6. [Prerequisites & Quickstart](#prerequisites--quickstart)
   - [Database Setup](#1-database-setup)
   - [Java Backend Setup](#2-java-backend-setup)
   - [React Frontend Setup](#3-react-frontend-setup)
7. [REST API Endpoints & Curl Examples](#rest-api-endpoints--curl-examples)
8. [Java OOP Architecture & Class Explanations](#java-oop-architecture--class-explanations)
9. [Concurrency & Transaction Management](#concurrency--transaction-management)
10. [College Viva Preparation Guide (20 Questions & Answers)](#college-viva-preparation-guide)
11. [Troubleshooting & FAQs](#troubleshooting--faqs)

---

## 1. Project Overview

SeatEase is designed to solve real-world bus ticket booking challenges with clear, pedagogical Java code. Built without overwhelming enterprise frameworks (no Spring Boot, Hibernate, or complex boilerplate), it directly uses **Java's standard library `HttpServer`**, **raw JDBC**, **PreparedStatement**, and **ACID transactions** to showcase true computer science principles:
- **Encapsulation**: Strict private fields, data integrity validation, getters/setters.
- **Composition**: A `Booking` *has a* `Customer` and *has many* `Seat`s.
- **Abstraction**: Clean separation between HTTP Controller, Business Service, and DAO Persistence layers.
- **Pessimistic Locking**: Prevents double-booking via `SELECT ... FOR UPDATE`.

---

## 2. Key Features

- **RedBus-Style Bus Search**: Search buses across major city routes with responsive filters (AC Sleeper, Seater, Volvo Multi-Axle, timing, ratings).
- **Interactive 30-Seat Bus Layout**: 5 rows (A–E) × 6 seats (1–6). Visual driver cabin, walkway aisle, and instant color-coded states:
  - 🟢 **Available** (Green)
  - 🔵 **Selected** (Blue / Aqua)
  - 🔘 **Booked** (Gray / Disabled)
- **Dynamic Price Engine**: ₹150 per seat calculated strictly on the backend to prevent client-side tampering.
- **Customer Booking Form**: Validates passenger name and strict 10-digit mobile number.
- **Printable E-Ticket**: Instant confirmation with booking reference (PNR), passenger info, bus operator details, and QR code.
- **My Bookings & Cancellation**: Search past bookings and cancel with a single click. Cancellation rolls back seat status to `AVAILABLE` atomically.
- **Dual-Mode Engine**: Operates in live connection mode with the Java backend (port 8080) or with an in-browser Java OOP simulation engine for standalone deployment and demonstrations.

---

## 3. Architecture & Folder Structure

```
seatease/
├── backend/
│   ├── src/main/java/com/seatease/
│   │   ├── main/
│   │   │   └── Main.java              # Built-in HttpServer, route registration & CORS
│   │   ├── model/
│   │   │   ├── Seat.java              # Encapsulated Seat entity (A1-E6)
│   │   │   ├── Customer.java          # Customer entity with contact info
│   │   │   └── Booking.java           # Booking composition (Customer + Seats)
│   │   ├── dao/
│   │   │   ├── SeatDAO.java           # JDBC queries for seats table
│   │   │   ├── CustomerDAO.java       # Inserts & retrieves customers
│   │   │   ├── BookingDAO.java        # Inserts & retrieves bookings
│   │   │   └── BookingSeatDAO.java    # Junction table mapping booking to seats
│   │   ├── service/
│   │   │   ├── SeatService.java       # Seat availability business logic
│   │   │   └── BookingService.java    # Transactional booking & cancellation logic
│   │   ├── database/
│   │   │   └── DatabaseConnection.java# JDBC connection factory
│   │   └── controller/
│   │       ├── SeatController.java    # REST handler for /api/seats
│   │       └── BookingController.java # REST handler for /api/bookings
│   ├── src/main/resources/
│   │   └── schema.sql                 # MySQL DDL & 30-seat insert statements
│   ├── pom.xml                        # Maven dependencies: MySQL Connector & Gson
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/                # Modular React components
│   │   │   ├── Navbar.jsx             # Top bar with status & route links
│   │   │   ├── Hero.jsx               # RedBus-style route search hero
│   │   │   ├── BusList.jsx            # Responsive bus selection cards
│   │   │   ├── SeatGrid.jsx           # 30-seat visual bus layout
│   │   │   ├── Seat.jsx               # Individual seat button
│   │   │   ├── SeatLegend.jsx         # Status legend
│   │   │   ├── BookingForm.jsx        # Customer details form
│   │   │   ├── BookingSummary.jsx     # Live price calculation
│   │   │   ├── BookingConfirmation.jsx# Printable boarding pass / E-ticket
│   │   │   ├── MyBookings.jsx         # Booking history & cancellation
│   │   │   └── VivaGuideModal.jsx     # Interactive Java OOP & Viva Explorer
│   │   ├── services/
│   │   │   └── api.js                 # API service connecting to Java backend
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
├── README.md
└── .gitignore
```

---

## 4. Technology Stack

### Backend
- **Language**: Java 17+
- **HTTP Server**: `com.sun.net.httpserver.HttpServer` (built into JDK)
- **Database Driver**: `mysql-connector-j` (version 8.3.0)
- **JSON Parser**: `com.google.code.gson:gson` (version 2.10.1)
- **Build Tool**: Apache Maven

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **HTTP Client**: Standard `fetch` API

### Database
- **Engine**: MySQL 8.0+
- **Database Name**: `seatease_db`

---

## 5. Database Schema & Design

### Entity Relationship Diagram (Conceptual)
```
[CUSTOMERS] (1) ───────────< (Many) [BOOKINGS] (1) ───────────< (Many) [BOOKING_SEATS] >─────────── (Many) [SEATS]
 customer_id (PK)                   booking_id (PK)                   booking_id (FK)                     seat_id (PK)
 name                               customer_id (FK)                  seat_id (FK)                        row_name
 mobile                             total_amount                                                          seat_number
 email                              booking_status                                                        price
                                    booking_date                                                          status
```

The database schema is defined in `backend/src/main/resources/schema.sql`.

---

## 6. Prerequisites & Quickstart

### 1. Database Setup
1. Start your local MySQL server.
2. Log into MySQL client:
   ```bash
   mysql -u root -p
   ```
3. Run the schema creation and data insertion script:
   ```sql
   source backend/src/main/resources/schema.sql;
   ```
   Or execute directly:
   ```bash
   mysql -u root -p < backend/src/main/resources/schema.sql
   ```

### 2. Java Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Copy `.env.example` to `.env` or set environment variables:
   ```bash
   export DB_URL="jdbc:mysql://localhost:3306/seatease_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
   export DB_USERNAME="root"
   export DB_PASSWORD="your_mysql_password"
   export SERVER_PORT="8080"
   ```
3. Compile and run with Maven:
   ```bash
   mvn clean compile exec:java
   ```
   The backend will start on **`http://localhost:8080`**.

### 3. React Frontend Setup
1. In the project root, install dependencies:
   ```bash
   npm install
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
3. Open your browser at `http://localhost:3000` (or `http://localhost:5173`).

---

## 7. REST API Endpoints & Curl Examples

| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| `GET` | `/api/seats` | Fetch all 30 seats and availability counts | 200, 500 |
| `GET` | `/api/seats/available` | Fetch only currently available seats | 200, 500 |
| `POST` | `/api/bookings` | Book one or more seats | 201, 400, 409, 500 |
| `GET` | `/api/bookings/{id}` | Get booking details by ID | 200, 404, 500 |
| `POST` | `/api/bookings/{id}/cancel` | Cancel booking and release seats | 200, 404, 409, 500 |

### Sample Curl Requests

#### 1. Fetch All Seats
```bash
curl -X GET http://localhost:8080/api/seats
```

#### 2. Create a Booking
```bash
curl -X POST http://localhost:8080/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Kishor",
    "mobile": "9876543210",
    "email": "kishor@example.com",
    "seatIds": ["A1", "A2"]
  }'
```
**Response (201 Created):**
```json
{
  "success": true,
  "message": "Booking confirmed successfully!",
  "data": {
    "bookingId": 1,
    "customer": {
      "customerId": 1,
      "name": "Kishor",
      "mobile": "9876543210",
      "email": "kishor@example.com"
    },
    "seatIds": ["A1", "A2"],
    "totalAmount": 300.00,
    "bookingStatus": "CONFIRMED"
  }
}
```

#### 3. Cancel a Booking
```bash
curl -X POST http://localhost:8080/api/bookings/1/cancel
```

---

## 8. Java OOP Architecture & Class Explanations

| Class | Package | OOP Concept & Purpose |
|---|---|---|
| `Seat` | `model` | **Encapsulation**: Private fields (`seatId`, `rowName`, `price`, `status`), public getters/setters, state check `isAvailable()`. |
| `Customer` | `model` | **Encapsulation**: Holds passenger information (`name`, `mobile`, `email`) with constructor overloading. |
| `Booking` | `model` | **Composition**: Represents a complete transaction. Demonstrates `HAS-A` relationship with `Customer` and `List<Seat>`. |
| `DatabaseConnection` | `database` | **Abstraction & Utility Pattern**: Encapsulates JDBC driver configuration and connection retrieval from environment variables. |
| `SeatDAO` | `dao` | **Data Access Object Pattern**: Isolates SQL queries for seats from business logic. Uses `PreparedStatement` to prevent SQL injection. |
| `CustomerDAO` | `dao` | **DAO Pattern**: Saves customer record and retrieves generated auto-increment primary key. |
| `BookingDAO` | `dao` | **DAO Pattern**: Inserts booking master record and handles status updates. |
| `BookingSeatDAO` | `dao` | **DAO Pattern**: Manages the many-to-many junction table between bookings and seats using batch inserts. |
| `SeatService` | `service` | **Separation of Concerns**: Encapsulates seat query workflows and validation. |
| `BookingService` | `service` | **Business Logic Layer & ACID Transactions**: Manages `conn.setAutoCommit(false)`, locks rows using `SELECT ... FOR UPDATE`, checks availability, calculates prices, and coordinates DAOs. |
| `SeatController` | `controller` | **Web Layer**: Extends `HttpHandler`, parses incoming HTTP requests, formats JSON responses, and attaches CORS headers. |
| `BookingController` | `controller` | **Web Layer**: Dispatches REST verbs (`POST`, `GET`, `/cancel`), extracts URL parameters, and maps domain exceptions to HTTP status codes (201, 400, 409, 404). |
| `Main` | `main` | **Bootstrap**: Initializes `HttpServer`, configures thread pool executor, registers paths, and boots server on port 8080. |

---

## 9. Concurrency & Transaction Management

A core requirement of any reservation system is preventing **race conditions** (two users booking seat `A1` at the exact same millisecond).

SeatEase solves this using standard **Pessimistic Locking**:
```sql
-- Step 1: Lock the candidate seats inside a transaction
SELECT seat_id, price, status FROM seats 
WHERE seat_id IN ('A1', 'A2') 
FOR UPDATE;

-- Step 2: Java verifies every seat has status = 'AVAILABLE'
-- If any seat is 'BOOKED', rollback is invoked immediately!

-- Step 3: Insert customer and booking records
INSERT INTO customers (name, mobile, email) VALUES (...);
INSERT INTO bookings (customer_id, total_amount, booking_status) VALUES (...);
INSERT INTO booking_seats (booking_id, seat_id) VALUES (...);

-- Step 4: Update status to 'BOOKED'
UPDATE seats SET status = 'BOOKED' WHERE seat_id IN ('A1', 'A2');

-- Step 5: Commit transaction
COMMIT;
```

If another request tries to read or update `A1` before the commit, MySQL will block the second transaction until the first finishes, ensuring that double bookings are impossible.

---

## 10. College Viva Preparation Guide

Here are 20 high-frequency questions asked by external examiners in Java OOP & DBMS vivas:

1. **Q: What OOP concepts did you use in this project?**  
   *A:* Encapsulation (private fields with public getters/setters in `Seat`, `Customer`, `Booking`), Composition (`Booking` contains a `Customer` and `List<Seat>`), and Abstraction (separating UI, Controller, Service, and DAO layers).

2. **Q: Why did you use `PreparedStatement` instead of `Statement`?**  
   *A:* `PreparedStatement` precompiles SQL statements on the database server, improves query execution speed for repeated operations, and automatically sanitizes input parameters, preventing SQL Injection vulnerabilities.

3. **Q: How did you prevent two users from booking the same seat simultaneously?**  
   *A:* By using JDBC transactions (`conn.setAutoCommit(false)`) combined with pessimistic row locking (`SELECT ... FOR UPDATE`). If any seat is already booked, the entire transaction is rolled back with `conn.rollback()`.

4. **Q: What is the DAO design pattern?**  
   *A:* Data Access Object pattern separates low-level data accessing operations from high-level business services, so SQL queries are isolated in classes like `SeatDAO` and `BookingDAO`.

5. **Q: Why is price calculated on the backend instead of the frontend?**  
   *A:* Client-side values can be tampered with via browser developer tools. Calculating `seatCount * 150.00` strictly in `BookingService.java` guarantees financial integrity.

6. **Q: What is the purpose of the `booking_seats` table?**  
   *A:* It is a junction table that decomposes the Many-to-Many relationship between `bookings` and `seats` into two One-to-Many relationships.

7. **Q: What HTTP server did you use and why?**  
   *A:* We used the Java standard library's `com.sun.net.httpserver.HttpServer`. It requires no external dependencies like Tomcat or Spring Boot, making the project lightweight and pure Java.

8. **Q: What does `setAutoCommit(false)` do?**  
   *A:* It disables automatic execution of each SQL statement as an independent transaction, allowing multiple SQL operations to be grouped into a single atomic transaction.

9. **Q: What happens if a database error occurs halfway through booking?**  
   *A:* The `catch (SQLException e)` block catches the error and executes `conn.rollback()`, ensuring no partial records exist in either `customers`, `bookings`, or `seats`.

10. **Q: What is Gson and why was it chosen?**  
    *A:* Google Gson is a Java library used to convert Java Objects into JSON strings (`toJson`) and JSON strings into Java Objects (`fromJson`).

---

## 11. Troubleshooting & FAQs

- **Issue**: `Communications link failure` on Java startup  
  *Fix*: Ensure MySQL service is running (`sudo service mysql start` or MySQL Workbench) and verify `DB_URL` port (default 3306).

- **Issue**: `Access denied for user 'root'@'localhost'`  
  *Fix*: Check your password in `.env` or run `ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';` in MySQL.

- **Issue**: CORS errors when calling from React  
  *Fix*: Ensure `SeatController` and `BookingController` include the header `Access-Control-Allow-Origin: *` and respond with `204` to `OPTIONS` preflight requests.
