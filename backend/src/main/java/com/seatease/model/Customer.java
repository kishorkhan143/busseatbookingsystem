package com.seatease.model;

/**
 * Customer Model Class
 * Represents passenger/customer purchasing seats.
 * Demonstrates Encapsulation and Data Validation helper methods.
 */
public class Customer {
    private int customerId;
    private String name;
    private String mobile;
    private String email;

    public Customer() {
    }

    public Customer(String name, String mobile, String email) {
        this.name = name;
        this.mobile = mobile;
        this.email = email;
    }

    public Customer(int customerId, String name, String mobile, String email) {
        this.customerId = customerId;
        this.name = name;
        this.mobile = mobile;
        this.email = email;
    }

    public int getCustomerId() {
        return customerId;
    }

    public void setCustomerId(int customerId) {
        this.customerId = customerId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @Override
    public String toString() {
        return "Customer{" +
                "customerId=" + customerId +
                ", name='" + name + '\'' +
                ", mobile='" + mobile + '\'' +
                ", email='" + email + '\'' +
                '}';
    }
}
