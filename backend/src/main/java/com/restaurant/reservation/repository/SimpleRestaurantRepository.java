package com.restaurant.reservation.repository;

import com.restaurant.reservation.model.SimpleRestaurant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SimpleRestaurantRepository extends JpaRepository<SimpleRestaurant, Long> {
    
    Optional<SimpleRestaurant> findByNameIgnoreCase(String name);
    
    List<SimpleRestaurant> findByActiveTrue();
    
    Page<SimpleRestaurant> findByActiveTrue(Pageable pageable);
    
    @Query("SELECT r FROM SimpleRestaurant r WHERE r.active = true AND " +
           "(LOWER(r.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(r.cuisine) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(r.city) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<SimpleRestaurant> searchActiveRestaurants(@Param("query") String query, Pageable pageable);
    
    List<SimpleRestaurant> findByCityIgnoreCaseAndActiveTrue(String city);
    
    List<SimpleRestaurant> findByCuisineIgnoreCaseAndActiveTrue(String cuisine);
}