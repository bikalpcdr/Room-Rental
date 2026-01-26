package com.bikalp.roomrentalservice.service.impl;

import com.bikalp.roomrentalservice.config.UserDataConfig;
import com.bikalp.roomrentalservice.dto.CloudinaryUploadResponse;
import com.bikalp.roomrentalservice.dto.request.FilterRequest;
import com.bikalp.roomrentalservice.dto.request.PropertyRequest;
import com.bikalp.roomrentalservice.dto.response.BookingResponse;
import com.bikalp.roomrentalservice.dto.response.PropertyResponse;
import com.bikalp.roomrentalservice.exception.custom.CustomizeException;
import com.bikalp.roomrentalservice.exception.custom.DataNotFoundException;
import com.bikalp.roomrentalservice.mapper.BookingMapper;
import com.bikalp.roomrentalservice.mapper.PropertyMapper;
import com.bikalp.roomrentalservice.model.Property;
import com.bikalp.roomrentalservice.model.PropertyImage;
import com.bikalp.roomrentalservice.model.User;
import com.bikalp.roomrentalservice.repository.PropertyImageRepo;
import com.bikalp.roomrentalservice.repository.PropertyRepo;
import com.bikalp.roomrentalservice.service.CloudinaryService;
import com.bikalp.roomrentalservice.service.PropertyService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartException;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PropertyServiceImpl implements PropertyService {

    private final PropertyRepo propertyRepo;
    private final PropertyMapper propertyMapper;
    private final UserDataConfig userDataConfig;
    private final PropertyImageRepo propertyImageRepo;
    private final BookingMapper bookingMapper;
    private final CloudinaryService cloudinaryService;

    @Value("${app.upload.property-images-dir:uploads/property-images/}")
    private String propertyImagesDir;

    @Override
    @Transactional
    public void createProperty(PropertyRequest request) {
        Property property = mapToEntity(request, userDataConfig.getLoggedInUser());
        propertyRepo.save(property);
    }

    @Override
    @Transactional
    public Long createPropertyWithImages(PropertyRequest request, List<MultipartFile> images) {
        Property property = mapToEntity(request, userDataConfig.getLoggedInUser());
        Property saved = propertyRepo.save(property);

        if (images != null && !images.isEmpty()) {
            uploadImagesForProperty(saved.getId(), images);
        }

        return saved.getId();
    }

    @Override
    @Transactional
    public Long updatePropertyWithImages(PropertyRequest request, List<MultipartFile> newImages) {

        Property property = getPropertyByIdOrThrow(request.getPropertyId());

        updateEntity(property, request, userDataConfig.getLoggedInUser());

        if (request.getRemovedImageIds() != null && !request.getRemovedImageIds().isEmpty()) {
            removePropertyImages(property, request.getRemovedImageIds());
        }

        if (newImages != null && !newImages.isEmpty()) {
            uploadImagesForExistingProperty(property, newImages);
        }

        return propertyRepo.save(property).getId();
    }

    @Override
    public void deleteProperty(Long propertyId) {
        Property property = getPropertyByIdOrThrow(propertyId);
        // Delete associated image files from the filesystem
        if (property.getImages() != null) {
            String uploadDir = propertyImagesDir;
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
    public void uploadImagesForProperty(Long propertyId, List<MultipartFile> images) {

        if (images == null || images.isEmpty()) {
            throw new CustomizeException("No images provided");
        }

        long count = images.stream().filter(f -> !f.isEmpty()).count();
        if (count > 20) {
            throw new CustomizeException("Maximum 20 images allowed");
        }

        Property property = getPropertyByIdOrThrow(propertyId);

        for (MultipartFile file : images) {
            if (file.isEmpty()) continue;

            CloudinaryUploadResponse response =
                    cloudinaryService.uploadImage(file);

            PropertyImage propertyImage = PropertyImage.builder()
                    .imageUrl(response.getImageUrl())
                    .publicId(response.getPublicId())
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
    @Transactional
    public void deletePropertyImagesByImageId(Long imageId) {

        PropertyImage image = propertyImageRepo.findById(imageId)
                .orElseThrow(() -> new DataNotFoundException("Image not found"));

        cloudinaryService.deleteImage(image.getPublicId());

        propertyImageRepo.delete(image);
    }

    @Override
    public List<PropertyResponse> searchProperty(FilterRequest request) {
        return propertyMapper.searchProperty(request);
    }

    @Override
    public List<BookingResponse> fetchBookingRequest() {
        return bookingMapper.fetchBookingRequest(userDataConfig.getLoggedInUser().getId());
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
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
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
        property.setLatitude(request.getLatitude());
        property.setLongitude(request.getLongitude());
        property.setRoomCount(request.getRoomCount());
        property.setRentPrice(request.getRentPrice());
        property.setAmenities(request.getAmenities());
        property.setOwner(owner);
    }

    public void uploadImagesForExistingProperty(Property property, List<MultipartFile> images) {

        long newCount = images.stream().filter(f -> !f.isEmpty()).count();
        long existingCount = property.getImages() == null ? 0 : property.getImages().size();

        if (existingCount + newCount > 20) {
            throw new MultipartException("Maximum 20 images allowed");
        }

        if (property.getImages() == null) {
            property.setImages(new ArrayList<>());
        }

        for (MultipartFile file : images) {
            if (file.isEmpty()) continue;

            CloudinaryUploadResponse response = cloudinaryService.uploadImage(file);

            PropertyImage propertyImage = PropertyImage.builder()
                    .imageUrl(response.getImageUrl())
                    .publicId(response.getPublicId())
                    .property(property)
                    .build();

            property.getImages().add(propertyImage);
        }
    }

    public void removePropertyImages(Property property, List<Long> removedImageIds) {

        if (property.getImages() == null || property.getImages().isEmpty()) return;

        Iterator<PropertyImage> iterator = property.getImages().iterator();

        while (iterator.hasNext()) {
            PropertyImage image = iterator.next();

            if (removedImageIds.contains(image.getId())) {
                cloudinaryService.deleteImage(image.getPublicId());
                iterator.remove();
            }
        }
    }
}
