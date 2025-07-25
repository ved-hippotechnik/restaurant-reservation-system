package com.restaurant.reservation.repository;

import com.restaurant.reservation.model.Reservation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    Optional<Reservation> findByReservationCode(String reservationCode);
    
    Page<Reservation> findByCustomerId(Long customerId, Pageable pageable);
    
    Page<Reservation> findByRestaurantId(Long restaurantId, Pageable pageable);
    
    @Query("SELECT r FROM Reservation r WHERE r.restaurant.id = :restaurantId AND " +
           "DATE(r.reservationDateTime) = DATE(:date)")
    List<Reservation> findByRestaurantIdAndDate(@Param("restaurantId") Long restaurantId,
                                                @Param("date") LocalDateTime date);
    
    @Query("SELECT r FROM Reservation r WHERE r.table.id = :tableId AND " +
           "r.status IN ('CONFIRMED', 'SEATED') AND " +
           "r.reservationDateTime <= :endTime AND " +
           "DATE_ADD(r.reservationDateTime, INTERVAL r.durationMinutes MINUTE) >= :startTime")
    List<Reservation> findConflictingReservations(@Param("tableId") Long tableId,
                                                  @Param("startTime") LocalDateTime startTime,
                                                  @Param("endTime") LocalDateTime endTime);
    
    @Query("SELECT r FROM Reservation r WHERE r.status = 'CONFIRMED' AND " +
           "r.reservationDateTime BETWEEN :start AND :end AND " +
           "r.reminderSent = false")
    List<Reservation> findReservationsNeedingReminder(@Param("start") LocalDateTime start,
                                                      @Param("end") LocalDateTime end);
    
    @Query("SELECT COUNT(r) FROM Reservation r WHERE r.restaurant.id = :restaurantId AND " +
           "r.status IN ('CONFIRMED', 'SEATED') AND " +
           "DATE(r.reservationDateTime) = DATE(:date)")
    Long countActiveReservationsByRestaurantAndDate(@Param("restaurantId") Long restaurantId,
                                                    @Param("date") LocalDateTime date);
    
    List<Reservation> findByCustomerIdAndStatus(Long customerId, Reservation.ReservationStatus status);
    
    @Query("SELECT r FROM Reservation r WHERE r.searchEngineBookingId = :bookingId")
    Optional<Reservation> findBySearchEngineBookingId(@Param("bookingId") String bookingId);
}