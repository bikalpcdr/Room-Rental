package com.bikalp.roomrentalservice.dto.request;

import com.bikalp.roomrentalservice.enums.OrderType;
import com.bikalp.roomrentalservice.enums.PaymentMethod;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentRequestDto {
    private String orderNumber;
    private PaymentMethod paymentMethod;
    private OrderType orderType;
}