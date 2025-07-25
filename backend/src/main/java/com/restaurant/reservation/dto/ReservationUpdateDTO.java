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
public class ReservationUpdateDTO {
    @Future(message = "Reservation must be in the future")
    private LocalDateTime reservationDateTime;
    
    @Min(value = 1, message = "Party size must be at least 1")
    @Max(value = 20, message = "Party size cannot exceed 20")
    private Integer partySize;
    
    @Size(max = 500, message = "Special requests cannot exceed 500 characters")
    private String specialRequests;
    
    private String occasionType;
}