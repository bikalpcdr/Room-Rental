package com.bikalp.roomrentalservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class RoomRentalServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(RoomRentalServiceApplication.class, args);
	}

}
