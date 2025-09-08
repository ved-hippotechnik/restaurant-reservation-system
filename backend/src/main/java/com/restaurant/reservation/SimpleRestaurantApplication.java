package com.restaurant.reservation;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class SimpleRestaurantApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(SimpleRestaurantApplication.class, args);
    }
}