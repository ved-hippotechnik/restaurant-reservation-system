package com.restaurant.reservation.dto;

import lombok.*;

import java.time.LocalTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SimpleRestaurantDTO {
    private Long id;
    private String name;
    private String address;
    private String city;
    private String state;
    private String zipCode;
    private String phoneNumber;
    private String email;
    private String description;
    private String cuisine;
    private LocalTime openingTime;
    private LocalTime closingTime;
    private Integer capacity;
    private Boolean active;
    private String imageUrl;
    private List<String> gallery;
    private String priceRange;
    private Double rating;
}