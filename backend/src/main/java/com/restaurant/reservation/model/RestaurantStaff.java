package com.restaurant.reservation.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "restaurant_staff")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantStaff extends BaseEntity {
    
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id", nullable = false)
    private Restaurant restaurant;
    
    @Column(nullable = false)
    private String position;
    
    @Column
    private String employeeId;
    
    @Column(nullable = false)
    private Boolean canManageReservations = true;
    
    @Column(nullable = false)
    private Boolean canManageTables = true;
    
    @Column(nullable = false)
    private Boolean canViewReports = false;
    
    @Column(nullable = false)
    private Boolean canManageStaff = false;
    
    @Column(nullable = false)
    private Boolean active = true;
}