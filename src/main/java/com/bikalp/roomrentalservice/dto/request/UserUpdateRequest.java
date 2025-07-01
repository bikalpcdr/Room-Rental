package com.bikalp.roomrentalservice.dto.request;

import com.bikalp.roomrentalservice.enums.UserRole;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserUpdateRequest {

    @NotBlank(message = "User id is required while update user")
    private Long id;
    private String username;

    private String fullName;

    private String phoneNumber;

    private UserRole role = UserRole.RENTER;

    private String profilePictureUrl;
}
