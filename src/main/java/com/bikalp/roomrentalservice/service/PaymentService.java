package com.bikalp.roomrentalservice.service;

import com.bikalp.roomrentalservice.dto.request.PaymentRequestDto;
import com.bikalp.roomrentalservice.dto.response.PaymentResponseDto;
import com.bikalp.roomrentalservice.dto.response.PaymentStatusResponseDto;

public interface PaymentService {
    String payment(PaymentRequestDto paymentRequestDto);

    PaymentResponseDto initiateEsewaPayment(PaymentRequestDto dto);

    PaymentStatusResponseDto checkEsewaPaymentStatus(String orderNumber, String orderType);

    String generateEsewaPaymentForm(PaymentResponseDto responseDto);

    void updateCashOnDeliveryStatus(PaymentRequestDto paymentRequestDto);

    PaymentResponseDto paymentRequestDetails(PaymentRequestDto paymentRequestDto);
}
