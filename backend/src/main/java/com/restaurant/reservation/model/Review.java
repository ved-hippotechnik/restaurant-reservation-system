package com.restaurant.reservation.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review extends BaseEntity {
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id", nullable = false)
    private Restaurant restaurant;
    
    @OneToOne
    @JoinColumn(name = "reservation_id")
    private Reservation reservation;
    
    @Column(nullable = false)
    private Integer rating; // 1-5 stars
    
    @Column(columnDefinition = "TEXT")
    private String comment;
    
    @Column(nullable = false)
    private Integer foodRating;
    
    @Column(nullable = false)
    private Integer serviceRating;
    
    @Column(nullable = false)
    private Integer ambianceRating;
    
    @Column(nullable = false)
    private Integer valueRating;
    
    @Column(nullable = false)
    private Boolean verified = false; // Verified if linked to completed reservation
    
    @Column
    private String restaurantResponse;
    
    @Column(nullable = false)
    private Boolean published = true;
}