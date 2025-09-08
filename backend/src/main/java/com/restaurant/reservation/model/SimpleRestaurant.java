package com.restaurant.reservation.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@jakarta.persistence.Table(name = "restaurants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SimpleRestaurant extends BaseEntity {
    
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
    @Builder.Default
    private Integer capacity = 50;
    
    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;
    
    private String imageUrl;
    
    @ElementCollection
    @CollectionTable(name = "restaurant_gallery", joinColumns = @JoinColumn(name = "restaurant_id"))
    @Column(name = "image_url")
    @Builder.Default
    private List<String> gallery = new ArrayList<>();
    
    @Column(nullable = false)
    @Builder.Default
    private String priceRange = "$";
    
    @Column
    @Builder.Default
    private Double rating = 0.0;
    
    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<SimpleReservation> reservations = new ArrayList<>();
}