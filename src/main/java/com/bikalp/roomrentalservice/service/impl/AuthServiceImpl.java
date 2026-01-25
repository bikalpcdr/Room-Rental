package com.bikalp.roomrentalservice.service.impl;

import com.bikalp.roomrentalservice.dto.request.LoginRequest;
import com.bikalp.roomrentalservice.dto.request.RegisterRequest;
import com.bikalp.roomrentalservice.dto.request.ResetPasswordRequest;
import com.bikalp.roomrentalservice.dto.response.AuthResponse;
import com.bikalp.roomrentalservice.dto.response.UserResponse;
import com.bikalp.roomrentalservice.enums.AccountStatus;
import com.bikalp.roomrentalservice.enums.UserRole;
import com.bikalp.roomrentalservice.exception.custom.AlreadyExistFoundException;
import com.bikalp.roomrentalservice.exception.custom.CustomizeException;
import com.bikalp.roomrentalservice.exception.custom.DataNotFoundException;
import com.bikalp.roomrentalservice.mapper.UserMapper;
import com.bikalp.roomrentalservice.model.PasswordResetOtp;
import com.bikalp.roomrentalservice.model.User;
import com.bikalp.roomrentalservice.repository.PasswordResetOtpRepo;
import com.bikalp.roomrentalservice.repository.UserRepo;
import com.bikalp.roomrentalservice.service.AuthService;
import com.bikalp.roomrentalservice.service.EmailService;
import com.bikalp.roomrentalservice.utils.JwtUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;
    private final PasswordResetOtpRepo passwordResetOtpRepo;
    private final UserMapper userMapper;


    @Override
    public void register(RegisterRequest request) {
        if (userRepo.existsByEmail(request.getEmail())) {
            throw new AlreadyExistFoundException("Email already exists..!!");
        }
        if (userRepo.existsByUsername(request.getUsername())) {
            throw new AlreadyExistFoundException("Username already exists..!!");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(request.getPhoneNumber())
                .userRole(request.getRole())
                .accountStatus(request.getRole().equals(UserRole.RENTER) ? AccountStatus.ACTIVE : AccountStatus.PENDING)
                .build();
        userRepo.save(user);
        log.info("User register successfully..!! {}", user);
        if (user.getAccountStatus().equals(AccountStatus.ACTIVE)) {
            emailService.sendWelcomeEmail(user, request.getPassword());
        }
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        try {
            if (request.getUsername() == null || request.getUsername().isBlank() || request.getPassword() == null || request.getPassword().isBlank()) {
                throw new CustomizeException("Username and password must be provided..!!");
            }
            // authenticate username and password
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            // loading user details
            User user = userRepo.findByUsername(request.getUsername())
                    .orElseThrow(() -> new CustomizeException("Username or password is incorrect..!!"));

            if (Boolean.FALSE.equals(user.getIsActive())) {
                throw new CustomizeException("Your account is inactive..!!");
            }

            if (user.getAccountStatus().equals(AccountStatus.PENDING)) {
                throw new CustomizeException("Your account is pending approval by admin..!!");
            }

            // generating token
            String token = jwtUtil.generateToken(user.getUsername(), user.getUserRole().name());
            return AuthResponse.builder()
                    .id(user.getId())
                    .username(user.getUsername())
                    .role(user.getUserRole().name())
                    .email(user.getEmail())
                    .fullName(user.getFullName())
                    .token(token)
                    .profilePictureUrl(user.getProfilePictureUrl())
                    .phoneNumber(user.getPhoneNumber())
                    .build();
        } catch (BadCredentialsException ex) {
            throw new CustomizeException("Invalid username or password..!!");
        }
    }

    @Transactional
    @Override
    public void requestOtp(String emailOrUsername) {
        emailService.sendOtpForResetPassword(emailOrUsername);
    }

    @Override
    public void verifyOtp(String emailOrUsername, String otp) {
        User user = userRepo.findByUsernameOrEmail(emailOrUsername, emailOrUsername).orElseThrow(
                () -> new DataNotFoundException("User doesn't exist by username or email..!!" + emailOrUsername)
        );

        PasswordResetOtp passwordResetOtp = passwordResetOtpRepo.findLatestActiveOtpByUser(user.getId());

        if (passwordResetOtp.getIsAlreadyUsed().equals(Boolean.TRUE)) {
            throw new CustomizeException("The provided otp is already used. Please request new one..!!");
        }

        if (passwordResetOtp.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new CustomizeException("The provided otp is already expired. Please request new one..!!");
        }

        if (!passwordResetOtp.getOtp().equals(otp)) {
            throw new CustomizeException("The provided otp doesn't match. Please try again..!!");
        }

        passwordResetOtp.setIsAlreadyUsed(Boolean.TRUE);
        passwordResetOtpRepo.save(passwordResetOtp);
    }

    @Override
    public void resetPassword(ResetPasswordRequest request) {
        User user = userRepo.findByUsernameOrEmail(request.getEmailOrUsername(), request.getEmailOrUsername()).orElseThrow(
                () -> new DataNotFoundException("User not found with provided username or email: " + request.getEmailOrUsername())
        );

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new CustomizeException("New password and confirm password do not match!");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepo.save(user);

        passwordResetOtpRepo.deactivateAllActiveOtpsByUserId(user.getId());
        log.info("Password reset successful for user: {}", user.getUsername());
    }

    @Override
    public List<UserResponse> getPendingApprovalsForRegistrations() {
        return userMapper.getPendingApprovalsForRegistrations();
    }

    @Override
    public void approveRegistration(Long userId) {
        User user = getUserEntity(userId);

        user.setAccountStatus(AccountStatus.ACTIVE);
        userRepo.save(user);
        log.info("User has been approved for user: {}", user.getUsername());
        emailService.sendRegistrationEmail(user);
    }

    @Override
    public void rejectRegistration(Long userId) {
        User user = getUserEntity(userId);

        user.setAccountStatus(AccountStatus.REJECTED);
        userRepo.save(user);
        log.info("User has been reject for user: {}", user.getUsername());
    }

    private User getUserEntity(Long userId) {
        return userRepo.findById(userId).orElseThrow(
                () -> new CustomizeException("User not found with provided id: " + userId));
    }
}
