package com.hari.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "admins")
@DiscriminatorValue("ADMIN")
public class Admin extends User {

    public Admin() {}

    public Admin(String username, String email, String password) {
        super(username, email, password);
    }

    @Override
    public String getRole() {
        return "ADMIN";
    }
}
