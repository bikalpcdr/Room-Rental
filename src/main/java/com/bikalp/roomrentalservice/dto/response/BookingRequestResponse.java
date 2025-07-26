package com.bikalp.roomrentalservice.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookingRequestResponse {

    private Long id;
    private UserResponse user;
    private PropertyResponse property;

}

