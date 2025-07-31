package com.bikalp.roomrentalservice.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookingRequest {
    private Long id; // bookingId
    private Long propertyId;
    private Long userId;
    private String paymentMethod; // E_SEWA, KHALTI, CASH
    private Double amount; // Payment amount
}
