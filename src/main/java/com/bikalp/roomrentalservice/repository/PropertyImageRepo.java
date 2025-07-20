package com.bikalp.roomrentalservice.repository;

import com.bikalp.roomrentalservice.model.PropertyImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PropertyImageRepo extends JpaRepository<PropertyImage, Long> {
} 