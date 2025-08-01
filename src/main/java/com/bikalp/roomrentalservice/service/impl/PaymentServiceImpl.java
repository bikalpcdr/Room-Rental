package com.bikalp.roomrentalservice.service.impl;

import com.bikalp.roomrentalservice.config.EsewaConfig;
import com.bikalp.roomrentalservice.dto.request.PaymentRequestDto;
import com.bikalp.roomrentalservice.dto.response.PaymentResponseDto;
import com.bikalp.roomrentalservice.dto.response.PaymentStatusResponseDto;
import com.bikalp.roomrentalservice.enums.OrderType;
import com.bikalp.roomrentalservice.enums.PaymentMethod;
import com.bikalp.roomrentalservice.exception.custom.CustomizeException;
import com.bikalp.roomrentalservice.service.PaymentService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.text.DecimalFormat;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class PaymentServiceImpl implements PaymentService {

    private final EsewaConfig esewaConfig;

    @Override
    public String payment(PaymentRequestDto paymentRequestDto) {
        String orderNumber = paymentRequestDto.getOrderNumber();
        PaymentMethod paymentMethod = paymentRequestDto.getPaymentMethod();

        log.info("payment() initiated for order number: {}", orderNumber);

        if (paymentMethod == null) {
            log.warn("No payment method provided for order number: {}", orderNumber);
            throw new CustomizeException("Payment method must not be null..!!");
        }

        switch (paymentMethod) {
            case E_SEWA -> {
                log.info("Processing eSewa payment for order: {}", orderNumber);
                PaymentResponseDto paymentResponseDto = initiateEsewaPayment(paymentRequestDto);
                return generateEsewaPaymentForm(paymentResponseDto);
            }

            case KHALTI -> {
                log.info("Processing Khalti payment for order: {}", orderNumber);
                // TODO: Replace with real Khalti integration
                return "Khalti payment integration is in progress.";
            }

            case CASH -> {
                log.info("Processing Cash payment for order: {}", orderNumber);
                // TODO: Add logic to record cash transaction
                return "Cash payment acknowledged. Please confirm with finance team.";
            }

            default -> {
                log.warn("Unsupported payment method: {} for order number: {}", paymentMethod, orderNumber);
                throw new UnsupportedOperationException("Unsupported payment method: " + paymentMethod);
            }
        }
    }

    @Override
    public PaymentResponseDto initiateEsewaPayment(PaymentRequestDto dto) {
        // For testing:real test amount and a unique transaction UUID
        //test amount
        Double totalOrderAmount = 110.0;
        // generating unique transaction UUID
        String transactionUuid = String.valueOf(System.currentTimeMillis());

        String signedFields = "total_amount,transaction_uuid,product_code";

        DecimalFormat df = new DecimalFormat("0.00");
        String totalAmount = df.format(totalOrderAmount);

        String dataToSign = "total_amount=" + totalAmount + ",transaction_uuid=" + transactionUuid + ",product_code=" + esewaConfig.getMerchantId();

        String signature = EsewaConfig.generateSignature(dataToSign, esewaConfig.getSecretKey());
        //todo::need to re-calculate tax amount in future
        Double taxAmount = 0.0;
        String amount = df.format(totalOrderAmount - taxAmount);

        Map<String, String> payload = new HashMap<>();
        payload.put("amount", amount);
        payload.put("tax_amount", df.format(taxAmount));
        payload.put("total_amount", totalAmount);
        payload.put("transaction_uuid", transactionUuid);
        payload.put("product_code", esewaConfig.getMerchantId());
        payload.put("product_service_charge", "0");
        payload.put("product_delivery_charge", "0");
        payload.put("success_url", esewaConfig.getSuccessUrl());
        payload.put("failure_url", esewaConfig.getFailureUrl());
        payload.put("signed_field_names", signedFields);
        payload.put("signature", signature);

        log.info("initiateEsewaPayment() TEST DATA: dataToSign={}, signature={}", dataToSign, signature);
        return new PaymentResponseDto(esewaConfig.getFormUrl(), payload);
    }

    @Override
    public PaymentStatusResponseDto checkEsewaPaymentStatus(String orderNumber, OrderType orderType) {
        return null;
    }


    @Override
    public String generateEsewaPaymentForm(PaymentResponseDto responseDto) {
        log.info("generateEsewaPaymentForm() START: generating HTML form for: {}", responseDto.getPayload());

        StringBuilder html = new StringBuilder();
        html.append("<!DOCTYPE html><html><head><title>Redirecting...</title></head><body>");
        html.append("<h3 style=\"text-align:center;margin-top:20px;\">Redirecting to eSewa. Please wait...</h3>");
        html.append("<form id=\"esewaForm\" action=\"").append(responseDto.getFormUrl()).append("\" method=\"POST\">");

        responseDto.getPayload().forEach((key, value) -> {
            html.append("<input type=\"hidden\" name=\"").append(key).append("\" value=\"").append(value).append("\"/>");
        });

        html.append("</form>");
        html.append("<script>document.getElementById('esewaForm').submit();</script>");
        html.append("</body></html>");

        log.info("generateEsewaPaymentForm() END: generating HTML form for: {}", responseDto.getPayload());
        return html.toString();
    }


    @Override
    public void updateCashOnDeliveryStatus(PaymentRequestDto paymentRequestDto) {
        log.info("updateCashOnDeliveryStatus() START for order number: {}", paymentRequestDto.getOrderNumber());

        log.info("updateCashOnDeliveryStatus() END for order number: {}", paymentRequestDto.getOrderNumber());
    }

    @Override
    public PaymentResponseDto paymentRequestDetails(PaymentRequestDto paymentRequestDto) {
        String orderNumber = paymentRequestDto.getOrderNumber();
        PaymentMethod paymentMethod = paymentRequestDto.getPaymentMethod();

        log.info("paymentRequestDetails() initiated for order number: {}", orderNumber);

        if (paymentMethod == null) {
            log.warn("No payment method provided for order: {}", orderNumber);
            throw new IllegalArgumentException("Payment method must not be null");
        }

        return switch (paymentMethod) {
            case E_SEWA -> {
                log.info("Processing eSewa payment request for order: {}", orderNumber);
                yield initiateEsewaPayment(paymentRequestDto);
            }
            case KHALTI -> {
                log.info("Processing Khalti payment request for order: {}", orderNumber);
                // TODO: Implement Khalti integration logic in future
                yield null;
            }
            case CASH -> {
                log.info("Processing Cash payment request for order: {}", orderNumber);
                // TODO: Handle offline payment details
                yield null;
            }
            default -> {
                log.warn("Unsupported payment method '{}' for order number: {}", paymentMethod, orderNumber);
                throw new UnsupportedOperationException("Unsupported payment method: " + paymentMethod);
            }
        };
    }
}