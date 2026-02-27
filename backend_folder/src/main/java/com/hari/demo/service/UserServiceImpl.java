package com.hari.demo.service;

import com.hari.demo.model.User;
import com.hari.demo.model.Student;
import com.hari.demo.model.Mentor;
import com.hari.demo.model.Admin;
import com.hari.demo.model.UserDTO;
import com.hari.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public User signup(User user) {
        if (user == null) {
            throw new IllegalArgumentException("User data must be provided");
        }
        if (userRepository.findByUsername(user.getUsername()) != null) {
            throw new IllegalArgumentException("Username already exists");
        }
        if (userRepository.findByEmail(user.getEmail()) != null) {
            throw new IllegalArgumentException("Email already exists");
        }

        // Create appropriate subclass based on role
        User newUser;
        String role = user.getRole();
        
        if (role != null) {
            switch (role.toUpperCase()) {
                case "MENTOR":
                    newUser = new Mentor(user.getUsername(), user.getEmail(), user.getPassword());
                    break;
                case "ADMIN":
                    newUser = new Admin(user.getUsername(), user.getEmail(), user.getPassword());
                    break;
                case "STUDENT":
                default:
                    newUser = new Student(user.getUsername(), user.getEmail(), user.getPassword());
            }
        } else {
            newUser = new Student(user.getUsername(), user.getEmail(), user.getPassword());
        }

        return userRepository.save(newUser);
    }

    @Override
    public User signupFromDTO(UserDTO userDTO) {
        if (userDTO == null) {
            throw new IllegalArgumentException("User data must be provided");
        }
        if (userRepository.findByUsername(userDTO.getUsername()) != null) {
            throw new IllegalArgumentException("Username already exists");
        }
        if (userRepository.findByEmail(userDTO.getEmail()) != null) {
            throw new IllegalArgumentException("Email already exists");
        }

        // Create appropriate subclass based on role
        User newUser;
        String role = userDTO.getRole();
        
        if (role != null) {
            switch (role.toUpperCase()) {
                case "MENTOR":
                    newUser = new Mentor(userDTO.getUsername(), userDTO.getEmail(), userDTO.getPassword());
                    break;
                case "ADMIN":
                    newUser = new Admin(userDTO.getUsername(), userDTO.getEmail(), userDTO.getPassword());
                    break;
                case "STUDENT":
                default:
                    newUser = new Student(userDTO.getUsername(), userDTO.getEmail(), userDTO.getPassword());
            }
        } else {
            newUser = new Student(userDTO.getUsername(), userDTO.getEmail(), userDTO.getPassword());
        }

        return userRepository.save(newUser);
    }

    @Override
    public User login(User user) {
        if (user == null || user.getPassword() == null) {
            return null;
        }
        // try email first, then username
        User found = null;
        if (user.getEmail() != null) {
            found = userRepository.findByEmail(user.getEmail());
        }
        if (found == null && user.getUsername() != null) {
            found = userRepository.findByUsername(user.getUsername());
        }

        if (found != null && found.getPassword().equals(user.getPassword())) {
            // if role is provided, enforce it
            String requestedRole = user.getRole();
            if (requestedRole != null && !found.getRole().equals(requestedRole.toUpperCase())) {
                return null; // Role mismatch
            }
            return found;
        }

        return null; // Login failed
    }

    @Override
    public User loginFromDTO(UserDTO userDTO) {
        if (userDTO == null || userDTO.getPassword() == null) {
            return null;
        }
        // try email first, then username
        User found = null;
        if (userDTO.getEmail() != null) {
            found = userRepository.findByEmail(userDTO.getEmail());
        }
        if (found == null && userDTO.getUsername() != null) {
            found = userRepository.findByUsername(userDTO.getUsername());
        }

        if (found != null && found.getPassword().equals(userDTO.getPassword())) {
            // if role is provided, enforce it
            String requestedRole = userDTO.getRole();
            if (requestedRole != null && !found.getRole().equals(requestedRole.toUpperCase())) {
                return null; // Role mismatch
            }
            return found;
        }

        return null; // Login failed
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User updateUser(Long id, User updatedUser) {
        return userRepository.findById(id)
                .map(existingUser -> {
                    existingUser.setUsername(updatedUser.getUsername());
                    existingUser.setEmail(updatedUser.getEmail());
                    existingUser.setPassword(updatedUser.getPassword());
                    // Note: role changes are not supported in this implementation
                    // To change role, delete and recreate the user
                    return userRepository.save(existingUser);
                })
                .orElse(null);
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
