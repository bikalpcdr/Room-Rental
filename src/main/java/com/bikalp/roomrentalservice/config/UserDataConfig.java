package com.bikalp.roomrentalservice.config;

import com.bikalp.roomrentalservice.enums.UserRole;
import com.bikalp.roomrentalservice.exception.custom.DataNotFoundException;
import com.bikalp.roomrentalservice.model.User;
import com.bikalp.roomrentalservice.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserDataConfig {

    private final UserRepo userRepo;

    public User getLoggedInUser() {
        String username = getCurrentUsername();
        return userRepo.findByUsername(username).orElseThrow(
                () -> new DataNotFoundException("User not found: " + username)
        );
    }

    public UserRole getUserRole() {
        return getLoggedInUser().getUserRole();
    }

    private String getCurrentUsername() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
}
