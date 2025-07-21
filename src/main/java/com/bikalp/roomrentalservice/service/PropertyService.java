package com.bikalp.roomrentalservice.service;

import com.bikalp.roomrentalservice.dto.request.PropertyRequest;
import com.bikalp.roomrentalservice.dto.response.PropertyResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface PropertyService {
    void createProperty(PropertyRequest request);

    void updateProperty(PropertyRequest request);

    void deleteProperty(Long propertyId);

    PropertyResponse getPropertyById(Long propertyId);

    List<PropertyResponse> getAllProperties();

    List<PropertyResponse> getAllPropertiesByOwnerId();

    void uploadImagesForProperty(Long propertyId, List<MultipartFile> images);

    void deletePropertyImagesByImageId(Long imageId);
} 