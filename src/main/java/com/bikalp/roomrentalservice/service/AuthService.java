package com.bikalp.roomrentalservice.service;

import com.bikalp.roomrentalservice.dto.request.LoginRequest;
import com.bikalp.roomrentalservice.dto.request.RegisterRequest;
import com.bikalp.roomrentalservice.dto.request.ResetPasswordRequest;
import com.bikalp.roomrentalservice.dto.response.AuthResponse;
import org.springframework.stereotype.Service;


public interface AuthService {

    void register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    void requestOtp(String emailOrUsername);

    void verifyOtp(String emailOrUsername, String otp);

    void resetPassword(ResetPasswordRequest request);
}