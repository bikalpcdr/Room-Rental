package com.bikalp.roomrentalservice.service;

import com.bikalp.roomrentalservice.dto.CloudinaryUploadResponse;
import org.springframework.web.multipart.MultipartFile;

public interface CloudinaryService {
    CloudinaryUploadResponse uploadImage(MultipartFile file);

    void deleteImage(String imageUrl);
}