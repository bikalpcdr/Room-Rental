package com.bikalp.roomrentalservice.controller;

import com.bikalp.roomrentalservice.service.EsewaPaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

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
} 