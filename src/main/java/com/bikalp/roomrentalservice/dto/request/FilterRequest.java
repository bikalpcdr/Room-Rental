package com.bikalp.roomrentalservice.dto.request;

import com.bikalp.roomrentalservice.enums.PropertyType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FilterRequest {
    private PropertyType propertyType;
    private String address;
    private double priceRange;
}
