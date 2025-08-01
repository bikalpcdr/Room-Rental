package com.bikalp.roomrentalservice.dto.request;

import com.bikalp.roomrentalservice.enums.OrderType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentCallbackRequest {
    private String transactionCode;
    private String status;
    private Double totalAmount;
    private String transactionUuid;
    private String productCode;
    private String signedFieldName;
    private String signature;
    private String orderNumber;
    private String paymentMethod;
    private OrderType orderType;
    private Long bookingId;
}
