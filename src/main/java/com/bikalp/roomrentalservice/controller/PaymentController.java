package com.bikalp.roomrentalservice.controller;

import com.bikalp.roomrentalservice.controller.base.BaseController;
import com.bikalp.roomrentalservice.dto.request.PaymentRequestDto;
import com.bikalp.roomrentalservice.dto.response.GlobalAPIResponse;
import com.bikalp.roomrentalservice.service.PaymentService;
import com.bikalp.roomrentalservice.service.impl.PaymentServiceImpl;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/payment")
public class PaymentController extends BaseController {
    private final PaymentService paymentService;

    public PaymentController(PaymentServiceImpl esewaService) {
        this.paymentService = esewaService;
    }

    @PostMapping("/initiate")
    public void initiatePayment(HttpServletResponse response, @RequestBody PaymentRequestDto requestDto) throws IOException {
        String html = paymentService.payment(requestDto);
        response.setContentType("text/html;charset=UTF-8");
        response.getWriter().write(html);
        response.getWriter().flush();
    }

    @PostMapping("/status")
    @ResponseBody
    public ResponseEntity<GlobalAPIResponse> handleSuccess(@RequestParam String orderNumber, @RequestParam String orderType) {
        return customResponse("Payment status handle Successfully..!!", paymentService.checkEsewaPaymentStatus(orderNumber, orderType));
    }

    @PostMapping("/failure")
    @ResponseBody
    public ResponseEntity<GlobalAPIResponse> handleFailure() {
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
