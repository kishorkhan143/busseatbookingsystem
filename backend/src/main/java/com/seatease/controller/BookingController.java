package com.seatease.controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.reflect.TypeToken;
import com.seatease.model.Booking;
import com.seatease.service.BookingService;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.lang.reflect.Type;
import java.nio.charset.StandardCharsets;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * BookingController
 * Handles booking-related REST requests:
 * - POST /api/bookings
 * - GET /api/bookings/{bookingId}
 * - POST /api/bookings/{bookingId}/cancel
 */
public class BookingController implements HttpHandler {

    private final BookingService bookingService;
    private final Gson gson;

    public BookingController() {
        this.bookingService = new BookingService();
        this.gson = new Gson();
    }

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
        this.gson = new Gson();
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        addCorsHeaders(exchange);

        String method = exchange.getRequestMethod();
        if ("OPTIONS".equalsIgnoreCase(method)) {
            exchange.sendResponseHeaders(204, -1);
            return;
        }

        String path = exchange.getRequestURI().getPath();

        try {
            if ("POST".equalsIgnoreCase(method) && "/api/bookings".equalsIgnoreCase(path)) {
                handleCreateBooking(exchange);
            } else if ("POST".equalsIgnoreCase(method) && path.matches("^/api/bookings/\\d+/cancel/?$")) {
                handleCancelBooking(exchange, path);
            } else if ("GET".equalsIgnoreCase(method) && path.matches("^/api/bookings/\\d+/?$")) {
                handleGetBooking(exchange, path);
            } else {
                sendResponse(exchange, 404, Map.of("success", false, "error", "Endpoint not found: " + path));
            }
        } catch (Exception ex) {
            Map<String, Object> err = Map.of(
                    "success", false,
                    "error", "Unexpected internal server error."
            );
            sendResponse(exchange, 500, err);
        }
    }

    private void handleCreateBooking(HttpExchange exchange) throws IOException {
        String body = readRequestBody(exchange);
        if (body == null || body.trim().isEmpty()) {
            sendResponse(exchange, 400, Map.of("success", false, "error", "Request body cannot be empty."));
            return;
        }

        try {
            JsonObject jsonObject = JsonParser.parseString(body).getAsJsonObject();

            String name = jsonObject.has("name") ? jsonObject.get("name").getAsString() : null;
            String mobile = jsonObject.has("mobile") ? jsonObject.get("mobile").getAsString() : null;
            String email = jsonObject.has("email") && !jsonObject.get("email").isJsonNull()
                    ? jsonObject.get("email").getAsString() : "";

            Type listType = new TypeToken<List<String>>() {}.getType();
            List<String> seatIds = gson.fromJson(jsonObject.get("seatIds"), listType);

            Booking booking = bookingService.createBooking(name, mobile, email, seatIds);

            Map<String, Object> resp = new HashMap<>();
            resp.put("success", true);
            resp.put("message", "Booking confirmed successfully!");
            resp.put("data", booking);

            sendResponse(exchange, 201, resp);

        } catch (IllegalArgumentException e) {
            sendResponse(exchange, 400, Map.of("success", false, "error", e.getMessage()));
        } catch (IllegalStateException e) {
            sendResponse(exchange, 409, Map.of("success", false, "error", e.getMessage()));
        } catch (SQLException e) {
            sendResponse(exchange, 500, Map.of("success", false, "error", "Database error occurred during booking."));
        } catch (Exception e) {
            sendResponse(exchange, 400, Map.of("success", false, "error", "Malformed JSON request."));
        }
    }

    private void handleGetBooking(HttpExchange exchange, String path) throws IOException {
        int bookingId = extractBookingId(path, "/api/bookings/");
        try {
            Booking booking = bookingService.getBookingDetails(bookingId);
            if (booking == null) {
                sendResponse(exchange, 404, Map.of("success", false, "error", "No booking found with ID: " + bookingId));
                return;
            }
            sendResponse(exchange, 200, Map.of("success", true, "data", booking));
        } catch (SQLException e) {
            sendResponse(exchange, 500, Map.of("success", false, "error", "Database error fetching booking details."));
        }
    }

    private void handleCancelBooking(HttpExchange exchange, String path) throws IOException {
        int bookingId = extractBookingId(path, "/api/bookings/");
        try {
            boolean cancelled = bookingService.cancelBooking(bookingId);
            if (cancelled) {
                sendResponse(exchange, 200, Map.of(
                        "success", true,
                        "message", "Booking #" + bookingId + " cancelled successfully. Seats have been released.",
                        "bookingId", bookingId,
                        "status", "CANCELLED"
                ));
            } else {
                sendResponse(exchange, 400, Map.of("success", false, "error", "Could not cancel booking."));
            }
        } catch (IllegalArgumentException e) {
            sendResponse(exchange, 404, Map.of("success", false, "error", e.getMessage()));
        } catch (IllegalStateException e) {
            sendResponse(exchange, 409, Map.of("success", false, "error", e.getMessage()));
        } catch (SQLException e) {
            sendResponse(exchange, 500, Map.of("success", false, "error", "Database error during booking cancellation."));
        }
    }

    private int extractBookingId(String path, String prefix) {
        String clean = path.replace(prefix, "").replace("/cancel", "").replace("/", "");
        return Integer.parseInt(clean);
    }

    private String readRequestBody(HttpExchange exchange) throws IOException {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(exchange.getRequestBody(), StandardCharsets.UTF_8))) {
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
            return sb.toString();
        }
    }

    private void addCorsHeaders(HttpExchange exchange) {
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    }

    private void sendResponse(HttpExchange exchange, int statusCode, Object data) throws IOException {
        String json = gson.toJson(data);
        byte[] bytes = json.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
        exchange.sendResponseHeaders(statusCode, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }
}
