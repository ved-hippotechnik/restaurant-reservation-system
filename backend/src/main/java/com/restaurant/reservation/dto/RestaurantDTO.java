package com.restaurant.reservation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantDTO {
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
    private Integer reservationDurationMinutes;
    private Integer bufferTimeMinutes;
    private Boolean active;
    private Double latitude;
    private Double longitude;
    private List<String> amenities;
    private List<String> imageUrls;
    private Integer totalTables;
    private Double averageRating;
    private Integer totalReviews;
}