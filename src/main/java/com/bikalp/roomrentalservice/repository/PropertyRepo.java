package com.bikalp.roomrentalservice.repository;

import com.bikalp.roomrentalservice.model.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PropertyRepo extends JpaRepository<Property, Long> {

} 