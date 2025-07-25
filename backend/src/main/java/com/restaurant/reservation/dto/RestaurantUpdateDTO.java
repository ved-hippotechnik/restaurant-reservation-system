package com.restaurant.reservation.dto;

import jakarta.validation.constraints.*;
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
public class RestaurantUpdateDTO {
    private String name;
    private String address;
    private String city;
    private String state;
    
    @Pattern(regexp = "\\d{5}", message = "Invalid zip code")
    private String zipCode;
    
    @Pattern(regexp = "\\d{10}", message = "Invalid phone number")
    private String phoneNumber;
    
    @Email(message = "Invalid email format")
    private String email;
    
    private String description;
    private String cuisine;
    private LocalTime openingTime;
    private LocalTime closingTime;
    
    @Min(value = 30, message = "Reservation duration must be at least 30 minutes")
    @Max(value = 300, message = "Reservation duration cannot exceed 300 minutes")
    private Integer reservationDurationMinutes;
    
    @Min(value = 0, message = "Buffer time cannot be negative")
    @Max(value = 60, message = "Buffer time cannot exceed 60 minutes")
    private Integer bufferTimeMinutes;
    
    private List<String> amenities;
    private List<String> imageUrls;
}