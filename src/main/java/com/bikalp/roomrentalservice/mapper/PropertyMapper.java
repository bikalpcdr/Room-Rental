package com.bikalp.roomrentalservice.mapper;

import com.bikalp.roomrentalservice.dto.request.FilterRequest;
import com.bikalp.roomrentalservice.dto.response.PropertyResponse;
import com.bikalp.roomrentalservice.enums.PropertyType;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface PropertyMapper {
    PropertyResponse getPropertyById(Long propertyId);

    List<PropertyResponse> getAllProperties();

    List<PropertyResponse> getAllPropertiesByOwnerId(Long ownerId);

    List<PropertyResponse> searchProperty(FilterRequest request);
}
