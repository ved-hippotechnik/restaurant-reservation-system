package com.restaurant.reservation.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "restaurants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Restaurant extends BaseEntity {
    
    @Column(nullable = false, unique = true)
    private String name;
    
    @Column(nullable = false)
    private String address;
    
    @Column(nullable = false)
    private String city;
    
    @Column(nullable = false)
    private String state;
    
    @Column(nullable = false)
    private String zipCode;
    
    @Column(nullable = false)
    private String phoneNumber;
    
    @Column(unique = true)
    private String email;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false)
    private String cuisine;
    
    @Column(nullable = false)
    private LocalTime openingTime;
    
    @Column(nullable = false)
    private LocalTime closingTime;
    
    @Column(nullable = false)
    private Integer reservationDurationMinutes = 120; // Default 2 hours
    
    @Column(nullable = false)
    private Integer bufferTimeMinutes = 15; // Buffer between reservations
    
    @Column(nullable = false)
    private Boolean active = true;
    
    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Table> tables = new ArrayList<>();
    
    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL)
    private List<Reservation> reservations = new ArrayList<>();
    
    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL)
    private List<RestaurantStaff> staff = new ArrayList<>();
    
    @Column(nullable = false)
    private Double latitude;
    
    @Column(nullable = false)
    private Double longitude;
    
    @ElementCollection
    @CollectionTable(name = "restaurant_amenities", joinColumns = @JoinColumn(name = "restaurant_id"))
    @Column(name = "amenity")
    private List<String> amenities = new ArrayList<>();
    
    @ElementCollection
    @CollectionTable(name = "restaurant_images", joinColumns = @JoinColumn(name = "restaurant_id"))
    @Column(name = "image_url")
    private List<String> imageUrls = new ArrayList<>();
}