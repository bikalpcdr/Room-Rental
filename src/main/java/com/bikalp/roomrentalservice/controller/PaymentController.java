package com.bikalp.roomrentalservice.controller;

import com.bikalp.roomrentalservice.controller.base.BaseController;
import com.bikalp.roomrentalservice.dto.request.PaymentRequestDto;
import com.bikalp.roomrentalservice.dto.response.GlobalAPIResponse;
import com.bikalp.roomrentalservice.enums.OrderType;
import com.bikalp.roomrentalservice.enums.PaymentStatus;
import com.bikalp.roomrentalservice.service.BookingService;
import com.bikalp.roomrentalservice.service.PaymentService;
import com.bikalp.roomrentalservice.service.impl.PaymentServiceImpl;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/payment")
@RequiredArgsConstructor
@Slf4j
public class PaymentController extends BaseController {
    private final PaymentService paymentService;
    private final BookingService bookingService;

    @PostMapping("/initiate")
    public void initiatePayment(HttpServletResponse response, @RequestBody PaymentRequestDto requestDto) throws IOException {
        String html = paymentService.payment(requestDto);
        response.setContentType("text/html;charset=UTF-8");
        response.getWriter().write(html);
        response.getWriter().flush();
    }

    @PostMapping("/status")
    @ResponseBody
    public ResponseEntity<GlobalAPIResponse> handleSuccess(
            @RequestParam String orderNumber, 
            @RequestParam String orderType,
            @RequestParam(required = false) String status) {
        
        log.info("Payment success callback - orderNumber: {}, orderType: {}, status: {}", orderNumber, orderType, status);
        
        // Update booking payment status if it's a booking transaction
        try {
            OrderType parsedOrderType = OrderType.valueOf(orderType.toUpperCase());
            if (OrderType.BOOKING.equals(parsedOrderType)) {
                PaymentStatus paymentStatus = PaymentStatus.SUCCESS.name().equalsIgnoreCase(status) ? PaymentStatus.PAID : PaymentStatus.FAILED;
                bookingService.updatePaymentStatus(orderNumber, paymentStatus);
            }
        } catch (IllegalArgumentException e) {
            log.warn("Unknown order type received: {}", orderType);
        }
        
        return customResponse("Payment status handle Successfully..!!", paymentService.checkEsewaPaymentStatus(orderNumber, OrderType.valueOf(orderType.toUpperCase())));
    }

    @PostMapping("/failure")
    @ResponseBody
    public ResponseEntity<GlobalAPIResponse> handleFailure(
            @RequestParam(required = false) String orderNumber,
            @RequestParam(required = false) String orderType) {
        
        log.info("Payment failure callback - orderNumber: {}, orderType: {}", orderNumber, orderType);
        
        // Update booking payment status if it's a booking transaction
        if (orderType != null && orderNumber != null) {
            try {
                OrderType parsedOrderType = OrderType.valueOf(orderType.toUpperCase());
                if (OrderType.BOOKING.equals(parsedOrderType)) {
                    bookingService.updatePaymentStatus(orderNumber, PaymentStatus.FAILED);
                }
            } catch (IllegalArgumentException e) {
                log.warn("Unknown order type received: {}", orderType);
            }
        }
        
        return customResponse("Payment failed or canceled...!!", null);
    }

    @PostMapping("/update-cash-on-delivery-status")
    public ResponseEntity<GlobalAPIResponse> updateCashOnDeliveryStatus(@RequestBody PaymentRequestDto paymentRequestDto) {
        paymentService.updateCashOnDeliveryStatus(paymentRequestDto);
        return updateResponse("Payment");
    }

    @PostMapping("/request-details")
    public ResponseEntity<GlobalAPIResponse> paymentRequestDetails(@RequestBody PaymentRequestDto requestDto) {
        return fetchResponse("Payment", paymentService.paymentRequestDetails(requestDto));
    }
}
