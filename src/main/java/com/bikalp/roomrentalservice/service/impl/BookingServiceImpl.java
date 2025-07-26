package com.bikalp.roomrentalservice.service.impl;

import com.bikalp.roomrentalservice.dto.request.BookingRequest;
import com.bikalp.roomrentalservice.dto.response.BookingResponse;
import com.bikalp.roomrentalservice.enums.BookingStatus;
import com.bikalp.roomrentalservice.exception.custom.CustomizeException;
import com.bikalp.roomrentalservice.exception.custom.DataNotFoundException;
import com.bikalp.roomrentalservice.mapper.BookingMapper;
import com.bikalp.roomrentalservice.model.Booking;
import com.bikalp.roomrentalservice.model.Property;
import com.bikalp.roomrentalservice.model.User;
import com.bikalp.roomrentalservice.repository.BookingRepo;
import com.bikalp.roomrentalservice.repository.PropertyRepo;
import com.bikalp.roomrentalservice.repository.UserRepo;
import com.bikalp.roomrentalservice.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepo bookingRepo;
    private final PropertyRepo propertyRepo;
    private final UserRepo userRepo;
    private final BookingMapper bookingMapper;

    @Override
    @Transactional
    public void createBooking(BookingRequest request) {
        
        Property property = getPropertyById(request.getPropertyId());
        User renter = getUserById(request.getUserId());

        checkPropertyIsAvailable(property);

        Booking booking = Booking.builder()
                .property(property)
                .renter(renter)
                .status(BookingStatus.PENDING)
                .build();
        bookingRepo.save(booking);
    }

    @Override
    @Transactional
    public void updateBooking(BookingRequest request) {
        Booking booking = getBookingByBookingId(request.getId());
        
        Property property = getPropertyById(request.getPropertyId());
        User renter = getUserById(request.getUserId());

        checkPropertyIsAvailable(property);

        booking.setProperty(property);
        booking.setRenter(renter);
        bookingRepo.save(booking);
    }

    @Override
    @Transactional
    public void deleteBooking(Long bookingId) {
        Booking booking = getBookingByBookingId(bookingId);
        bookingRepo.delete(booking);
    }

    @Override
    @Transactional
    public void cancelBooking(Long bookingId) {
        updateStatus(bookingId, BookingStatus.CANCELLED);
    }

    @Override
    @Transactional
    public void approveBooking(Long bookingId) {
        updateStatus(bookingId, BookingStatus.CONFIRMED);
    }

    @Override
    public BookingResponse getBookingById(Long bookingId) {
        return bookingMapper.getBookingById(bookingId);
    }

    @Override
    public List<BookingResponse> getAllBookings() {
        return bookingMapper.getAllBookings();
    }

    @Override
    public List<BookingResponse> getAllBookedPropertyByRenterId(Long renterId) {
        return bookingMapper.getAllBookedPropertyByUserId(renterId);
    }

    @Override
    public List<BookingResponse> getAllBookedPropertyByOwnerId(Long ownerId) {
        return bookingMapper.getAllBookedPropertyByOwnerId(ownerId);
    }

    private void checkPropertyIsAvailable(Property property) {
        if (!Boolean.TRUE.equals(property.getIsAvailable())) {
            throw new CustomizeException("Property is not available for booking.");
        }
    }

    private Booking getBookingByBookingId(Long id) {
        return bookingRepo.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Booking not found with id: " + id));
    }

    private Property getPropertyById(Long id) {
        return propertyRepo.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Property not found with id: " + id));
    }

    private User getUserById(Long id) {
        return userRepo.findById(id)
                .orElseThrow(() -> new DataNotFoundException("User not found with id: " + id));
    }

    private void updateStatus(Long bookingId, BookingStatus status) {
        Booking booking = getBookingByBookingId(bookingId);
        booking.setStatus(status);
        bookingRepo.save(booking);
        if (status.equals(BookingStatus.CONFIRMED)){
            Property property = booking.getProperty();
            property.setIsAvailable(Boolean.FALSE);
            propertyRepo.save(property);
        }
        bookingRepo.save(booking);
    }
}
