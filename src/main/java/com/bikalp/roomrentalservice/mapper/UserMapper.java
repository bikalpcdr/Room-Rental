package com.bikalp.roomrentalservice.mapper;

import com.bikalp.roomrentalservice.dto.response.UserResponse;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface UserMapper {
    UserResponse getUserById(Long userId);
    List<UserResponse> getAllUsers();
}
