package com.restaurant.reservation.controller;

import com.restaurant.reservation.dto.RestaurantCreateDTO;
import com.restaurant.reservation.dto.RestaurantDTO;
import com.restaurant.reservation.dto.RestaurantUpdateDTO;
import com.restaurant.reservation.model.Restaurant;
import com.restaurant.reservation.service.RestaurantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/restaurants")
@RequiredArgsConstructor
@CrossOrigin
public class RestaurantController {
    
    private final RestaurantService restaurantService;
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RestaurantDTO> createRestaurant(@Valid @RequestBody RestaurantCreateDTO dto) {
        Restaurant restaurant = restaurantService.createRestaurant(dto);
        return new ResponseEntity<>(convertToDTO(restaurant), HttpStatus.CREATED);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<RestaurantDTO> getRestaurant(@PathVariable Long id) {
        Restaurant restaurant = restaurantService.getRestaurantById(id);
        return ResponseEntity.ok(convertToDTO(restaurant));
    }
    
    @GetMapping
    public ResponseEntity<Page<RestaurantDTO>> getAllRestaurants(
            @PageableDefault(size = 20) Pageable pageable) {
        Page<Restaurant> restaurants = restaurantService.getAllRestaurants(pageable);
        Page<RestaurantDTO> dtos = restaurants.map(this::convertToDTO);
        return ResponseEntity.ok(dtos);
    }
    
    @GetMapping("/search")
    public ResponseEntity<Page<RestaurantDTO>> searchRestaurants(
            @RequestParam String query,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<Restaurant> restaurants = restaurantService.searchRestaurants(query, pageable);
        Page<RestaurantDTO> dtos = restaurants.map(this::convertToDTO);
        return ResponseEntity.ok(dtos);
    }
    
    @GetMapping("/nearby")
    public ResponseEntity<List<RestaurantDTO>> getNearbyRestaurants(
            @RequestParam double latitude,
            @RequestParam double longitude,
            @RequestParam(defaultValue = "10") double radius) {
        List<Restaurant> restaurants = restaurantService.findNearbyRestaurants(latitude, longitude, radius);
        List<RestaurantDTO> dtos = restaurants.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('RESTAURANT_MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<RestaurantDTO> updateRestaurant(
            @PathVariable Long id,
            @Valid @RequestBody RestaurantUpdateDTO dto) {
        Restaurant restaurant = restaurantService.updateRestaurant(id, dto);
        return ResponseEntity.ok(convertToDTO(restaurant));
    }
    
    @PutMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deactivateRestaurant(@PathVariable Long id) {
        restaurantService.deactivateRestaurant(id);
        return ResponseEntity.noContent().build();
    }
    
    @PutMapping("/{id}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> activateRestaurant(@PathVariable Long id) {
        restaurantService.activateRestaurant(id);
        return ResponseEntity.noContent().build();
    }
    
    private RestaurantDTO convertToDTO(Restaurant restaurant) {
        return RestaurantDTO.builder()
                .id(restaurant.getId())
                .name(restaurant.getName())
                .address(restaurant.getAddress())
                .city(restaurant.getCity())
                .state(restaurant.getState())
                .zipCode(restaurant.getZipCode())
                .phoneNumber(restaurant.getPhoneNumber())
                .email(restaurant.getEmail())
                .description(restaurant.getDescription())
                .cuisine(restaurant.getCuisine())
                .openingTime(restaurant.getOpeningTime())
                .closingTime(restaurant.getClosingTime())
                .reservationDurationMinutes(restaurant.getReservationDurationMinutes())
                .bufferTimeMinutes(restaurant.getBufferTimeMinutes())
                .active(restaurant.getActive())
                .latitude(restaurant.getLatitude())
                .longitude(restaurant.getLongitude())
                .amenities(restaurant.getAmenities())
                .imageUrls(restaurant.getImageUrls())
                .totalTables(restaurant.getTables() != null ? restaurant.getTables().size() : 0)
                .build();
    }
}