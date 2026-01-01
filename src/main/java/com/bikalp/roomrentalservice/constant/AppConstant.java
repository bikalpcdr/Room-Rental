package com.bikalp.roomrentalservice.constant;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class AppConstant {
    public static final String SECRET_KEY = "bikalp-secret-key";
    public static final Integer TOKEN_EXPIRY_DURATION = 1000 * 60 * 60 * 10;
}