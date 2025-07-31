package com.bikalp.roomrentalservice.service;

public interface PaymentTransactionResponseProjection {
    String getTransactionCode();

    String getTransactionUuid();

    String getOrderNumber();

    String getStatus();

    Double getTotalAmount();

    String getProductCode();
}
