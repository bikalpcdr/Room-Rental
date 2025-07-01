package com.bikalp.roomrentalservice.controller;

import com.bikalp.roomrentalservice.controller.base.BaseController;
import com.bikalp.roomrentalservice.dto.request.UserCreationRequest;
import com.bikalp.roomrentalservice.dto.request.UserUpdateRequest;
import com.bikalp.roomrentalservice.dto.response.GlobalAPIResponse;
import com.bikalp.roomrentalservice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RequiredArgsConstructor
@RestController
@PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'RENTER')")
@RequestMapping("/api/users")
public class UserController extends BaseController {

    private final UserService userService;
    String entity = "User";

    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'RENTER')")
    @PostMapping
    public ResponseEntity<GlobalAPIResponse> createUser(@RequestBody UserCreationRequest request) {
        userService.createUser(request);
        return createdResponse(entity);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'RENTER')")
    @PutMapping
    public ResponseEntity<GlobalAPIResponse> updateUser(@RequestBody UserUpdateRequest request) {
        userService.updateUser(request);
        return updateResponse(entity);
    }
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'RENTER')")
    @GetMapping("/{userId}")
    public ResponseEntity<GlobalAPIResponse> getUserByUserId(@PathVariable Long userId) {
        return fetchResponse(entity, userService.getUserById(userId));
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @GetMapping
    public ResponseEntity<GlobalAPIResponse> getAllUsers() {
        return fetchListResponse(entity, userService.getAllUsers());
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @DeleteMapping("/{userId}")
    public ResponseEntity<GlobalAPIResponse> deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return deleteResponse(entity);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'RENTER')")
    @PostMapping("/{userId}/profile-picture")
    public ResponseEntity<GlobalAPIResponse> uploadProfilePicture(@PathVariable Long userId, @RequestParam("file") MultipartFile file) {
        String url = userService.uploadProfilePicture(userId, file);
        return customResponse("Profile picture uploaded successfully..", url);
    }
}
