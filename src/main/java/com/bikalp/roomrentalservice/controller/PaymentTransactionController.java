package com.bikalp.roomrentalservice.controller;


import com.bikalp.roomrentalservice.controller.base.BaseController;
import com.bikalp.roomrentalservice.dto.request.PaginatedRequestDto;
import com.bikalp.roomrentalservice.dto.request.PaymentCallbackRequest;
import com.bikalp.roomrentalservice.dto.response.GlobalAPIResponse;
import com.bikalp.roomrentalservice.service.PaymentTransactionResponseProjection;
import com.bikalp.roomrentalservice.service.PaymentTransactionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/payment-transaction")
@Slf4j
public class PaymentTransactionController extends BaseController {

    private final PaymentTransactionService transactionService;

    @PostMapping("/callback")
    public ResponseEntity<GlobalAPIResponse> savePaymentTransaction(@RequestBody PaymentCallbackRequest request) {
        log.info("Payment transaction callback received: {}", request);
        try {
            transactionService.savePaymentResponseTransaction(request);
            return customResponse("Transaction saved successfully", null);
        } catch (Exception e) {
            log.error("Error saving payment transaction: {}", request, e);
            return customResponse("Error saving transaction", null);
        }
    }

    @PostMapping("/paginated")
    public ResponseEntity<Page<PaymentTransactionResponseProjection>> getPaginatedTransactions(@RequestBody PaginatedRequestDto requestDto) {
        return ResponseEntity.ok(transactionService.getAllTransactions(requestDto));
    }
}
