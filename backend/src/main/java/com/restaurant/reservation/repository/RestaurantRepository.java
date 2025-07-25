package com.restaurant.reservation.repository;

import com.restaurant.reservation.model.Restaurant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    Optional<Restaurant> findByName(String name);
    
    Page<Restaurant> findByActiveTrue(Pageable pageable);
    
    @Query("SELECT r FROM Restaurant r WHERE r.active = true AND " +
           "(LOWER(r.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(r.cuisine) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(r.city) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Restaurant> searchRestaurants(@Param("search") String search, Pageable pageable);
    
    @Query("SELECT r FROM Restaurant r WHERE r.active = true AND " +
           "r.city = :city AND r.cuisine = :cuisine")
    List<Restaurant> findByCityAndCuisine(@Param("city") String city, @Param("cuisine") String cuisine);
    
    @Query("SELECT r FROM Restaurant r WHERE " +
           "(6371 * acos(cos(radians(:lat)) * cos(radians(r.latitude)) * " +
           "cos(radians(r.longitude) - radians(:lng)) + sin(radians(:lat)) * " +
           "sin(radians(r.latitude)))) < :radius AND r.active = true")
    List<Restaurant> findRestaurantsWithinRadius(@Param("lat") double latitude, 
                                                 @Param("lng") double longitude, 
                                                 @Param("radius") double radius);
}