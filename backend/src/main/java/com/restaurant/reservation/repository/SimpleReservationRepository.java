package com.restaurant.reservation.repository;

import com.restaurant.reservation.model.SimpleReservation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SimpleReservationRepository extends JpaRepository<SimpleReservation, Long> {
    
    List<SimpleReservation> findByRestaurantId(Long restaurantId);
    
    Page<SimpleReservation> findByRestaurantId(Long restaurantId, Pageable pageable);
    
    List<SimpleReservation> findByCustomerEmailIgnoreCase(String customerEmail);
    
    @Query("SELECT r FROM SimpleReservation r WHERE r.restaurant.id = :restaurantId AND " +
           "r.reservationDateTime BETWEEN :startDateTime AND :endDateTime")
    List<SimpleReservation> findByRestaurantAndDateTimeRange(
            @Param("restaurantId") Long restaurantId,
            @Param("startDateTime") LocalDateTime startDateTime,
            @Param("endDateTime") LocalDateTime endDateTime);
    
    @Query("SELECT r FROM SimpleReservation r WHERE r.reservationDateTime BETWEEN :startDateTime AND :endDateTime")
    List<SimpleReservation> findByDateTimeRange(
            @Param("startDateTime") LocalDateTime startDateTime,
            @Param("endDateTime") LocalDateTime endDateTime);
    
    List<SimpleReservation> findByStatus(SimpleReservation.ReservationStatus status);
    
    @Query("SELECT COUNT(r) FROM SimpleReservation r WHERE r.restaurant.id = :restaurantId AND " +
           "r.reservationDateTime BETWEEN :startDateTime AND :endDateTime AND " +
           "r.status IN ('PENDING', 'CONFIRMED')")
    Long countActiveReservationsInTimeRange(
            @Param("restaurantId") Long restaurantId,
            @Param("startDateTime") LocalDateTime startDateTime,
            @Param("endDateTime") LocalDateTime endDateTime);
}