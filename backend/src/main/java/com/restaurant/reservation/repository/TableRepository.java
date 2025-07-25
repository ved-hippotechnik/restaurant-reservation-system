package com.restaurant.reservation.repository;

import com.restaurant.reservation.model.Table;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TableRepository extends JpaRepository<Table, Long> {
    List<Table> findByRestaurantIdAndActiveTrue(Long restaurantId);
    
    List<Table> findByRestaurantIdAndStatus(Long restaurantId, Table.TableStatus status);
    
    Optional<Table> findByRestaurantIdAndTableNumber(Long restaurantId, String tableNumber);
    
    @Query("SELECT t FROM Table t WHERE t.restaurant.id = :restaurantId AND " +
           "t.capacity >= :minCapacity AND t.capacity <= :maxCapacity AND " +
           "t.active = true")
    List<Table> findAvailableTablesByCapacity(@Param("restaurantId") Long restaurantId,
                                             @Param("minCapacity") Integer minCapacity,
                                             @Param("maxCapacity") Integer maxCapacity);
    
    @Query("SELECT t FROM Table t WHERE t.restaurant.id = :restaurantId AND " +
           "t.active = true AND t.id NOT IN " +
           "(SELECT r.table.id FROM Reservation r WHERE " +
           "r.restaurant.id = :restaurantId AND " +
           "r.status IN ('CONFIRMED', 'SEATED') AND " +
           "r.reservationDateTime <= :endTime AND " +
           "DATE_ADD(r.reservationDateTime, INTERVAL r.durationMinutes MINUTE) >= :startTime)")
    List<Table> findAvailableTablesForTimeSlot(@Param("restaurantId") Long restaurantId,
                                               @Param("startTime") LocalDateTime startTime,
                                               @Param("endTime") LocalDateTime endTime);
}