package com.bikalp.roomrentalservice.service.impl;

import com.bikalp.roomrentalservice.dto.CloudinaryUploadResponse;
import com.bikalp.roomrentalservice.exception.custom.CustomizeException;
import com.bikalp.roomrentalservice.service.CloudinaryService;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryServiceImpl implements CloudinaryService {

    private final Cloudinary cloudinary;

    @Override
    public CloudinaryUploadResponse uploadImage(MultipartFile file) {
        try {
            Map<?, ?> uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap("folder", "room-rental/properties")
            );

            return new CloudinaryUploadResponse(
                    uploadResult.get("secure_url").toString(),
                    uploadResult.get("public_id").toString()
            );

        } catch (IOException e) {
            throw new CustomizeException("Cloudinary upload failed");
        }
    }

    @Override
    public void deleteImage(String publicId) {
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (Exception e) {
            throw new CustomizeException("Cloudinary delete failed");
        }
    }
}
