package com.bikalp.roomrentalservice.service;

import com.bikalp.roomrentalservice.model.User;

public interface EmailService {
    void sendWelcomeEmail(User user, String plainPassword);

    void sendOtpForResetPassword(String emailOrUsername);
}
