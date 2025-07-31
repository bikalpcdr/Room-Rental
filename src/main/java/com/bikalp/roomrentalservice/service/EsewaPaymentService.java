package com.bikalp.roomrentalservice.service;

import com.bikalp.roomrentalservice.config.EsewaConfig;
import com.bikalp.roomrentalservice.exception.custom.CustomizeException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.concurrent.atomic.AtomicReference;
import java.util.concurrent.locks.ReentrantLock;

@Service
public class EsewaPaymentService {

    private final EsewaConfig esewaConfig;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final AtomicReference<String> cachedAccessToken = new AtomicReference<>(null);
    private final AtomicReference<String> cachedRefreshToken = new AtomicReference<>(null);
    private final ReentrantLock tokenLock = new ReentrantLock();

    public EsewaPaymentService(EsewaConfig esewaConfig) {
        this.esewaConfig = esewaConfig;
    }

    public Map<String, String> initiatePayment(String amount, String referenceId, String productId, String successUrl, String failureUrl) {
        // eSewa official field names
        String tax_amount = "0";
        String product_code = esewaConfig.getMerchantId();
        String product_service_charge = "0";
        String product_delivery_charge = "0";
        String signed_field_names = "total_amount,transaction_uuid,product_code";

        // Signature generation (HMAC-SHA256, base64)
        String signature = generateEsewaSignature(amount, productId, product_code, esewaConfig.getSecretKey());

        Map<String, String> formFields = new HashMap<>();
        formFields.put("amount", amount);
        formFields.put("tax_amount", tax_amount);
        formFields.put("total_amount", amount);
        formFields.put("transaction_uuid", productId);
        formFields.put("product_code", product_code);
        formFields.put("product_service_charge", product_service_charge);
        formFields.put("product_delivery_charge", product_delivery_charge);
        formFields.put("su", successUrl);
        formFields.put("fu", failureUrl);
        formFields.put("signed_field_names", signed_field_names);
        formFields.put("signature", signature);
        formFields.put("paymentUrl", esewaConfig.getBaseUrl());
        return formFields;
    }

    public boolean verifyPayment(String amt, String rid, String pid) {
        String verificationUrl = esewaConfig.getBaseUrl() + "/epay/transrec";
        org.springframework.web.client.RestTemplate restTemplate = new org.springframework.web.client.RestTemplate();
        org.springframework.util.MultiValueMap<String, String> params = new org.springframework.util.LinkedMultiValueMap<>();
        params.add("amt", amt);
        params.add("rid", rid);
        params.add("pid", pid);
        params.add("scd", esewaConfig.getMerchantId());

        String response = restTemplate.postForObject(verificationUrl, params, String.class);
        return response != null && response.contains("<response_code>Success</response_code>");
    }

    private String generateEsewaSignature(String total_amount, String transaction_uuid, String product_code, String secretKey) {
        try {
            String data = "total_amount=" + total_amount + ",transaction_uuid=" + transaction_uuid + ",product_code=" + product_code;
            Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
            SecretKeySpec secret_key = new SecretKeySpec(secretKey.getBytes(), "HmacSHA256");
            sha256_HMAC.init(secret_key);
            byte[] hash = sha256_HMAC.doFinal(data.getBytes());
            return Base64.getEncoder().encodeToString(hash);
        } catch (Exception e) {
            throw new CustomizeException("Failed to generate eSewa signature");
        }
    }

    // 1. Authenticate and get/refresh access token
    public String getEsewaAccessToken() {
        tokenLock.lock();
        try {
            String accessToken = cachedAccessToken.get();
            if (accessToken != null) {
                return accessToken;
            }
            // Prepare authentication request
            String url = esewaConfig.getBaseUrl() + "/access-token";
            Map<String, String> body = new HashMap<>();
            body.put("grant_type", "password");
            body.put("client_secret", esewaConfig.getClientSecret());
            body.put("username", esewaConfig.getEsewaId());
            body.put("password", esewaConfig.getPassword());
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, String>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
            if (response.getStatusCode().is2xxSuccessful()) {
                Map<String, Object> resp = objectMapper.readValue(response.getBody(), Map.class);
                String token = (String) resp.get("access_token");
                String refreshToken = (String) resp.get("refresh_token");
                cachedAccessToken.set(token);
                cachedRefreshToken.set(refreshToken);
                return token;
            } else {
                throw new CustomizeException("Failed to get eSewa access token");
            }
        } catch (Exception e) {
            throw new CustomizeException("Failed to get eSewa access token: " + e.getMessage());
        } finally {
            tokenLock.unlock();
        }
    }

    public String refreshEsewaAccessToken() {
        tokenLock.lock();
        try {
            String url = esewaConfig.getBaseUrl() + "/access-token";
            Map<String, String> body = new HashMap<>();
            body.put("grant_type", "refresh_token");
            body.put("refresh_token", cachedRefreshToken.get());
            body.put("client_secret", esewaConfig.getClientSecret());
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, String>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
            if (response.getStatusCode().is2xxSuccessful()) {
                Map<String, Object> resp = objectMapper.readValue(response.getBody(), Map.class);
                String token = (String) resp.get("access_token");
                String refreshToken = (String) resp.get("refresh_token");
                cachedAccessToken.set(token);
                cachedRefreshToken.set(refreshToken);
                return token;
            } else {
                throw new CustomizeException("Failed to refresh eSewa access token");
            }
        } catch (Exception e) {
            throw new CustomizeException("Failed to refresh eSewa access token: " + e.getMessage());
        } finally {
            tokenLock.unlock();
        }
    }

    // 2. Inquiry (GET)
    public Map<String, Object> inquiry(String requestId) {
        String url = esewaConfig.getBaseUrl() + "/inquiry/" + requestId;
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(getEsewaAccessToken());
        HttpEntity<Void> entity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
        if (response.getStatusCode().is2xxSuccessful()) {
            try {
                return objectMapper.readValue(response.getBody(), Map.class);
            } catch (Exception e) {
                throw new CustomizeException("Failed to parse inquiry response");
            }
        } else {
            throw new CustomizeException("Failed to perform inquiry");
        }
    }

    // 3. Payment (POST)
    public Map<String, Object> payment(String requestId, double amount, String transactionCode, Integer packageId) {
        String url = esewaConfig.getBaseUrl() + "/payment";
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(getEsewaAccessToken());
        headers.setContentType(MediaType.APPLICATION_JSON);
        Map<String, Object> body = new HashMap<>();
        body.put("request_id", requestId);
        body.put("amount", amount);
        body.put("transaction_code", transactionCode);
        if (packageId != null) body.put("package_id", packageId);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
        if (response.getStatusCode().is2xxSuccessful()) {
            try {
                return objectMapper.readValue(response.getBody(), Map.class);
            } catch (Exception e) {
                throw new CustomizeException("Failed to parse payment response");
            }
        } else {
            throw new CustomizeException("Failed to perform payment");
        }
    }

    // 4. Status Check (POST)
    public Map<String, Object> statusCheck(String requestId, double amount, String transactionCode) {
        String url = esewaConfig.getBaseUrl() + "/status";
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(getEsewaAccessToken());
        headers.setContentType(MediaType.APPLICATION_JSON);
        Map<String, Object> body = new HashMap<>();
        body.put("request_id", requestId);
        body.put("amount", amount);
        body.put("transaction_code", transactionCode);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
        if (response.getStatusCode().is2xxSuccessful()) {
            try {
                return objectMapper.readValue(response.getBody(), Map.class);
            } catch (Exception e) {
                throw new CustomizeException("Failed to parse status check response");
            }
        } else {
            throw new CustomizeException("Failed to perform status check");
        }
    }
} 