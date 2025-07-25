package com.restaurant.reservation.controller;

import com.restaurant.reservation.dto.*;
import com.restaurant.reservation.service.SearchEngineIntegrationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import lombok.Data;

@RestController
@RequestMapping("/api/v1/search-integration")
@RequiredArgsConstructor
@CrossOrigin
public class SearchEngineIntegrationController {
    
    private final SearchEngineIntegrationService searchEngineIntegrationService;
    
    /**
     * Check availability for search engines
     */
    @GetMapping("/availability")
    public ResponseEntity<SearchEngineAvailabilityDTO> checkAvailability(
            @RequestParam Long restaurantId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateTime,
            @RequestParam Integer partySize) {
        
        SearchEngineAvailabilityDTO availability = searchEngineIntegrationService.checkAvailability(
                restaurantId, dateTime, partySize);
        
        return ResponseEntity.ok(availability);
    }
    
    /**
     * Create reservation from search engine
     */
    @PostMapping("/reserve")
    public ResponseEntity<ReservationDTO> createReservation(
            @Valid @RequestBody SearchEngineReservationDTO dto) {
        
        ReservationDTO reservation = searchEngineIntegrationService.createSearchEngineReservation(dto);
        return ResponseEntity.ok(reservation);
    }
    
    /**
     * Get restaurant data for search engines
     */
    @GetMapping("/restaurant/{id}")
    public ResponseEntity<SearchEngineRestaurantDTO> getRestaurant(@PathVariable Long id) {
        SearchEngineRestaurantDTO restaurant = searchEngineIntegrationService.getRestaurantForSearchEngine(id);
        return ResponseEntity.ok(restaurant);
    }
    
    /**
     * Handle webhook notifications from search engines
     */
    @PostMapping("/webhook/{searchEngine}")
    public ResponseEntity<Map<String, String>> handleWebhook(
            @PathVariable String searchEngine,
            @RequestBody Map<String, Object> payload) {
        
        searchEngineIntegrationService.handleSearchEngineWebhook(searchEngine, payload);
        
        return ResponseEntity.ok(Map.of(
                "status", "received",
                "searchEngine", searchEngine,
                "timestamp", LocalDateTime.now().toString()
        ));
    }
    
    /**
     * Batch check availability for multiple time slots
     */
    @PostMapping("/availability/batch")
    public ResponseEntity<Map<String, SearchEngineAvailabilityDTO>> batchCheckAvailability(
            @RequestBody Map<String, AvailabilityRequest> requests) {
        
        Map<String, SearchEngineAvailabilityDTO> results = new HashMap<>();
        
        requests.forEach((key, request) -> {
            SearchEngineAvailabilityDTO availability = searchEngineIntegrationService.checkAvailability(
                    request.getRestaurantId(), 
                    request.getDateTime(), 
                    request.getPartySize()
            );
            results.put(key, availability);
        });
        
        return ResponseEntity.ok(results);
    }
    
    @Data
    public static class AvailabilityRequest {
        private Long restaurantId;
        private LocalDateTime dateTime;
        private Integer partySize;
    }
}