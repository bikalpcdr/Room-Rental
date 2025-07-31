package com.bikalp.roomrentalservice.controller;

import com.bikalp.roomrentalservice.service.EsewaPaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    private final EsewaPaymentService esewaPaymentService;

    public PaymentController(EsewaPaymentService esewaPaymentService) {
        this.esewaPaymentService = esewaPaymentService;
    }

    @PostMapping("/initiate")
    public Map<String, String> initiatePayment(@RequestParam String amount,
                                               @RequestParam String referenceId,
                                               @RequestParam String productId,
                                               @RequestParam String successUrl,
                                               @RequestParam String failureUrl) {
        return esewaPaymentService.initiatePayment(amount, referenceId, productId, successUrl, failureUrl);
    }

    @PostMapping("/verify")
    public boolean verifyPayment(@RequestParam String amt,
                                 @RequestParam String rid,
                                 @RequestParam String pid) {
        return esewaPaymentService.verifyPayment(amt, rid, pid);
    }

    @GetMapping("/inquiry/{requestId}")
    public Map<String, Object> inquiry(@PathVariable String requestId) {
        return esewaPaymentService.inquiry(requestId);
    }

    @PostMapping("/payment")
    public Map<String, Object> payment(@RequestBody Map<String, Object> body) {
        String requestId = (String) body.get("request_id");
        double amount = Double.parseDouble(body.get("amount").toString());
        String transactionCode = (String) body.get("transaction_code");
        Integer packageId = body.get("package_id") != null ? Integer.parseInt(body.get("package_id").toString()) : null;
        return esewaPaymentService.payment(requestId, amount, transactionCode, packageId);
    }

    @PostMapping("/status")
    public Map<String, Object> statusCheck(@RequestBody Map<String, Object> body) {
        String requestId = (String) body.get("request_id");
        double amount = Double.parseDouble(body.get("amount").toString());
        String transactionCode = (String) body.get("transaction_code");
        return esewaPaymentService.statusCheck(requestId, amount, transactionCode);
    }

    // Optional: Expose token for testing
    @GetMapping("/token")
    public Map<String, String> getToken() {
        String token = esewaPaymentService.getEsewaAccessToken();
        Map<String, String> map = new HashMap<>();
        map.put("access_token", token);
        return map;
    }
} 