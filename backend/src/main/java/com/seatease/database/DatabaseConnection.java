package com.seatease.database;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * DatabaseConnection Utility
 * Manages JDBC connection lifecycle to MySQL.
 * Reads environment variables with safe development defaults.
 */
public class DatabaseConnection {

    private static final String DEFAULT_URL = "jdbc:mysql://localhost:3306/seatease_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
    private static final String DEFAULT_USER = "root";
    private static final String DEFAULT_PASSWORD = "";

    // Static block to safely load MySQL JDBC Driver
    static {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            System.err.println("CRITICAL: MySQL JDBC Driver (com.mysql.cj.jdbc.Driver) not found on classpath!");
        }
    }

    private DatabaseConnection() {
        // Private constructor prevents instantiation (Utility Pattern)
    }

    /**
     * Obtains a new JDBC database connection.
     * Environment variables DB_URL, DB_USERNAME, DB_PASSWORD take precedence.
     */
    public static Connection getConnection() throws SQLException {
        String url = System.getenv("DB_URL");
        if (url == null || url.trim().isEmpty()) {
            url = DEFAULT_URL;
        }

        String user = System.getenv("DB_USERNAME");
        if (user == null || user.trim().isEmpty()) {
            user = DEFAULT_USER;
        }

        String password = System.getenv("DB_PASSWORD");
        if (password == null) {
            password = DEFAULT_PASSWORD;
        }

        try {
            return DriverManager.getConnection(url, user, password);
        } catch (SQLException e) {
            System.err.println("[DatabaseConnection] Error establishing JDBC connection: " + e.getMessage());
            throw e;
        }
    }
}
