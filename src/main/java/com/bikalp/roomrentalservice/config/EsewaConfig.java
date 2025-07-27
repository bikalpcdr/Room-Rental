package com.bikalp.roomrentalservice.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

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

    public String getMerchantId() { return merchantId; }
    public String getSecretKey() { return secretKey; }
    public String getClientId() { return clientId; }
    public String getClientSecret() { return clientSecret; }
    public String getBaseUrl() { return baseUrl; }
} 