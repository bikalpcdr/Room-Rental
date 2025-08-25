package com.bikalp.roomrentalservice.model;

import com.bikalp.roomrentalservice.model.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "password_reset_otp", indexes = {
        @Index(name = "idx_opt_user", columnList = "user_id"),
        @Index(name = "idx_otp_is_already_used", columnList = "is_already_used")
})
public class PasswordResetOtp extends BaseEntity {

    @Column(name = "otp", nullable = false)
    private String otp;

    @Column(name = "expiry_date", nullable = false)
    private LocalDateTime expiryDate;

    @Column(name = "attemps_count", nullable = false)
    private Integer attemptsCount = 0;

    @Column(name = "is_already_used", nullable = false)
    private Boolean isAlreadyUsed = Boolean.FALSE;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}
