package com.bikalp.roomrentalservice.config;

import com.bikalp.roomrentalservice.enums.UserRole;
import com.bikalp.roomrentalservice.model.User;
import com.bikalp.roomrentalservice.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@Slf4j
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // creating admin user if not exist
        if (!userRepo.existsByEmail("admin@yopmail.com")) {
            log.info("creating admin user..!!");
            User adminUser = new User();
            adminUser.setUsername("admin");
            adminUser.setFullName("Admin User");
            adminUser.setEmail("admin@yopmail.com");
            adminUser.setPassword(passwordEncoder.encode("Test@1234"));
            adminUser.setPhoneNumber("9863261000");
            adminUser.setUserRole(UserRole.ADMIN);
            adminUser.setCreatedAt(LocalDateTime.now());
            adminUser.setIsActive(Boolean.TRUE);
            adminUser.setUpdatedAt(LocalDateTime.now());
            userRepo.save(adminUser);
            log.info("Admin created successfully..!!");
        } else {
            log.info("Admin user already exist..!!");
        }
    }
}
