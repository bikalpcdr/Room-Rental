package com.bikalp.roomrentalservice.service;

import com.bikalp.roomrentalservice.dto.request.PaginatedRequestDto;
import com.bikalp.roomrentalservice.dto.request.PaymentCallbackRequest;
import org.springframework.data.domain.Page;

public interface PaymentTransactionService {

    void savePaymentResponseTransaction(PaymentCallbackRequest request);

    Page<PaymentTransactionResponseProjection> getAllTransactions(PaginatedRequestDto requestDto);
}
