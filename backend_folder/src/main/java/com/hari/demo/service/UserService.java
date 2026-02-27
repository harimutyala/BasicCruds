package com.hari.demo.service;

import com.hari.demo.model.User;
import com.hari.demo.model.UserDTO;
import java.util.List;

public interface UserService {

    User signup(User user);
    
    User signupFromDTO(UserDTO userDTO);

    /**
     * Attempt to log in a user; the passed User object must contain username,
     * password and (optionally) role.  The implementation should verify all
     * provided fields. Returns the persisted User on success, or null if
     * authentication fails.
     */
    User login(User user);
    
    User loginFromDTO(UserDTO userDTO);

    List<User> getAllUsers();

    User updateUser(Long id, User updatedUser);

    void deleteUser(Long id);
}
