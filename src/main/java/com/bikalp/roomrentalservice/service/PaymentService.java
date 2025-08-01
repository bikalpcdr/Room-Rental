package com.bikalp.roomrentalservice.service;

import com.bikalp.roomrentalservice.dto.request.PaymentRequestDto;
import com.bikalp.roomrentalservice.dto.response.PaymentResponseDto;
import com.bikalp.roomrentalservice.dto.response.PaymentStatusResponseDto;
import com.bikalp.roomrentalservice.enums.OrderType;

public interface PaymentService {
    String payment(PaymentRequestDto paymentRequestDto);

    PaymentResponseDto initiateEsewaPayment(PaymentRequestDto dto);

    PaymentStatusResponseDto checkEsewaPaymentStatus(String orderNumber, OrderType orderType);

    String generateEsewaPaymentForm(PaymentResponseDto responseDto);

    void updateCashOnDeliveryStatus(PaymentRequestDto paymentRequestDto);

    PaymentResponseDto paymentRequestDetails(PaymentRequestDto paymentRequestDto);
}
