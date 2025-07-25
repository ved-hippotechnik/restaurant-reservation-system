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
public class RestaurantCreateDTO {
    @NotBlank(message = "Restaurant name is required")
    private String name;
    
    @NotBlank(message = "Address is required")
    private String address;
    
    @NotBlank(message = "City is required")
    private String city;
    
    @NotBlank(message = "State is required")
    private String state;
    
    @NotBlank(message = "Zip code is required")
    @Pattern(regexp = "\\d{5}", message = "Invalid zip code")
    private String zipCode;
    
    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "\\d{10}", message = "Invalid phone number")
    private String phoneNumber;
    
    @Email(message = "Invalid email format")
    private String email;
    
    private String description;
    
    @NotBlank(message = "Cuisine type is required")
    private String cuisine;
    
    @NotNull(message = "Opening time is required")
    private LocalTime openingTime;
    
    @NotNull(message = "Closing time is required")
    private LocalTime closingTime;
    
    @Min(value = 30, message = "Reservation duration must be at least 30 minutes")
    @Max(value = 300, message = "Reservation duration cannot exceed 300 minutes")
    private Integer reservationDurationMinutes = 120;
    
    @Min(value = 0, message = "Buffer time cannot be negative")
    @Max(value = 60, message = "Buffer time cannot exceed 60 minutes")
    private Integer bufferTimeMinutes = 15;
    
    @NotNull(message = "Latitude is required")
    @Min(value = -90, message = "Invalid latitude")
    @Max(value = 90, message = "Invalid latitude")
    private Double latitude;
    
    @NotNull(message = "Longitude is required")
    @Min(value = -180, message = "Invalid longitude")
    @Max(value = 180, message = "Invalid longitude")
    private Double longitude;
    
    private List<String> amenities;
    private List<String> imageUrls;
}