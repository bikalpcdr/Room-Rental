package com.bikalp.roomrentalservice.controller;

import com.bikalp.roomrentalservice.controller.base.BaseController;
import com.bikalp.roomrentalservice.dto.request.LoginRequest;
import com.bikalp.roomrentalservice.dto.request.RegisterRequest;
import com.bikalp.roomrentalservice.dto.request.ResetPasswordRequest;
import com.bikalp.roomrentalservice.dto.response.GlobalAPIResponse;
import com.bikalp.roomrentalservice.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController extends BaseController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<GlobalAPIResponse> register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
        return registerResponse(null);
    }

    @PostMapping("/login")
    public ResponseEntity<GlobalAPIResponse> login(@Valid @RequestBody LoginRequest request) {
        return loginResponse(authService.login(request));
    }

    @PostMapping("/request-otp")
    public ResponseEntity<GlobalAPIResponse> requestOtpForPasswordReset(@RequestParam String emailOrUsername){
        authService.requestOtp(emailOrUsername);
        return  forgotPasswordResponse();
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<GlobalAPIResponse> verifyOtp(@RequestParam String emailOrUsername, @RequestParam String otp){
        authService.verifyOtp(emailOrUsername, otp);
        return verifyOTPResponse();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<GlobalAPIResponse> resetPassword(@RequestBody ResetPasswordRequest request){
        authService.resetPassword(request);
        return resetPasswordResponse(null);
    }
}
