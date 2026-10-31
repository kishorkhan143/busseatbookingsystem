package com.seatease.controller;

import com.google.gson.Gson;
import com.seatease.model.Seat;
import com.seatease.service.SeatService;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * SeatController
 * Handles seat REST endpoints:
 * - GET /api/seats
 * - GET /api/seats/available
 */
public class SeatController implements HttpHandler {

    private final SeatService seatService;
    private final Gson gson;

    public SeatController() {
        this.seatService = new SeatService();
        this.gson = new Gson();
    }

    public SeatController(SeatService seatService) {
        this.seatService = seatService;
        this.gson = new Gson();
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        // Add CORS Headers
        addCorsHeaders(exchange);

        String method = exchange.getRequestMethod();
        if ("OPTIONS".equalsIgnoreCase(method)) {
            exchange.sendResponseHeaders(204, -1);
            return;
        }

        if (!"GET".equalsIgnoreCase(method)) {
            sendResponse(exchange, 405, Map.of("error", "Method Not Allowed. Use GET."));
            return;
        }

        String path = exchange.getRequestURI().getPath();

        try {
            if ("/api/seats/available".equalsIgnoreCase(path)) {
                List<Seat> availableSeats = seatService.getAvailableSeats();
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("count", availableSeats.size());
                response.put("data", availableSeats);
                sendResponse(exchange, 200, response);
            } else {
                List<Seat> allSeats = seatService.getAllSeats();
                long availableCount = allSeats.stream().filter(Seat::isAvailable).count();
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("totalSeats", allSeats.size());
                response.put("availableCount", availableCount);
                response.put("bookedCount", allSeats.size() - availableCount);
                response.put("data", allSeats);
                sendResponse(exchange, 200, response);
            }
        } catch (SQLException e) {
            Map<String, Object> err = Map.of(
                    "success", false,
                    "error", "Database error occurred while fetching seats."
            );
            sendResponse(exchange, 500, err);
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
