package com.restaurant.reservation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchEngineRestaurantDTO {
    private Long id;
    private String name;
    private String description;
    private Address address;
    private Contact contact;
    private Hours hours;
    private List<String> cuisineTypes;
    private List<String> amenities;
    private List<String> imageUrls;
    private PriceRange priceRange;
    private Rating rating;
    private ReservationPolicy reservationPolicy;
    private Map<String, Object> additionalData; // For search engine specific data
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Address {
        private String streetAddress;
        private String city;
        private String state;
        private String postalCode;
        private String country;
        private Double latitude;
        private Double longitude;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Contact {
        private String phone;
        private String email;
        private String website;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Hours {
        private LocalTime openTime;
        private LocalTime closeTime;
        private List<String> closedDays;
        private Map<String, SpecialHours> specialHours;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SpecialHours {
        private LocalTime openTime;
        private LocalTime closeTime;
        private Boolean closed;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PriceRange {
        private Integer level; // 1-4 ($ to $$$$)
        private String description;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Rating {
        private Double average;
        private Integer count;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReservationPolicy {
        private Integer minPartySize;
        private Integer maxPartySize;
        private Integer defaultDurationMinutes;
        private Integer advanceBookingDays;
        private Boolean requiresCreditCard;
        private String cancellationPolicy;
    }
}