package com.bikalp.roomrentalservice.dto.response;

import com.bikalp.roomrentalservice.enums.BookingStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookingResponse {
    private Long id;
    private BookingStatus status;
    private PropertyResponse property;
}