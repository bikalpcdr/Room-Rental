package com.bikalp.roomrentalservice.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaginatedRequestDto {
    private int page = 0;
    private int size = 10;
    private String orderNumber;
    private String sortBy = "createdDate";
    private String sortDirection = "desc";
}
