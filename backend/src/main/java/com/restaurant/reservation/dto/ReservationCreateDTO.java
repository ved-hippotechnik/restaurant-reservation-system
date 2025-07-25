package com.restaurant.reservation.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReservationCreateDTO {
    @NotNull(message = "Restaurant ID is required")
    private Long restaurantId;
    
    @NotNull(message = "Customer ID is required")
    private Long customerId;
    
    @NotNull(message = "Reservation date and time is required")
    @Future(message = "Reservation must be in the future")
    private LocalDateTime reservationDateTime;
    
    @NotNull(message = "Party size is required")
    @Min(value = 1, message = "Party size must be at least 1")
    @Max(value = 20, message = "Party size cannot exceed 20")
    private Integer partySize;
    
    @Size(max = 500, message = "Special requests cannot exceed 500 characters")
    private String specialRequests;
    
    private String occasionType;
    
    @Min(value = 30, message = "Duration must be at least 30 minutes")
    @Max(value = 300, message = "Duration cannot exceed 300 minutes")
    private Integer durationMinutes;
    
    // Optional - will use customer's details if not provided
    private String customerName;
    private String customerPhone;
    private String customerEmail;
    
    private String source; // WEBSITE, GOOGLE, SEARCH_ENGINE, etc.
    private String searchEngineBookingId;
}