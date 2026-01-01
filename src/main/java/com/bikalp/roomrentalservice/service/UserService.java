package com.bikalp.roomrentalservice.service;

import com.bikalp.roomrentalservice.dto.request.ResetPasswordRequest;
import com.bikalp.roomrentalservice.dto.request.UserCreationRequest;
import com.bikalp.roomrentalservice.dto.request.UserSettingRequest;
import com.bikalp.roomrentalservice.dto.request.UserUpdateRequest;
import com.bikalp.roomrentalservice.dto.response.LoggedInUserInfo;
import com.bikalp.roomrentalservice.dto.response.UserResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface UserService {
    void createUser(UserCreationRequest request);

    void updateUser(UserUpdateRequest request);

    void deleteUser(Long userId);

    UserResponse getUserById(Long userId);

    List<UserResponse> getAllUsers();

    void uploadProfilePicture(MultipartFile file);

    void changePassword(ResetPasswordRequest request);

    void updateInfo(UserSettingRequest request);

    LoggedInUserInfo getLoggedInUserInfo();
}
