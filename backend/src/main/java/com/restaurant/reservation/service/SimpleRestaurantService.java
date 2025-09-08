package com.restaurant.reservation.service;

import com.restaurant.reservation.dto.SimpleRestaurantDTO;
import com.restaurant.reservation.model.SimpleRestaurant;
import com.restaurant.reservation.repository.SimpleRestaurantRepository;
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
public class SimpleRestaurantService {
    
    private final SimpleRestaurantRepository restaurantRepository;
    
    public SimpleRestaurant createRestaurant(SimpleRestaurantDTO dto) {
        log.info("Creating restaurant: {}", dto.getName());
        
        SimpleRestaurant restaurant = SimpleRestaurant.builder()
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
                .capacity(dto.getCapacity())
                .active(true)
                .imageUrl(dto.getImageUrl())
                .gallery(dto.getGallery())
                .priceRange(dto.getPriceRange())
                .rating(dto.getRating() != null ? dto.getRating() : 0.0)
                .build();
        
        return restaurantRepository.save(restaurant);
    }
    
    @Transactional(readOnly = true)
    public SimpleRestaurant getRestaurantById(Long id) {
        log.info("Fetching restaurant with id: {}", id);
        return restaurantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Restaurant not found with id: " + id));
    }
    
    @Transactional(readOnly = true)
    public List<SimpleRestaurant> getAllActiveRestaurants() {
        log.info("Fetching all active restaurants");
        return restaurantRepository.findByActiveTrue();
    }
    
    @Transactional(readOnly = true)
    public Page<SimpleRestaurant> getAllActiveRestaurants(Pageable pageable) {
        log.info("Fetching active restaurants with pagination");
        return restaurantRepository.findByActiveTrue(pageable);
    }
    
    @Transactional(readOnly = true)
    public Page<SimpleRestaurant> searchRestaurants(String query, Pageable pageable) {
        log.info("Searching restaurants with query: {}", query);
        return restaurantRepository.searchActiveRestaurants(query, pageable);
    }
    
    public SimpleRestaurant updateRestaurant(Long id, SimpleRestaurantDTO dto) {
        log.info("Updating restaurant with id: {}", id);
        
        SimpleRestaurant restaurant = getRestaurantById(id);
        
        restaurant.setName(dto.getName());
        restaurant.setAddress(dto.getAddress());
        restaurant.setCity(dto.getCity());
        restaurant.setState(dto.getState());
        restaurant.setZipCode(dto.getZipCode());
        restaurant.setPhoneNumber(dto.getPhoneNumber());
        restaurant.setEmail(dto.getEmail());
        restaurant.setDescription(dto.getDescription());
        restaurant.setCuisine(dto.getCuisine());
        restaurant.setOpeningTime(dto.getOpeningTime());
        restaurant.setClosingTime(dto.getClosingTime());
        restaurant.setCapacity(dto.getCapacity());
        restaurant.setImageUrl(dto.getImageUrl());
        restaurant.setGallery(dto.getGallery());
        restaurant.setPriceRange(dto.getPriceRange());
        if (dto.getRating() != null) {
            restaurant.setRating(dto.getRating());
        }
        
        return restaurantRepository.save(restaurant);
    }
    
    public void deactivateRestaurant(Long id) {
        log.info("Deactivating restaurant with id: {}", id);
        SimpleRestaurant restaurant = getRestaurantById(id);
        restaurant.setActive(false);
        restaurantRepository.save(restaurant);
    }
    
    public void activateRestaurant(Long id) {
        log.info("Activating restaurant with id: {}", id);
        SimpleRestaurant restaurant = getRestaurantById(id);
        restaurant.setActive(true);
        restaurantRepository.save(restaurant);
    }
    
    @Transactional(readOnly = true)
    public List<SimpleRestaurant> getRestaurantsByCity(String city) {
        log.info("Fetching restaurants by city: {}", city);
        return restaurantRepository.findByCityIgnoreCaseAndActiveTrue(city);
    }
    
    @Transactional(readOnly = true)
    public List<SimpleRestaurant> getRestaurantsByCuisine(String cuisine) {
        log.info("Fetching restaurants by cuisine: {}", cuisine);
        return restaurantRepository.findByCuisineIgnoreCaseAndActiveTrue(cuisine);
    }
    
    /**
     * Convert entity to DTO
     */
    public SimpleRestaurantDTO toDto(SimpleRestaurant restaurant) {
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