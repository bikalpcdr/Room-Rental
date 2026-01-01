package com.bikalp.roomrentalservice.controller;

import com.bikalp.roomrentalservice.controller.base.BaseController;
import com.bikalp.roomrentalservice.dto.request.ResetPasswordRequest;
import com.bikalp.roomrentalservice.dto.request.UserCreationRequest;
import com.bikalp.roomrentalservice.dto.request.UserSettingRequest;
import com.bikalp.roomrentalservice.dto.request.UserUpdateRequest;
import com.bikalp.roomrentalservice.dto.response.GlobalAPIResponse;
import com.bikalp.roomrentalservice.service.AuthService;
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
    private final AuthService authService;
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
    @PostMapping("/upload/profile-picture")
    public ResponseEntity<GlobalAPIResponse> uploadProfilePicture(@RequestParam("file") MultipartFile file) {
        userService.uploadProfilePicture(file);
        return customResponse("Profile picture uploaded successfully..", null);
    }

    // user setting related things
    @PostMapping("/change-password")
    public ResponseEntity<GlobalAPIResponse> changePassword(@RequestBody ResetPasswordRequest request) {
        userService.changePassword(request);
        return passwordChangeResponse();
    }

    // update username , email, name , phone numbers
    @PostMapping("/update-info")
    public ResponseEntity<GlobalAPIResponse> updateInfo(@RequestBody UserSettingRequest request) {
        userService.updateInfo(request);
        return updateResponse(entity);
    }

    @GetMapping("/user-info")
    public ResponseEntity<GlobalAPIResponse> getLoggedInUserInfo() {
        return fetchResponse(entity, userService.getLoggedInUserInfo());
    }
}
