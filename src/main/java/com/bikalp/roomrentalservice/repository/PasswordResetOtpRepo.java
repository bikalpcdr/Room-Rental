package com.bikalp.roomrentalservice.repository;

import com.bikalp.roomrentalservice.model.PasswordResetOtp;
import com.bikalp.roomrentalservice.model.User;
import org.apache.ibatis.annotations.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface PasswordResetOtpRepo extends JpaRepository<PasswordResetOtp, Long> {
    @Query(value = "select * from password_reset_otp " +
            "where user_id = :userId and is_already_used = false " +
            "order by id desc limit 1",
            nativeQuery = true)
    PasswordResetOtp findLatestActiveOtpByUser(@Param("userId") Long userId);

    Iterable<Object> findByUserAndIsAlreadyUsedFalse(User user);
}
