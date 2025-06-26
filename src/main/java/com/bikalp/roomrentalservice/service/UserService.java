package com.bikalp.roomrentalservice.service;

import com.bikalp.roomrentalservice.dto.request.UserCreationRequest;


public interface UserService {
    void createUser(UserCreationRequest request);
}
