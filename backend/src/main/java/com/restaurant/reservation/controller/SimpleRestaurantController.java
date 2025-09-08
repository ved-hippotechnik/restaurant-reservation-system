package com.restaurant.reservation.controller;

import com.restaurant.reservation.dto.SimpleRestaurantDTO;
import com.restaurant.reservation.model.SimpleRestaurant;
import com.restaurant.reservation.service.SimpleRestaurantService;
import com.restaurant.reservation.validator.InputValidator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/restaurants")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003"})
public class SimpleRestaurantController {
    
    private final SimpleRestaurantService restaurantService;
    private final InputValidator inputValidator;
    
    @PostMapping
    public ResponseEntity<SimpleRestaurantDTO> createRestaurant(@Valid @RequestBody SimpleRestaurantDTO dto) {
        log.info("Creating restaurant: {}", dto.getName());
        SimpleRestaurant restaurant = restaurantService.createRestaurant(dto);
        return new ResponseEntity<>(convertToDTO(restaurant), HttpStatus.CREATED);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<SimpleRestaurantDTO> getRestaurant(@PathVariable Long id) {
        log.info("Fetching restaurant with id: {}", id);
        SimpleRestaurant restaurant = restaurantService.getRestaurantById(id);
        return ResponseEntity.ok(convertToDTO(restaurant));
    }
    
    @GetMapping
    public ResponseEntity<Page<SimpleRestaurantDTO>> getAllRestaurants(
            @PageableDefault(size = 20) Pageable pageable) {
        log.info("Fetching all restaurants with pagination");
        Page<SimpleRestaurant> restaurants = restaurantService.getAllActiveRestaurants(pageable);
        Page<SimpleRestaurantDTO> dtos = restaurants.map(this::convertToDTO);
        return ResponseEntity.ok(dtos);
    }
    
    @GetMapping("/search")
    public ResponseEntity<Page<SimpleRestaurantDTO>> searchRestaurants(
            @RequestParam String query,
            @PageableDefault(size = 20) Pageable pageable) {
        // Validate and sanitize input to prevent SQL injection
        String sanitizedQuery = inputValidator.validateSearchQuery(query);
        log.info("Searching restaurants with sanitized query: {}", sanitizedQuery);
        Page<SimpleRestaurant> restaurants = restaurantService.searchRestaurants(sanitizedQuery, pageable);
        Page<SimpleRestaurantDTO> dtos = restaurants.map(this::convertToDTO);
        return ResponseEntity.ok(dtos);
    }
    
    @GetMapping("/city/{city}")
    public ResponseEntity<List<SimpleRestaurantDTO>> getRestaurantsByCity(@PathVariable String city) {
        // Sanitize city input
        String sanitizedCity = inputValidator.sanitizeInput(city);
        log.info("Fetching restaurants by city: {}", sanitizedCity);
        List<SimpleRestaurant> restaurants = restaurantService.getRestaurantsByCity(sanitizedCity);
        List<SimpleRestaurantDTO> dtos = restaurants.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
    
    @GetMapping("/cuisine/{cuisine}")
    public ResponseEntity<List<SimpleRestaurantDTO>> getRestaurantsByCuisine(@PathVariable String cuisine) {
        // Sanitize cuisine input
        String sanitizedCuisine = inputValidator.sanitizeInput(cuisine);
        log.info("Fetching restaurants by cuisine: {}", sanitizedCuisine);
        List<SimpleRestaurant> restaurants = restaurantService.getRestaurantsByCuisine(sanitizedCuisine);
        List<SimpleRestaurantDTO> dtos = restaurants.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<SimpleRestaurantDTO> updateRestaurant(
            @PathVariable Long id,
            @Valid @RequestBody SimpleRestaurantDTO dto) {
        log.info("Updating restaurant with id: {}", id);
        SimpleRestaurant restaurant = restaurantService.updateRestaurant(id, dto);
        return ResponseEntity.ok(convertToDTO(restaurant));
    }
    
    @PutMapping("/{id}/deactivate")
    public ResponseEntity<Void> deactivateRestaurant(@PathVariable Long id) {
        log.info("Deactivating restaurant with id: {}", id);
        restaurantService.deactivateRestaurant(id);
        return ResponseEntity.noContent().build();
    }
    
    @PutMapping("/{id}/activate")
    public ResponseEntity<Void> activateRestaurant(@PathVariable Long id) {
        log.info("Activating restaurant with id: {}", id);
        restaurantService.activateRestaurant(id);
        return ResponseEntity.noContent().build();
    }
    
    private SimpleRestaurantDTO convertToDTO(SimpleRestaurant restaurant) {
        return SimpleRestaurantDTO.builder()
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
                .capacity(restaurant.getCapacity())
                .active(restaurant.getActive())
                .imageUrl(restaurant.getImageUrl())
                .gallery(restaurant.getGallery())
                .priceRange(restaurant.getPriceRange())
                .rating(restaurant.getRating())
                .build();
    }
}