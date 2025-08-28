package com.bikalp.roomrentalservice.dto.request;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserSettingRequest {
    private String email;
    private String name;
    private String username;
    private String phoneNumber;
}
