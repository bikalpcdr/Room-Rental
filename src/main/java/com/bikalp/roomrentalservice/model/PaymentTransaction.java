package com.bikalp.roomrentalservice.model;

import com.bikalp.roomrentalservice.model.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "payment_transaction")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PaymentTransaction extends BaseEntity {

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

//    @OneToOne
//    @JoinColumn(name = "transaction_uuid", referencedColumnName = "booking_transaction_uuid", insertable = false, updatable = false)
//    private Booking booking;
}
