package com.restaurant.reservation.service;

import com.restaurant.reservation.dto.*;
import com.restaurant.reservation.exception.ResourceNotFoundException;
import com.restaurant.reservation.exception.ReservationConflictException;
import com.restaurant.reservation.model.*;
import com.restaurant.reservation.repository.CustomerRepository;
import com.restaurant.reservation.repository.RestaurantRepository;
import com.restaurant.reservation.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class SearchEngineIntegrationService {
    
    private final RestaurantService restaurantService;
    private final ReservationService reservationService;
    private final TableService tableService;
    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final RestaurantRepository restaurantRepository;
    private final PasswordEncoder passwordEncoder;
    
    /**
     * Get restaurant availability for search engines
     */
    public SearchEngineAvailabilityDTO checkAvailability(
            Long restaurantId, 
            LocalDateTime dateTime, 
            Integer partySize) {
        
        Restaurant restaurant = restaurantService.getRestaurantById(restaurantId);
        LocalDateTime endTime = dateTime.plusMinutes(restaurant.getReservationDurationMinutes());
        
        List<Table> availableTables = tableService.findAvailableTablesForTimeSlot(
                restaurantId, dateTime, endTime, partySize);
        
        // Generate available time slots around the requested time
        List<SearchEngineAvailabilityDTO.TimeSlot> timeSlots = generateTimeSlots(
                restaurant, dateTime, partySize);
        
        return SearchEngineAvailabilityDTO.builder()
                .restaurantId(restaurantId)
                .restaurantName(restaurant.getName())
                .dateTime(dateTime)
                .partySize(partySize)
                .available(!availableTables.isEmpty())
                .availableSlots(timeSlots)
                .bookingUrl(generateBookingUrl(restaurantId))
                .build();
    }
    
    /**
     * Create reservation from search engine
     */
    public ReservationDTO createSearchEngineReservation(SearchEngineReservationDTO dto) {
        // Find or create customer
        Customer customer = findOrCreateCustomer(dto);
        
        // Create reservation
        ReservationCreateDTO reservationDto = ReservationCreateDTO.builder()
                .restaurantId(dto.getRestaurantId())
                .customerId(customer.getId())
                .reservationDateTime(dto.getDateTime())
                .partySize(dto.getPartySize())
                .specialRequests(dto.getSpecialRequests())
                .occasionType(dto.getOccasionType())
                .customerName(dto.getCustomerName())
                .customerPhone(dto.getCustomerPhone())
                .customerEmail(dto.getCustomerEmail())
                .source(dto.getSearchEngine())
                .searchEngineBookingId(dto.getSearchEngineBookingId())
                .build();
        
        Reservation reservation = reservationService.createReservation(reservationDto);
        
        // Log search engine booking
        log.info("Search engine reservation created: {} from {} with booking ID: {}", 
                reservation.getReservationCode(), dto.getSearchEngine(), dto.getSearchEngineBookingId());
        
        return convertToDTO(reservation);
    }
    
    /**
     * Get restaurant data formatted for search engines
     */
    public SearchEngineRestaurantDTO getRestaurantForSearchEngine(Long restaurantId) {
        Restaurant restaurant = restaurantService.getRestaurantById(restaurantId);
        
        return SearchEngineRestaurantDTO.builder()
                .id(restaurant.getId())
                .name(restaurant.getName())
                .description(restaurant.getDescription())
                .address(SearchEngineRestaurantDTO.Address.builder()
                        .streetAddress(restaurant.getAddress())
                        .city(restaurant.getCity())
                        .state(restaurant.getState())
                        .postalCode(restaurant.getZipCode())
                        .country("USA")
                        .latitude(restaurant.getLatitude())
                        .longitude(restaurant.getLongitude())
                        .build())
                .contact(SearchEngineRestaurantDTO.Contact.builder()
                        .phone(restaurant.getPhoneNumber())
                        .email(restaurant.getEmail())
                        .build())
                .hours(SearchEngineRestaurantDTO.Hours.builder()
                        .openTime(restaurant.getOpeningTime())
                        .closeTime(restaurant.getClosingTime())
                        .build())
                .cuisineTypes(Collections.singletonList(restaurant.getCuisine()))
                .amenities(restaurant.getAmenities())
                .imageUrls(restaurant.getImageUrls())
                .rating(SearchEngineRestaurantDTO.Rating.builder()
                        .average(restaurant.getAverageRating())
                        .count(restaurant.getTotalReviews())
                        .build())
                .reservationPolicy(SearchEngineRestaurantDTO.ReservationPolicy.builder()
                        .minPartySize(1)
                        .maxPartySize(20)
                        .defaultDurationMinutes(restaurant.getReservationDurationMinutes())
                        .advanceBookingDays(90)
                        .requiresCreditCard(false)
                        .cancellationPolicy("Free cancellation up to 2 hours before reservation")
                        .build())
                .build();
    }
    
    /**
     * Handle webhook notifications from search engines
     */
    public void handleSearchEngineWebhook(String searchEngine, Map<String, Object> payload) {
        String bookingId = (String) payload.get("bookingId");
        String action = (String) payload.get("action");
        
        log.info("Received webhook from {} for booking {}: {}", searchEngine, bookingId, action);
        
        switch (action) {
            case "CANCELLED":
                handleSearchEngineCancellation(bookingId, searchEngine);
                break;
            case "MODIFIED":
                handleSearchEngineModification(bookingId, payload);
                break;
            default:
                log.warn("Unknown webhook action: {} from {}", action, searchEngine);
        }
    }
    
    private Customer findOrCreateCustomer(SearchEngineReservationDTO dto) {
        // Check if user exists
        Optional<User> existingUser = userRepository.findByEmail(dto.getCustomerEmail());
        
        if (existingUser.isPresent()) {
            return customerRepository.findByUserId(existingUser.get().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Customer profile not found"));
        }
        
        // Create new user and customer
        User newUser = User.builder()
                .email(dto.getCustomerEmail())
                .password(passwordEncoder.encode(UUID.randomUUID().toString())) // Random password
                .firstName(dto.getCustomerName().split(" ")[0])
                .lastName(dto.getCustomerName().substring(dto.getCustomerName().indexOf(" ") + 1))
                .phoneNumber(dto.getCustomerPhone())
                .role(User.UserRole.CUSTOMER)
                .enabled(true)
                .emailVerified(false)
                .build();
        
        User savedUser = userRepository.save(newUser);
        
        Customer customer = Customer.builder()
                .user(savedUser)
                .preferredCommunicationMethod("EMAIL")
                .marketingOptIn(false)
                .build();
        
        return customerRepository.save(customer);
    }
    
    private List<SearchEngineAvailabilityDTO.TimeSlot> generateTimeSlots(
            Restaurant restaurant, 
            LocalDateTime requestedTime, 
            Integer partySize) {
        
        List<SearchEngineAvailabilityDTO.TimeSlot> slots = new ArrayList<>();
        
        // Generate slots from 1 hour before to 1 hour after requested time
        LocalDateTime startTime = requestedTime.minusHours(1);
        LocalDateTime endTime = requestedTime.plusHours(1);
        
        LocalDateTime currentSlot = startTime;
        while (currentSlot.isBefore(endTime) || currentSlot.equals(endTime)) {
            LocalDateTime slotEnd = currentSlot.plusMinutes(restaurant.getReservationDurationMinutes());
            
            List<Table> availableTables = tableService.findAvailableTablesForTimeSlot(
                    restaurant.getId(), currentSlot, slotEnd, partySize);
            
            if (!availableTables.isEmpty()) {
                slots.add(SearchEngineAvailabilityDTO.TimeSlot.builder()
                        .startTime(currentSlot)
                        .endTime(slotEnd)
                        .availableTables(availableTables.size())
                        .bookingToken(generateBookingToken(restaurant.getId(), currentSlot))
                        .build());
            }
            
            currentSlot = currentSlot.plusMinutes(15); // 15-minute intervals
        }
        
        return slots;
    }
    
    private String generateBookingUrl(Long restaurantId) {
        return String.format("https://restaurant-reservation.com/book?restaurant=%d", restaurantId);
    }
    
    private String generateBookingToken(Long restaurantId, LocalDateTime dateTime) {
        return Base64.getEncoder().encodeToString(
                String.format("%d:%s", restaurantId, dateTime).getBytes()
        );
    }
    
    private void handleSearchEngineCancellation(String bookingId, String searchEngine) {
        reservationService.getReservationBySearchEngineBookingId(bookingId)
                .ifPresent(reservation -> {
                    if (reservation.getStatus() != Reservation.ReservationStatus.CANCELLED) {
                        reservationService.cancelReservation(
                                reservation.getId(), 
                                "Cancelled via " + searchEngine
                        );
                    }
                });
    }
    
    private void handleSearchEngineModification(String bookingId, Map<String, Object> payload) {
        // Implementation for handling modifications
        log.info("Modification webhook received for booking: {}", bookingId);
    }
    
    private ReservationDTO convertToDTO(Reservation reservation) {
        return ReservationDTO.builder()
                .id(reservation.getId())
                .reservationCode(reservation.getReservationCode())
                .customerId(reservation.getCustomer().getId())
                .customerName(reservation.getCustomerName())
                .customerPhone(reservation.getCustomerPhone())
                .customerEmail(reservation.getCustomerEmail())
                .restaurantId(reservation.getRestaurant().getId())
                .restaurantName(reservation.getRestaurant().getName())
                .tableId(reservation.getTable() != null ? reservation.getTable().getId() : null)
                .tableNumber(reservation.getTable() != null ? reservation.getTable().getTableNumber() : null)
                .reservationDateTime(reservation.getReservationDateTime())
                .partySize(reservation.getPartySize())
                .status(reservation.getStatus())
                .specialRequests(reservation.getSpecialRequests())
                .occasionType(reservation.getOccasionType())
                .durationMinutes(reservation.getDurationMinutes())
                .source(reservation.getSource())
                .createdAt(reservation.getCreatedAt())
                .build();
    }
}