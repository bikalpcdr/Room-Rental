package com.bikalp.roomrentalservice.service;

import com.bikalp.roomrentalservice.dto.request.BookingRequest;
import com.bikalp.roomrentalservice.dto.response.BookingResponse;

import java.util.List;

public interface BookingService {
    void createBooking(BookingRequest request);

    void updateBooking(BookingRequest request);

    void deleteBooking(Long bookingId);

    void cancelBooking(Long bookingId);

    void approveBooking(Long bookingId);

    void rejectBooking(Long bookingId);

    void updatePaymentStatus(String orderNumber, String status);

    BookingResponse getBookingById(Long bookingId);

    List<BookingResponse> getAllBookedPropertyByRenterId(Long renterId);

    List<BookingResponse> getAllBookedPropertyByOwnerId(Long ownerId);

    List<BookingResponse> getAllBookings();
}
