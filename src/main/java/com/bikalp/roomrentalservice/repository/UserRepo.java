package com.bikalp.roomrentalservice.repository;

import com.bikalp.roomrentalservice.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<User, Long> {
    boolean existsByEmail(String mail);
    Optional<User> findByUsernameOrEmail(String username, String email);

    String usernameOrEmail(String username, String email);
}
