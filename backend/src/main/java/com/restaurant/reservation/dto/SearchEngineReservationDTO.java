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
public class SearchEngineReservationDTO {
    @NotNull(message = "Restaurant ID is required")
    private Long restaurantId;
    
    @NotNull(message = "Date and time is required")
    @Future(message = "Reservation must be in the future")
    private LocalDateTime dateTime;
    
    @NotNull(message = "Party size is required")
    @Min(value = 1, message = "Party size must be at least 1")
    @Max(value = 20, message = "Party size cannot exceed 20")
    private Integer partySize;
    
    @NotBlank(message = "Customer name is required")
    private String customerName;
    
    @NotBlank(message = "Customer email is required")
    @Email(message = "Invalid email format")
    private String customerEmail;
    
    @NotBlank(message = "Customer phone is required")
    @Pattern(regexp = "\\d{10}", message = "Phone number must be 10 digits")
    private String customerPhone;
    
    private String specialRequests;
    private String occasionType;
    
    @NotBlank(message = "Search engine is required")
    private String searchEngine; // GOOGLE, BING, etc.
    
    @NotBlank(message = "Search engine booking ID is required")
    private String searchEngineBookingId;
    
    private String bookingToken; // Optional token for validation
}