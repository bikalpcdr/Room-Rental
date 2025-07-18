package com.bikalp.roomrentalservice.service.impl;

import com.bikalp.roomrentalservice.config.UserDataConfig;
import com.bikalp.roomrentalservice.dto.request.PropertyRequest;
import com.bikalp.roomrentalservice.dto.response.PropertyResponse;
import com.bikalp.roomrentalservice.exception.custom.DataNotFoundException;
import com.bikalp.roomrentalservice.mapper.PropertyMapper;
import com.bikalp.roomrentalservice.model.Property;
import com.bikalp.roomrentalservice.model.User;
import com.bikalp.roomrentalservice.repository.PropertyRepo;
import com.bikalp.roomrentalservice.service.PropertyService;
import com.bikalp.roomrentalservice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PropertyServiceImpl implements PropertyService {

    private final PropertyRepo propertyRepo;
    private final PropertyMapper propertyMapper;
    private final UserDataConfig userDataConfig;
    private final UserService userService;

    @Override
    public void createProperty(PropertyRequest request) {
        Property property = mapToEntity(request, userDataConfig.getLoggedInUser());
        propertyRepo.save(property);
    }

    @Override
    public void updateProperty(PropertyRequest request) {
        Property property = getPropertyByIdOrThrow(request.getPropertyId());

        updateEntity(property, request,userDataConfig.getLoggedInUser());
        propertyRepo.save(property);
    }

    @Override
    public void deleteProperty(Long propertyId) {
        Property property = getPropertyByIdOrThrow(propertyId);
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
