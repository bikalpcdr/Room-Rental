package com.bikalp.roomrentalservice.dto.request;

import com.bikalp.roomrentalservice.enums.Amenities;
import com.bikalp.roomrentalservice.enums.PropertyType;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Getter
@Setter
public class PropertyRequest {
    private Long propertyId;
    private String title;
    private String description;
    private PropertyType propertyType;
    private String address;
    private Double latitude;
    private Double longitude;
    private Long roomCount;
    private double rentPrice;
    private Boolean isAvailable;
    private Long ownerId;
    private List<Amenities> amenities;
//    private List<MultipartFile> images;
}