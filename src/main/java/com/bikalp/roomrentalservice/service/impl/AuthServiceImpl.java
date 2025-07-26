package com.bikalp.roomrentalservice.service.impl;

import com.bikalp.roomrentalservice.dto.request.LoginRequest;
import com.bikalp.roomrentalservice.dto.request.RegisterRequest;
import com.bikalp.roomrentalservice.dto.response.AuthResponse;
import com.bikalp.roomrentalservice.exception.custom.AlreadyExistFoundException;
import com.bikalp.roomrentalservice.model.User;
import com.bikalp.roomrentalservice.repository.UserRepo;
import com.bikalp.roomrentalservice.service.AuthService;
import com.bikalp.roomrentalservice.security.CustomUserDetailsService;
import com.bikalp.roomrentalservice.utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService customUserDetailsService;
    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;


    @Override
    public void register(RegisterRequest request) {
        if (userRepo.existsByEmail(request.getEmail())) {
            throw new AlreadyExistFoundException("Email already exists");
        }
        if (userRepo.existsByUsername(request.getUsername())) {
            throw new AlreadyExistFoundException("Username already exists");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(request.getPhoneNumber())
                .userRole(request.getRole())
                .build();
        userRepo.save(user);
        log.info("User register successfully..!! {}", user);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        try {
            // authenticate username and password
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            // loading user details
            User user = userRepo.findByUsername(request.getUsername())
                    .orElseThrow(() -> new BadCredentialsException("Username or password is incorrect"));

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
            throw new BadCredentialsException("Invalid username or password");
        }
    }
}
