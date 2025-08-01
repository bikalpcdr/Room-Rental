package com.bikalp.roomrentalservice.dto.request;

import com.bikalp.roomrentalservice.enums.PaymentMethod;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookingRequest {
    private Long id; // bookingId
    private Long propertyId;
    private Long userId;
    private PaymentMethod paymentMethod; // E_SEWA, KHALTI, CASH
    private Double amount; // Payment amount
}
