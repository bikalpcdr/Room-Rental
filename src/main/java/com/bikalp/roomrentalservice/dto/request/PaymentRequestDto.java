package com.bikalp.roomrentalservice.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentRequestDto {
    private String orderNumber;
    private String paymentMethod;
    private String orderType;
}