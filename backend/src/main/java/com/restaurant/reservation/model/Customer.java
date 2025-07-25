package com.restaurant.reservation.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "customers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Customer extends BaseEntity {
    
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(columnDefinition = "TEXT")
    private String dietaryPreferences;
    
    @Column(columnDefinition = "TEXT")
    private String specialRequests;
    
    @Column(nullable = false)
    private Integer loyaltyPoints = 0;
    
    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL)
    private List<Reservation> reservations = new ArrayList<>();
    
    @ManyToMany
    @JoinTable(
        name = "customer_favorite_restaurants",
        joinColumns = @JoinColumn(name = "customer_id"),
        inverseJoinColumns = @JoinColumn(name = "restaurant_id")
    )
    private List<Restaurant> favoriteRestaurants = new ArrayList<>();
    
    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL)
    private List<Review> reviews = new ArrayList<>();
    
    @ElementCollection
    @CollectionTable(name = "customer_allergies", joinColumns = @JoinColumn(name = "customer_id"))
    @Column(name = "allergy")
    private List<String> allergies = new ArrayList<>();
    
    @Column
    private String preferredCommunicationMethod = "EMAIL"; // EMAIL, SMS, BOTH
    
    @Column(nullable = false)
    private Boolean marketingOptIn = false;
}