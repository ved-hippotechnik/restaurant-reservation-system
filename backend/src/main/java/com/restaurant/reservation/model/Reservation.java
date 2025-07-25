package com.restaurant.reservation.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "reservations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reservation extends BaseEntity {
    
    @Column(nullable = false, unique = true)
    private String reservationCode;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id", nullable = false)
    private Restaurant restaurant;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "table_id")
    private Table table;
    
    @Column(nullable = false)
    private LocalDateTime reservationDateTime;
    
    @Column(nullable = false)
    private Integer partySize;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReservationStatus status = ReservationStatus.PENDING;
    
    @Column(columnDefinition = "TEXT")
    private String specialRequests;
    
    @Column
    private LocalDateTime arrivalTime;
    
    @Column
    private LocalDateTime seatedTime;
    
    @Column
    private LocalDateTime completedTime;
    
    @Column
    private String cancellationReason;
    
    @Column
    private LocalDateTime cancellationTime;
    
    @Column(nullable = false)
    private String customerName;
    
    @Column(nullable = false)
    private String customerPhone;
    
    @Column(nullable = false)
    private String customerEmail;
    
    @Column
    private String occasionType; // birthday, anniversary, business, etc.
    
    @Column(nullable = false)
    private Integer durationMinutes;
    
    @Column(nullable = false)
    private Boolean reminderSent = false;
    
    @Column(nullable = false)
    private Boolean confirmationSent = false;
    
    @ElementCollection
    @CollectionTable(name = "reservation_tags", joinColumns = @JoinColumn(name = "reservation_id"))
    @Column(name = "tag")
    private List<String> tags = new ArrayList<>(); // VIP, first-time, regular, etc.
    
    @Column
    private String source = "WEBSITE"; // WEBSITE, GOOGLE, SEARCH_ENGINE, PHONE, WALK_IN
    
    @Column
    private String searchEngineBookingId; // For tracking search engine bookings
    
    public enum ReservationStatus {
        PENDING,
        CONFIRMED,
        SEATED,
        COMPLETED,
        CANCELLED,
        NO_SHOW,
        WAITLISTED
    }
}