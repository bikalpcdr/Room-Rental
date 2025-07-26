package com.bikalp.roomrentalservice.dto.response;

import com.bikalp.roomrentalservice.enums.UserRole;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserResponse {

    private Long userId;

    private String username;

    private String email;

    private String fullName;

    private String phoneNumber;

    private UserRole role;

    private Boolean isActive;

    private String profilePictureUrl;
}
