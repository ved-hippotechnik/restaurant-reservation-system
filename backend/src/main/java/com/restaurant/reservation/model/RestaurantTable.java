package com.restaurant.reservation.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@jakarta.persistence.Table(name = "restaurant_tables")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Table extends BaseEntity {
    
    @Column(nullable = false)
    private String tableNumber;
    
    @Column(nullable = false)
    private Integer capacity;
    
    @Column(nullable = false)
    private Integer minCapacity;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id", nullable = false)
    private Restaurant restaurant;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TableStatus status = TableStatus.AVAILABLE;
    
    @Column(nullable = false)
    private String section;
    
    @Column
    private Integer xPosition; // For floor plan visualization
    
    @Column
    private Integer yPosition; // For floor plan visualization
    
    @Enumerated(EnumType.STRING)
    private TableShape shape = TableShape.SQUARE;
    
    @Column(nullable = false)
    private Boolean active = true;
    
    @OneToMany(mappedBy = "table", cascade = CascadeType.ALL)
    private List<Reservation> reservations = new ArrayList<>();
    
    @ElementCollection
    @CollectionTable(name = "table_features", joinColumns = @JoinColumn(name = "table_id"))
    @Column(name = "feature")
    private List<String> features = new ArrayList<>(); // e.g., "window", "outdoor", "private"
    
    public enum TableStatus {
        AVAILABLE,
        OCCUPIED,
        RESERVED,
        CLEANING,
        UNAVAILABLE
    }
    
    public enum TableShape {
        SQUARE,
        ROUND,
        RECTANGULAR
    }
}