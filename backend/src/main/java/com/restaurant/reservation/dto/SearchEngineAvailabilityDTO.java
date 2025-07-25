package com.restaurant.reservation.dto;

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
public class SearchEngineAvailabilityDTO {
    private Long restaurantId;
    private String restaurantName;
    private LocalDateTime dateTime;
    private Integer partySize;
    private Boolean available;
    private List<TimeSlot> availableSlots;
    private String bookingUrl;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TimeSlot {
        private LocalDateTime startTime;
        private LocalDateTime endTime;
        private Integer availableTables;
        private String bookingToken;
    }
}