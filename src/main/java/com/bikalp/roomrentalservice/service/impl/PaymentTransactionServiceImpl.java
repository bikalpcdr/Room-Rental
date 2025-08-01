package com.bikalp.roomrentalservice.service.impl;

import com.bikalp.roomrentalservice.dto.request.PaginatedRequestDto;
import com.bikalp.roomrentalservice.dto.request.PaymentCallbackRequest;
import com.bikalp.roomrentalservice.enums.OrderType;
import com.bikalp.roomrentalservice.enums.PaymentStatus;
import com.bikalp.roomrentalservice.model.Booking;
import com.bikalp.roomrentalservice.model.PaymentTransaction;
import com.bikalp.roomrentalservice.repository.BookingRepo;
import com.bikalp.roomrentalservice.repository.PaymentTransactionRepo;
import com.bikalp.roomrentalservice.service.BookingService;
import com.bikalp.roomrentalservice.service.PaymentTransactionResponseProjection;
import com.bikalp.roomrentalservice.service.PaymentTransactionService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentTransactionServiceImpl implements PaymentTransactionService {

    private final PaymentTransactionRepo paymentTransactionRepo;
    private final BookingRepo bookingRepo;
    private final BookingService bookingService;

    @Transactional
    @Override
    public void savePaymentResponseTransaction(PaymentCallbackRequest request) {
        log.info("savePaymentResponseTransaction() START: {}", request);
        
        PaymentTransaction paymentTransaction = new PaymentTransaction();
        paymentTransaction.setOrderNumber(request.getOrderNumber());
        paymentTransaction.setTransactionCode(request.getTransactionCode());
        paymentTransaction.setTransactionUuid(request.getTransactionUuid());
        paymentTransaction.setTotalAmount(request.getTotalAmount());
        paymentTransaction.setStatus(request.getStatus());
        paymentTransaction.setProductCode(request.getProductCode());
        paymentTransaction.setSignature(request.getSignature());
        paymentTransaction.setSignedFieldNames(request.getSignedFieldName());
        paymentTransaction.setPaymentMethod(request.getPaymentMethod());
        paymentTransaction.setOrderType(request.getOrderType());

        // Link with booking if it's a booking transaction
        if (OrderType.BOOKING.equals(request.getOrderType())) {
            bookingRepo.findByOrderNumber(request.getOrderNumber()).ifPresent(booking -> {
                paymentTransaction.setBooking(booking);
                
                // Update booking payment status based on transaction status
                PaymentStatus paymentStatus = PaymentStatus.SUCCESS.name().equalsIgnoreCase(request.getStatus())
                    ? PaymentStatus.PAID 
                    : PaymentStatus.FAILED;
                
                bookingService.updatePaymentStatus(request.getOrderNumber(), paymentStatus);
            });
        }

        paymentTransactionRepo.save(paymentTransaction);
        log.info("savePaymentResponseTransaction() END: {}", request);
    }

    @Override
    public Page<PaymentTransactionResponseProjection> getAllTransactions(PaginatedRequestDto requestDto) {
        log.info("getAllTransactions() START: {}", requestDto);
        Sort.Direction direction = Sort.Direction.fromString(requestDto.getSortDirection());
        String sortBy = switch (requestDto.getSortBy()) {
            case "transactionUuid" -> "transaction_uuid";
            case "orderNumber" -> "order_number";
            default -> "created_date";
        };

        Pageable pageable = PageRequest.of(requestDto.getPage(), requestDto.getSize(), Sort.by(direction, sortBy));
        log.info("getAllTransactions() END: {}", requestDto);
        return paymentTransactionRepo.findAllFiltered(requestDto.getOrderNumber() == null ? "___" : requestDto.getOrderNumber(), pageable);
    }
}
