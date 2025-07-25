package com.restaurant.reservation.dto;

import com.restaurant.reservation.model.Reservation;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReservationDTO {
    private Long id;
    private String reservationCode;
    private Long customerId;
    private String customerName;
    private String customerPhone;
    private String customerEmail;
    private Long restaurantId;
    private String restaurantName;
    private Long tableId;
    private String tableNumber;
    private LocalDateTime reservationDateTime;
    private Integer partySize;
    private Reservation.ReservationStatus status;
    private String specialRequests;
    private String occasionType;
    private Integer durationMinutes;
    private LocalDateTime arrivalTime;
    private LocalDateTime seatedTime;
    private LocalDateTime completedTime;
    private String cancellationReason;
    private LocalDateTime cancellationTime;
    private List<String> tags;
    private String source;
    private LocalDateTime createdAt;
}