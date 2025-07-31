package com.bikalp.roomrentalservice.controller;

import com.bikalp.roomrentalservice.controller.base.BaseController;
import com.bikalp.roomrentalservice.dto.request.BookingRequest;
import com.bikalp.roomrentalservice.dto.request.PaymentRequestDto;
import com.bikalp.roomrentalservice.dto.response.GlobalAPIResponse;
import com.bikalp.roomrentalservice.service.BookingService;
import com.bikalp.roomrentalservice.service.PaymentService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RequiredArgsConstructor
@RestController
@Slf4j
@PreAuthorize("hasAnyRole('ADMIN', 'OWNER','RENTER')")
@RequestMapping("/api/booking")
public class BookingController extends BaseController {

    private final BookingService bookingService;
    private final PaymentService paymentService;
    String entity = "Booking";

    @PreAuthorize("hasAnyRole('ADMIN', 'RENTER')")
    @PostMapping
    public ResponseEntity<GlobalAPIResponse> createBooking(@RequestBody BookingRequest request) {
        bookingService.createBooking(request);
        return createdResponse(entity);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'RENTER')")
    @PostMapping("/initiate-payment")
    public void initiateBookingPayment(HttpServletResponse response, @RequestBody BookingRequest request) throws IOException {
        // First create the booking
        bookingService.createBooking(request);

        // Then initiate payment
        PaymentRequestDto paymentRequest = new PaymentRequestDto();
        paymentRequest.setOrderNumber("BOOKING_" + System.currentTimeMillis());
        paymentRequest.setPaymentMethod(request.getPaymentMethod());
        paymentRequest.setOrderType("BOOKING");

        String html = paymentService.payment(paymentRequest);
        response.setContentType("text/html;charset=UTF-8");
        response.getWriter().write(html);
        response.getWriter().flush();
    }

    @RequestMapping(value = "/payment-callback", method = {RequestMethod.GET, RequestMethod.POST})
    public ResponseEntity<GlobalAPIResponse> handlePaymentCallback(
            @RequestParam(required = false) String orderNumber,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String transaction_uuid,
            @RequestParam(required = false) String product_code) {

        // Log the callback for debugging
        log.info("Payment callback received - orderNumber: {}, status: {}", orderNumber, status);

        // Handle different parameter names that eSewa might send
        String finalOrderNumber = orderNumber != null ? orderNumber : transaction_uuid;
        String finalStatus = status != null ? status : "UNKNOWN";

        if (finalOrderNumber != null) {
            bookingService.updatePaymentStatus(finalOrderNumber, finalStatus);
            return customResponse("Payment status updated successfully", null);
        } else {
            return customResponse("Payment callback received but no order number found", null);
        }
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'RENTER')")
    @PutMapping
    public ResponseEntity<GlobalAPIResponse> updateBooking(@RequestBody BookingRequest request) {
        bookingService.updateBooking(request);
        return updateResponse(entity);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'RENTER')")
    @GetMapping("/{bookingId}")
    public ResponseEntity<GlobalAPIResponse> getBookingById(@PathVariable Long bookingId) {
        return fetchResponse(entity, bookingService.getBookingById(bookingId));
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @GetMapping
    public ResponseEntity<GlobalAPIResponse> getAllBookings() {
        return fetchListResponse(entity, bookingService.getAllBookings());
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'RENTER')")
    @GetMapping("/renter/{renterId}")
    public ResponseEntity<GlobalAPIResponse> getBookingsByRenterId(@PathVariable Long renterId) {
        return fetchListResponse(entity, bookingService.getAllBookedPropertyByRenterId(renterId));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER')")
    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<GlobalAPIResponse> getBookingsByOwnerId(@PathVariable Long ownerId) {
        return fetchListResponse(entity, bookingService.getAllBookedPropertyByOwnerId(ownerId));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'RENTER')")
    @DeleteMapping("/{bookingId}")
    public ResponseEntity<GlobalAPIResponse> deleteBooking(@PathVariable Long bookingId) {
        bookingService.deleteBooking(bookingId);
        return deleteResponse(entity);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'RENTER')")
    @PutMapping("/cancel/{bookingId}")
    public ResponseEntity<GlobalAPIResponse> cancelBooking(@PathVariable Long bookingId) {
        bookingService.cancelBooking(bookingId);
        return updateResponse(entity);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER')")
    @PutMapping("/reject/{bookingId}")
    public ResponseEntity<GlobalAPIResponse> rejectBooking(@PathVariable Long bookingId) {
        bookingService.rejectBooking(bookingId);
        return updateResponse(entity);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER')")
    @PutMapping("/approve/{bookingId}")
    public ResponseEntity<GlobalAPIResponse> approveBooking(@PathVariable Long bookingId) {
        bookingService.approveBooking(bookingId);
        return updateResponse(entity);
    }
}
