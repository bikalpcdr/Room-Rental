package com.bikalp.roomrentalservice.mapper;

import com.bikalp.roomrentalservice.dto.response.BookingResponse;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface BookingMapper {
    BookingResponse getBookingById(Long bookingId);

    List<BookingResponse> getAllBookedPropertyByUserId(Long renterId);

    List<BookingResponse> getAllBookedPropertyByOwnerId(Long ownerId);

    List<BookingResponse> getAllBookings();

    List<BookingResponse> fetchBookingRequest(Long ownerId);
}
