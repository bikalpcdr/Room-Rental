package com.bikalp.roomrentalservice.dto.response;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LoggedInUserInfo {

    private Long userId;
    private String fullName;
    private String username;
    private String email;
    private String phoneNumber;
    private String address;
    private String profilePictureUrl;
}
