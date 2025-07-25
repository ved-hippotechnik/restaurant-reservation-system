package com.restaurant.reservation.service;

import com.restaurant.reservation.dto.RestaurantDTO;
import com.restaurant.reservation.dto.RestaurantCreateDTO;
import com.restaurant.reservation.dto.RestaurantUpdateDTO;
import com.restaurant.reservation.model.Restaurant;
import com.restaurant.reservation.repository.RestaurantRepository;
import com.restaurant.reservation.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class RestaurantService {
    
    private final RestaurantRepository restaurantRepository;
    
    public Restaurant createRestaurant(RestaurantCreateDTO dto) {
        Restaurant restaurant = Restaurant.builder()
                .name(dto.getName())
                .address(dto.getAddress())
                .city(dto.getCity())
                .state(dto.getState())
                .zipCode(dto.getZipCode())
                .phoneNumber(dto.getPhoneNumber())
                .email(dto.getEmail())
                .description(dto.getDescription())
                .cuisine(dto.getCuisine())
                .openingTime(dto.getOpeningTime())
                .closingTime(dto.getClosingTime())
                .reservationDurationMinutes(dto.getReservationDurationMinutes())
                .bufferTimeMinutes(dto.getBufferTimeMinutes())
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .active(true)
                .build();
        
        if (dto.getAmenities() != null) {
            restaurant.setAmenities(dto.getAmenities());
        }
        
        return restaurantRepository.save(restaurant);
    }
    
    public Restaurant getRestaurantById(Long id) {
        return restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + id));
    }
    
    public Page<Restaurant> getAllRestaurants(Pageable pageable) {
        return restaurantRepository.findByActiveTrue(pageable);
    }
    
    public Page<Restaurant> searchRestaurants(String search, Pageable pageable) {
        return restaurantRepository.searchRestaurants(search, pageable);
    }
    
    public List<Restaurant> findNearbyRestaurants(double latitude, double longitude, double radiusKm) {
        return restaurantRepository.findRestaurantsWithinRadius(latitude, longitude, radiusKm);
    }
    
    public Restaurant updateRestaurant(Long id, RestaurantUpdateDTO dto) {
        Restaurant restaurant = getRestaurantById(id);
        
        if (dto.getName() != null) restaurant.setName(dto.getName());
        if (dto.getAddress() != null) restaurant.setAddress(dto.getAddress());
        if (dto.getCity() != null) restaurant.setCity(dto.getCity());
        if (dto.getState() != null) restaurant.setState(dto.getState());
        if (dto.getZipCode() != null) restaurant.setZipCode(dto.getZipCode());
        if (dto.getPhoneNumber() != null) restaurant.setPhoneNumber(dto.getPhoneNumber());
        if (dto.getEmail() != null) restaurant.setEmail(dto.getEmail());
        if (dto.getDescription() != null) restaurant.setDescription(dto.getDescription());
        if (dto.getCuisine() != null) restaurant.setCuisine(dto.getCuisine());
        if (dto.getOpeningTime() != null) restaurant.setOpeningTime(dto.getOpeningTime());
        if (dto.getClosingTime() != null) restaurant.setClosingTime(dto.getClosingTime());
        if (dto.getReservationDurationMinutes() != null) {
            restaurant.setReservationDurationMinutes(dto.getReservationDurationMinutes());
        }
        if (dto.getBufferTimeMinutes() != null) {
            restaurant.setBufferTimeMinutes(dto.getBufferTimeMinutes());
        }
        if (dto.getAmenities() != null) restaurant.setAmenities(dto.getAmenities());
        if (dto.getImageUrls() != null) restaurant.setImageUrls(dto.getImageUrls());
        
        return restaurantRepository.save(restaurant);
    }
    
    public void deactivateRestaurant(Long id) {
        Restaurant restaurant = getRestaurantById(id);
        restaurant.setActive(false);
        restaurantRepository.save(restaurant);
    }
    
    public void activateRestaurant(Long id) {
        Restaurant restaurant = getRestaurantById(id);
        restaurant.setActive(true);
        restaurantRepository.save(restaurant);
    }
}