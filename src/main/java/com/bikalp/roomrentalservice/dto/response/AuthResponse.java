package com.bikalp.roomrentalservice.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private Long id;
    private String token;
    private String username;
    private String email;
    private String fullName;
    private String role;
    private String phoneNumber;
    private String profilePictureUrl;
}