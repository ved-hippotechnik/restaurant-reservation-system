package com.restaurant.reservation.dto;

import com.restaurant.reservation.model.SimpleReservation;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SimpleReservationDTO {
    private Long id;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private LocalDateTime reservationDateTime;
    private Integer partySize;
    private String specialRequests;
    private SimpleReservation.ReservationStatus status;
    private Long restaurantId;
    private String restaurantName;
}