package com.bikalp.roomrentalservice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CloudinaryUploadResponse {
    private String imageUrl;
    private String publicId;
}
