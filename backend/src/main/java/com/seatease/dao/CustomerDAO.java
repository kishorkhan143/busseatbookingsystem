package com.seatease.dao;

import com.seatease.database.DatabaseConnection;
import com.seatease.model.Customer;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

/**
 * CustomerDAO
 * Handles persistence operations for customers using PreparedStatements.
 */
public class CustomerDAO {

    /**
     * Inserts customer and returns the generated customer_id.
     * Takes an external connection so it can participate in transactions.
     */
    public int saveCustomer(Customer customer, Connection conn) throws SQLException {
        String sql = "INSERT INTO customers (name, mobile, email) VALUES (?, ?, ?)";

        try (PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setString(1, customer.getName());
            stmt.setString(2, customer.getMobile());
            stmt.setString(3, customer.getEmail() != null ? customer.getEmail() : "");

            stmt.executeUpdate();

            try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    int id = generatedKeys.getInt(1);
                    customer.setCustomerId(id);
                    return id;
                } else {
                    throw new SQLException("Creating customer failed, no generated key obtained.");
                }
            }
        }
    }

    public Customer getCustomerById(int customerId) throws SQLException {
        String sql = "SELECT customer_id, name, mobile, email FROM customers WHERE customer_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, customerId);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    Customer customer = new Customer();
                    customer.setCustomerId(rs.getInt("customer_id"));
                    customer.setName(rs.getString("name"));
                    customer.setMobile(rs.getString("mobile"));
                    customer.setEmail(rs.getString("email"));
                    return customer;
                }
            }
        }
        return null;
    }
}
