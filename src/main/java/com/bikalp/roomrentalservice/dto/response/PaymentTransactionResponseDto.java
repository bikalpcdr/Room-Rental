package com.bikalp.roomrentalservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PaymentTransactionResponseDto {
    private String transactionCode;
    private String transactionUuid;
    private String orderNumber;
    private String status;
    private Double totalAmount;
    private String productCode;


}
