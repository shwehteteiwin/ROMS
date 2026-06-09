package com.romsproject.roms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
@EnableScheduling
@SpringBootApplication
public class RomsApplication {

	public static void main(String[] args) {
		SpringApplication.run(RomsApplication.class, args);
	}

}
