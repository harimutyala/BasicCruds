package com.hari.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "students")
@DiscriminatorValue("STUDENT")
public class Student extends User {

    public Student() {}

    public Student(String username, String email, String password) {
        super(username, email, password);
    }

    @Override
    public String getRole() {
        return "STUDENT";
    }
}
