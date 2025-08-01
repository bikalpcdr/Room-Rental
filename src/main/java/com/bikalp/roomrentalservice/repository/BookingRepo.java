package com.bikalp.roomrentalservice.repository;

import com.bikalp.roomrentalservice.enums.BookingStatus;
import com.bikalp.roomrentalservice.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepo extends JpaRepository<Booking, Long> {

    // Find bookings by property
    List<Booking> findByPropertyId(Long propertyId);

    // Find bookings by renter
    List<Booking> findByRenterId(Long renterId);

    // Find bookings by status
    List<Booking> findByStatus(BookingStatus status);

    // Find bookings by property and status
    List<Booking> findByPropertyIdAndStatus(Long propertyId, BookingStatus status);

    // Find bookings by renter and status
    List<Booking> findByRenterIdAndStatus(Long renterId, BookingStatus status);

    // Find active bookings (not cancelled or completed)
    @Query("SELECT b FROM Booking b WHERE b.status IN ('PENDING', 'CONFIRMED')")
    List<Booking> findActiveBookings();

    // Find booking by order number
    Optional<Booking> findByOrderNumber(String orderNumber);
}
