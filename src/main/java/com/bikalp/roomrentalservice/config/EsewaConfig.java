package com.bikalp.roomrentalservice.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Getter
@Setter
@Configuration
public class EsewaConfig {
    @Value("${esewa.merchant_id}")
    private String merchantId;

    @Value("${esewa.secret_key}")
    private String secretKey;

    @Value("${esewa.client_id}")
    private String clientId;

    @Value("${esewa.client_secret}")
    private String clientSecret;

    @Value("${esewa.base_url}")
    private String baseUrl;

    @Value("${esewa.id}")
    private String esewaId;

    @Value("${esewa.password}")
    private String password;

    @Value("${esewa.mpin}")
    private String mPin;

    @Value("${esewa.token}")
    private String token;
}