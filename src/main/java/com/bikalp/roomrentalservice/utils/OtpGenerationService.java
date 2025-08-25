package com.bikalp.roomrentalservice.utils;

import org.springframework.stereotype.Component;

import java.util.Random;

@Component
public class OtpGenerationService {
    // generating 6 digits random numbers
    public String generateOtp(){
        Random random = new Random();
        Integer otp = 100000+ random.nextInt(900000);
        return String.valueOf(otp);
    }
}
