package com.bikalp.roomrentalservice.controller;

import com.bikalp.roomrentalservice.controller.base.BaseController;
import com.bikalp.roomrentalservice.dto.request.BookingRequest;
import com.bikalp.roomrentalservice.dto.response.GlobalAPIResponse;
import com.bikalp.roomrentalservice.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@PreAuthorize("hasAnyRole('ADMIN', 'OWNER','RENTER')")
@RequestMapping("/api/booking")
public class BookingController extends BaseController {

    private final BookingService bookingService;
    String entity = "Booking";

    @PreAuthorize("hasAnyRole('ADMIN', 'RENTER')")
    @PostMapping
    public ResponseEntity<GlobalAPIResponse> createBooking(@RequestBody BookingRequest request) {
        bookingService.createBooking(request);
        return createdResponse(entity);
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
    @PutMapping("/approve/{bookingId}")
    public ResponseEntity<GlobalAPIResponse> approveBooking(@PathVariable Long bookingId) {
        bookingService.approveBooking(bookingId);
        return updateResponse(entity);
    }
}
