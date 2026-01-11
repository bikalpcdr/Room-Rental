package com.bikalp.roomrentalservice.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import java.util.Optional;

@Configuration
@EnableJpaAuditing(auditorAwareRef = "auditorProvider")
@RequiredArgsConstructor
public class AuditorConfig {

    private final UserDataConfig userDataConfig;

    @Bean
    public AuditorAware<Integer> auditorProvider() {
        return () -> Optional.ofNullable(userDataConfig.getCurrentUserId().intValue());
    }
}