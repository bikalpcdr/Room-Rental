package com.bikalp.roomrentalservice.controller;

import com.bikalp.roomrentalservice.controller.base.BaseController;
import com.bikalp.roomrentalservice.dto.request.PropertyRequest;
import com.bikalp.roomrentalservice.dto.response.GlobalAPIResponse;
import com.bikalp.roomrentalservice.service.PropertyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@RequiredArgsConstructor
@RestController
@PreAuthorize("hasAnyRole('ADMIN', 'OWNER')")
@RequestMapping("/api/property")
public class PropertyController extends BaseController {

    private final PropertyService propertyService;
    String entity = "Property";

    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER')")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<GlobalAPIResponse> createProperty(@ModelAttribute PropertyRequest request) {
        propertyService.createProperty(request);
        return createdResponse(entity);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER')")
    @PutMapping
    public ResponseEntity<GlobalAPIResponse> updateProperty(@RequestBody PropertyRequest request) {
        propertyService.updateProperty(request);
        return updateResponse(entity);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER')")
    @GetMapping("/{propertyId}")
    public ResponseEntity<GlobalAPIResponse> getPropertyByPropertyId(@PathVariable Long propertyId) {
        return fetchResponse(entity, propertyService.getPropertyById(propertyId));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER')")
    @GetMapping
    public ResponseEntity<GlobalAPIResponse> getAllProperties() {
        return fetchResponse(entity, propertyService.getAllProperties());
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER')")
    @GetMapping("get-all-owner-properties")
    public ResponseEntity<GlobalAPIResponse> getAllPropertiesByOwnerId() {
        return fetchListResponse(entity, propertyService.getAllPropertiesByOwnerId());
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER')")
    @DeleteMapping("/{propertyId}")
    public ResponseEntity<GlobalAPIResponse> deletePropertyById(@PathVariable Long propertyId) {
        propertyService.deleteProperty(propertyId);
        return deleteResponse(entity);
    }
}
