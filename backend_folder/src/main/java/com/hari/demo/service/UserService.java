package com.hari.demo.service;

import com.hari.demo.model.User;
import java.util.List;

public interface UserService {

    User signup(User user);

    User login(String username, String password);

    List<User> getAllUsers();

    User updateUser(Long id, User updatedUser);

    void deleteUser(Long id);
}
