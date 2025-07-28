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

@Service
public class EsewaPaymentService {

    private final EsewaConfig esewaConfig;

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
} 