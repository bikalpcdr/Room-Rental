package com.bikalp.roomrentalservice.service.impl;

import com.bikalp.roomrentalservice.dto.request.UserCreationRequest;
import com.bikalp.roomrentalservice.dto.request.UserUpdateRequest;
import com.bikalp.roomrentalservice.dto.response.UserResponse;
import com.bikalp.roomrentalservice.exception.custom.AlreadyExistFoundException;
import com.bikalp.roomrentalservice.exception.custom.CustomizeException;
import com.bikalp.roomrentalservice.exception.custom.DataNotFoundException;
import com.bikalp.roomrentalservice.mapper.UserMapper;
import com.bikalp.roomrentalservice.model.User;
import com.bikalp.roomrentalservice.repository.UserRepo;
import com.bikalp.roomrentalservice.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    @Override
    public void createUser(UserCreationRequest request) {
        validateUsernameAndEmailUniqueness(request.getUsername(), request.getEmail());
        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(request.getPhoneNumber())
                .userRole(request.getRole())
                .build();
        userRepo.save(user);
        log.info("User created successfully..!! {}", user);
    }

    @Override
    public void updateUser(UserUpdateRequest request) {
        User user = findUserById(request.getId());
        validateUsernameAndEmailUniqueness(request.getUsername(), null);

        user.setFullName(request.getFullName());
        user.setUsername(request.getUsername());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setUserRole(request.getRole());
        userRepo.save(user);
        log.info("User updated successfully..!! {}", user);
    }

    @Override
    public void deleteUser(Long userId) {
        userRepo.delete(findUserById(userId));
        log.info("User deleted successfully..!!");
    }

    @Override
    public UserResponse getUserById(Long userId) {
        return userMapper.getUserById(findUserById(userId).getId());
    }

    @Override
    public List<UserResponse> getAllUsers() {
        return userMapper.getAllUsers();
    }

    @Override
    public String uploadProfilePicture(Long userId, MultipartFile file) {
        User user = findUserById(userId);
        if (file.isEmpty()) {
            throw new CustomizeException("File is empty");
        }
        try {
            String uploadDir = "uploads/profile-pictures";
            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs();
            String ext = file.getOriginalFilename() != null && file.getOriginalFilename().contains(".") ? file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf('.')) : "";
            String filename = "user-" + userId + "-" + UUID.randomUUID() + ext;
            Path filePath = Paths.get(uploadDir, filename);
            Files.write(filePath, file.getBytes());
            String url = "/" + uploadDir + "/" + filename;
            user.setProfilePictureUrl(url);
            userRepo.save(user);
            return url;
        } catch (IOException e) {
            throw new CustomizeException("Failed to upload profile picture");
        }
    }

    public User findUserById(Long userId) {
        return userRepo.findById(userId).orElseThrow(
                () -> new DataNotFoundException("User not found with the id: " + userId)
        );
    }

    public void validateUsernameAndEmailUniqueness(String username, String email) {
        if (userRepo.existsByUsername(username)) {
            throw new AlreadyExistFoundException("User already exists with the username: " + username);
        }
        if (userRepo.existsByEmail(email)) {
            throw new AlreadyExistFoundException("User already exists with the email: " + email);
        }
    }
}
