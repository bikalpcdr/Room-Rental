package com.bikalp.roomrentalservice.model;

import com.bikalp.roomrentalservice.enums.OrderType;
import com.bikalp.roomrentalservice.model.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "payment_transaction")
@Getter
@Setter
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class PaymentTransaction extends BaseEntity {

    @Column(name = "order_number")
    private String orderNumber;

    @Column(name = "transaction_code")
    private String transactionCode;

    @Column(name = "transaction_uuid")
    private String transactionUuid;

    @Column(name = "total_amount")
    private Double totalAmount;

    @Column(name = "status")
    private String status;

    @Column(name = "product_code")
    private String productCode;

    @Column(name = "signature")
    private String signature;

    @Column(name = "signed_field_names")
    private String signedFieldNames;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Enumerated(EnumType.STRING)
    @Column(name = "order_type")
    private OrderType orderType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id")
    private Booking booking;
}
