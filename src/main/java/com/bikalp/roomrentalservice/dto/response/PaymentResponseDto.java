package com.bikalp.roomrentalservice.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
public class PaymentResponseDto {
    private String formUrl;
    private Map<String, String> payload;
    public PaymentResponseDto(String formUrl, Map<String, String> payload) {
        this.formUrl = formUrl;
        this.payload = payload;
    }
}