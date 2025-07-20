package com.bikalp.roomrentalservice.dto.response;

import com.bikalp.roomrentalservice.enums.Amenities;
import com.bikalp.roomrentalservice.enums.PropertyType;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Getter
@Setter
public class PropertyResponse {
    private Long id;
    private String roomTitle;
    private String description;
    private PropertyType propertyType;
    private String address;
    private Long roomCount;
    private double rentPrice;
    private Boolean isAvailable;
    private Boolean isActive;
    private Long ownerId;
    private String ownerName;
    private List<Amenities> amenities;
    private List<MultipartFile> images;
} 