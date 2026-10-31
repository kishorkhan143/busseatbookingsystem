package com.seatease.main;

import com.seatease.controller.BookingController;
import com.seatease.controller.SeatController;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.util.concurrent.Executors;

/**
 * SeatEase Java Backend Entry Point
 * Uses Java's lightweight built-in HttpServer (com.sun.net.httpserver.HttpServer).
 * Avoids heavy frameworks like Spring Boot to satisfy mini-project college criteria.
 */
public class Main {

    private static final int DEFAULT_PORT = 8080;

    public static void main(String[] args) {
        int port = DEFAULT_PORT;
        String portEnv = System.getenv("SERVER_PORT");
        if (portEnv != null && !portEnv.trim().isEmpty()) {
            try {
                port = Integer.parseInt(portEnv.trim());
            } catch (NumberFormatException e) {
                System.out.println("Warning: Invalid SERVER_PORT env var, using default 8080.");
            }
        }

        try {
            HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);

            // Register REST Controllers
            SeatController seatController = new SeatController();
            BookingController bookingController = new BookingController();

            server.createContext("/api/seats", seatController);
            server.createContext("/api/bookings", bookingController);

            // Configure multi-threaded executor for handling concurrent client requests
            server.setExecutor(Executors.newFixedThreadPool(10));

            server.start();

            printStartupBanner(port);

        } catch (IOException e) {
            System.err.println("Fatal: Failed to start SeatEase HTTP server on port " + port);
            e.printStackTrace();
        }
    }

    private static void printStartupBanner(int port) {
        System.out.println("===============================================================");
        System.out.println("   ____             _   ______                 ");
        System.out.println("  / __/ ___  ___ _ / /_ / ____/___ _ ___ ___   ");
        System.out.println(" _\\ \\  / -_)/ _ `// __// __/  / _ `// _ \\/ -_) ");
        System.out.println("/___/  \\__/ \\_,_/ \\__/ /_____/ \\_,_/ /_//_/\\__/  ");
        System.out.println("   SeatEase - Online Seat Booking System (Java OOP)   ");
        System.out.println("===============================================================");
        System.out.println(">> Server running on: http://localhost:" + port);
        System.out.println(">> API Endpoints:");
        System.out.println("   - GET  /api/seats");
        System.out.println("   - GET  /api/seats/available");
        System.out.println("   - POST /api/bookings");
        System.out.println("   - GET  /api/bookings/{id}");
        System.out.println("   - POST /api/bookings/{id}/cancel");
        System.out.println("===============================================================");
    }
}
