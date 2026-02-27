package com.hari.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "mentors")
@DiscriminatorValue("MENTOR")
public class Mentor extends User {

    public Mentor() {}

    public Mentor(String username, String email, String password) {
        super(username, email, password);
    }

    @Override
    public String getRole() {
        return "MENTOR";
    }
}
