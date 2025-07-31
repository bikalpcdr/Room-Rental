package com.bikalp.roomrentalservice.config;

import com.bikalp.roomrentalservice.exception.custom.CustomizeException;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Getter
@Setter
@Configuration
public class EsewaConfig {
    @Value("${esewa.merchant-id}")
    private String merchantId;

    @Value("${esewa.secret-key}")
    private String secretKey;

    @Value("${esewa.urls.form}")
    private String formUrl;

    @Value("${esewa.urls.status}")
    private String statusUrl;

    @Value("${esewa.urls.success-callback}")
    private String successUrl;

    @Value("${esewa.urls.failure-callback}")
    private String failureUrl;

    @Value("${esewa.id1}")
    private String esewaId1;

    @Value("${esewa.id2}")
    private String esewaId2;

    @Value("${esewa.id2}")
    private String esewaId3;

    @Value("${esewa.id4}")
    private String esewaId4;

    @Value("${esewa.id4}")
    private String esewaId5;

    @Value("${esewa.password}")
    private String password;

    @Value("${esewa.mpin}")
    private String mPin;

    @Value("${esewa.token}")
    private String token;

    public static String generateSignature(String data, String secret) {
        try {
            Mac hmacSha256 = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            hmacSha256.init(secretKey);
            byte[] hash = hmacSha256.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (Exception e) {
            throw new CustomizeException("Error generating HMAC");
        }
    }
}