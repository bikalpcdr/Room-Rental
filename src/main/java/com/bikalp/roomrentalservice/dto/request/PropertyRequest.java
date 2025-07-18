package com.bikalp.roomrentalservice.dto.request;

import com.bikalp.roomrentalservice.enums.Amenities;
import com.bikalp.roomrentalservice.enums.PropertyType;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class PropertyRequest {
    private Long propertyId;
    private String title;
    private String description;
    private PropertyType propertyType;
    private String address;
    private Long roomCount;
    private double rentPrice;
    private Boolean isAvailable;
    private Long ownerId;
    private List<Amenities> amenities;
} 