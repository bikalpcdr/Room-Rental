package com.bikalp.roomrentalservice.service.impl;

import com.bikalp.roomrentalservice.exception.custom.CustomizeException;
import com.bikalp.roomrentalservice.exception.custom.EmailException;
import com.bikalp.roomrentalservice.model.PasswordResetOtp;
import com.bikalp.roomrentalservice.model.User;
import com.bikalp.roomrentalservice.repository.PasswordResetOtpRepo;
import com.bikalp.roomrentalservice.repository.UserRepo;
import com.bikalp.roomrentalservice.service.EmailService;
import com.bikalp.roomrentalservice.utils.OtpGenerationService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSenderImpl mailSender;
    private final TemplateEngine templateEngine;
    private final UserRepo userRepo;
    private final OtpGenerationService otpGenerationService;
    private final PasswordResetOtpRepo passwordResetOtpRepo;

    @Value("${app.base-url}")
    private String baseUrl;

    @Override
    public void sendWelcomeEmail(User user, String plainPassword) throws EmailException {
        try {
            // Prepare Thymeleaf context
            Context context = new Context();
            context.setVariable("name", user.getFullName());
            context.setVariable("username", user.getUsername());
            context.setVariable("password", plainPassword);
            context.setVariable("baseUrl", baseUrl);

            // Generate HTML content
            String htmlContent = templateEngine.process("welcome", context);

            // Create email
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(user.getEmail());
            helper.setSubject("Welcome to Room Rental Service!");
            helper.setText(htmlContent, true);

            mailSender.send(message);

            log.info("Welcome email sent successfully to user: {}", user.getEmail());

        } catch (MessagingException e) {
            log.error("Failed to send welcome email to user: {}", user.getEmail(), e);
            throw new EmailException("Error sending welcome email", e);
        }
    }

    @Override
    public void sendRegistrationEmail(User user) {
        try{
            Context context = new Context();
            context.setVariable("name", user.getFullName());

            String htmlContent = templateEngine.process("owner-activation", context);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message,true);
            helper.setTo(user.getEmail());
            helper.setSubject("Your registration is pending approval!!");
            helper.setText(htmlContent,true);

            mailSender.send(message);
        }catch (MessagingException e) {
            log.error("Failed to send registration email to user: {}", user.getEmail(), e);
            throw new EmailException("Error sending registration email", e);
        }
    }

    @Override
    public void sendOtpForResetPassword(String emailOrUsername) {
        User user = userRepo.findByUsernameOrEmail(emailOrUsername, emailOrUsername)
                .orElseThrow(() -> new CustomizeException("User not found with provided username or email"));

        // Generate new OTP
        String otp = otpGenerationService.generateOtp();

        // Save new OTP
        PasswordResetOtp passwordResetOtp = PasswordResetOtp.builder()
                .otp(otp)
                .user(user)
                .expiryDate(LocalDateTime.now().plusMinutes(10))
                .attemptsCount(0)
                .isAlreadyUsed(Boolean.FALSE)
                .build();

        passwordResetOtpRepo.save(passwordResetOtp);

        // Send OTP to user's email
        try {
            sendOtpEmail(user.getEmail(), user.getFullName(), otp);
            log.info("OTP for password reset sent to {}", user.getEmail());
        } catch (Exception e) {
            log.error("Failed to send OTP email to {}", user.getEmail(), e);
            throw new CustomizeException("Failed to send OTP. Please try again later.");
        }
    }

    public void sendOtpEmail(String to, String fullName, String otp) throws MessagingException {
        Context context = new Context();
        context.setVariable("name", fullName);
        context.setVariable("otp", otp);

        String htmlContent = templateEngine.process("reset-password-otp", context);

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setTo(to);
        helper.setSubject("Password Reset OTP");
        helper.setText(htmlContent, true);

        mailSender.send(message);
    }
}