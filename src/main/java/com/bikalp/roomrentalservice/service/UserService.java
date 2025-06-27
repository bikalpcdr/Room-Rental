package com.bikalp.roomrentalservice.service;

import com.bikalp.roomrentalservice.dto.request.UserCreationRequest;
import com.bikalp.roomrentalservice.dto.request.UserUpdateRequest;
import com.bikalp.roomrentalservice.dto.response.UserResponse;

import java.util.List;


public interface UserService {
    void createUser(UserCreationRequest request);
    void updateUser(UserUpdateRequest request);
    void deleteUser(Long userId);
    UserResponse getUserById(Long userId);
    List<UserResponse> getAllUsers();
}
