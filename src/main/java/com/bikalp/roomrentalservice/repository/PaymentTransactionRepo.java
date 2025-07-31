package com.bikalp.roomrentalservice.repository;

import com.bikalp.roomrentalservice.service.PaymentTransactionResponseProjection;
import com.bikalp.roomrentalservice.model.PaymentTransaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentTransactionRepo extends JpaRepository<PaymentTransaction, String> {

    @Query(nativeQuery = true, value = "select pt.transaction_code as transactionCode,\n" +
            "       pt.transaction_uuid as transactionUuid,\n" +
            "       pt.order_number      as orderNumber,\n" +
            "       pt.status           as paymentStatus,\n" +
            "       pt.total_amount     as totalAmount,\n" +
            "       pt.product_code     as productCode\n" +
            "from payment_transaction pt\n" +
            "         left join orders o on pt.transaction_uuid = o.order_transaction_uuid\n" +
            "where (?1 = '___' or ?1 = pt.transaction_uuid)"
    )
    Page<PaymentTransactionResponseProjection> findAllFiltered(@Param("orderNumber") String orderNumber, Pageable pageable);
}
