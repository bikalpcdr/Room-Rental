package com.bikalp.roomrentalservice.service.impl;

import com.bikalp.roomrentalservice.config.UserDataConfig;
import com.bikalp.roomrentalservice.dto.request.FilterRequest;
import com.bikalp.roomrentalservice.dto.request.PropertyRequest;
import com.bikalp.roomrentalservice.dto.response.PropertyResponse;
import com.bikalp.roomrentalservice.enums.PropertyType;
import com.bikalp.roomrentalservice.exception.custom.CustomizeException;
import com.bikalp.roomrentalservice.exception.custom.DataNotFoundException;
import com.bikalp.roomrentalservice.mapper.PropertyMapper;
import com.bikalp.roomrentalservice.model.Property;
import com.bikalp.roomrentalservice.model.PropertyImage;
import com.bikalp.roomrentalservice.model.User;
import com.bikalp.roomrentalservice.repository.PropertyImageRepo;
import com.bikalp.roomrentalservice.repository.PropertyRepo;
import com.bikalp.roomrentalservice.service.PropertyService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartException;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PropertyServiceImpl implements PropertyService {

    private final PropertyRepo propertyRepo;
    private final PropertyMapper propertyMapper;
    private final UserDataConfig userDataConfig;
    private final PropertyImageRepo propertyImageRepo;

    @Override
    @Transactional
    public void createProperty(PropertyRequest request) {
        Property property = mapToEntity(request, userDataConfig.getLoggedInUser());
        propertyRepo.save(property);
    }

    @Override
    public void updateProperty(PropertyRequest request) {
        Property property = getPropertyByIdOrThrow(request.getPropertyId());

        updateEntity(property, request, userDataConfig.getLoggedInUser());
        propertyRepo.save(property);
    }

    @Override
    public void deleteProperty(Long propertyId) {
        Property property = getPropertyByIdOrThrow(propertyId);
        // Delete associated image files from the filesystem
        if (property.getImages() != null) {
            String uploadDir = "/home/yenyasof/Downloads/room-rental/frontend/public/property-images";
            for (PropertyImage image : property.getImages()) {
                if (image.getImageUrl() != null) {
                    String fileName = image.getImageUrl().replace("/property-images/", "");
                    java.io.File file = new java.io.File(uploadDir, fileName);
                    if (file.exists()) {
                        file.delete();
                    }
                }
            }
        }
        propertyRepo.delete(property);
    }

    @Override
    public PropertyResponse getPropertyById(Long propertyId) {
        return propertyMapper.getPropertyById(propertyId);
    }

    @Override
    public List<PropertyResponse> getAllProperties() {
        return propertyMapper.getAllProperties();
    }

    @Override
    public List<PropertyResponse> getAllPropertiesByOwnerId() {
        User owner = userDataConfig.getLoggedInUser();
        return propertyMapper.getAllPropertiesByOwnerId(owner.getId());
    }

    @Override
    @Transactional
    public void uploadImagesForProperty(Long propertyId, List<MultipartFile> images) {
        if (images == null || images.isEmpty()) {
            throw new CustomizeException("No images provided for upload.");
        }
        long nonEmptyCount = images.stream().filter(f -> !f.isEmpty()).count();
        if (nonEmptyCount > 20) {
            throw new MultipartException("You can upload a maximum of 20 images per property.");
        }
        Property property = getPropertyByIdOrThrow(propertyId);
        String uploadDir = "/home/yenyasof/Downloads/room-rental/frontend/public/property-images";
        File dir = new File(uploadDir);
        if (!dir.exists()) dir.mkdirs();
        for (MultipartFile file : images) {
            if (file.isEmpty()) continue;
            String ext = file.getOriginalFilename() != null && file.getOriginalFilename().contains(".")
                    ? file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf('.'))
                    : "";
            String filename = "property-" + property.getId() + "-" + UUID.randomUUID() + ext;
            Path filePath = Paths.get(uploadDir, filename);
            try {
                Files.write(filePath, file.getBytes());
            } catch (IOException e) {
                e.printStackTrace();
                throw new CustomizeException("Failed to save property image");
            }
            String url = "/property-images/" + filename;
            PropertyImage propertyImage = PropertyImage.builder()
                    .imageUrl(url)
                    .property(property)
                    .build();
            propertyImageRepo.save(propertyImage);
            if (property.getImages() == null) {
                property.setImages(new ArrayList<>());
            }
            property.getImages().add(propertyImage);
        }
        propertyRepo.save(property);
    }

    @Override
    public void deletePropertyImagesByImageId(Long imageId) {
        PropertyImage image = propertyImageRepo.findById(imageId)
                .orElseThrow(() -> new DataNotFoundException("Image not found"));
        // Delete file from filesystem
        String uploadDir = "/home/yenyasof/Downloads/room-rental/frontend/public/property-images";
        if (image.getImageUrl() != null) {
            String fileName = image.getImageUrl().replace("/property-images/", "");
            java.io.File file = new java.io.File(uploadDir, fileName);
            if (file.exists()) file.delete();
        }
        propertyImageRepo.delete(image);
    }

    @Override
    public List<PropertyResponse> searchProperty(FilterRequest request) {
        return propertyMapper.searchProperty(request);
    }

    private Property getPropertyByIdOrThrow(Long propertyId) {
        return propertyRepo.findById(propertyId).orElseThrow(
                () -> new DataNotFoundException("Property not found with ID: " + propertyId)
        );
    }

    private Property mapToEntity(PropertyRequest request, User owner) {
        return Property.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .propertyType(request.getPropertyType())
                .address(request.getAddress())
                .roomCount(request.getRoomCount())
                .rentPrice(request.getRentPrice())
                .isAvailable(request.getIsAvailable())
                .owner(owner)
                .amenities(request.getAmenities())
                .build();
    }

    private void updateEntity(Property property, PropertyRequest request, User owner) {
        property.setTitle(request.getTitle());
        property.setDescription(request.getDescription());
        property.setPropertyType(request.getPropertyType());
        property.setAddress(request.getAddress());
        property.setRoomCount(request.getRoomCount());
        property.setRentPrice(request.getRentPrice());
        property.setAmenities(request.getAmenities());
        property.setOwner(owner);
    }
}
