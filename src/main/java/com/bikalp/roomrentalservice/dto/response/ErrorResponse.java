package com.bikalp.roomrentalservice.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class ErrorResponse {
    private String message;
    private Boolean status;
    private LocalDateTime timestamp;
}