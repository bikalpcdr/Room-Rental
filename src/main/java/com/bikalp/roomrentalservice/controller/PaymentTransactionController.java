package com.bikalp.roomrentalservice.controller;


import com.bikalp.roomrentalservice.controller.base.BaseController;
import com.bikalp.roomrentalservice.dto.request.PaginatedRequestDto;
import com.bikalp.roomrentalservice.dto.request.PaymentCallbackRequest;
import com.bikalp.roomrentalservice.service.PaymentTransactionResponseProjection;
import com.bikalp.roomrentalservice.service.PaymentTransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/payment-transaction")
public class PaymentTransactionController extends BaseController {

    private final PaymentTransactionService transactionService;

    @PostMapping("/callback")
    public String savePaymentTransaction(@RequestBody PaymentCallbackRequest request) {
        transactionService.savePaymentResponseTransaction(request);
        return "Transaction saved successfully";
    }

    @PostMapping("/paginated")
    public ResponseEntity<Page<PaymentTransactionResponseProjection>> getPaginatedTransactions(@RequestBody PaginatedRequestDto requestDto) {
        return ResponseEntity.ok(transactionService.getAllTransactions(requestDto));
    }
}
