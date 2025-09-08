package com.restaurant.reservation.service;

import com.restaurant.reservation.dto.SimpleReservationDTO;
import com.restaurant.reservation.model.SimpleReservation;
import com.restaurant.reservation.model.SimpleRestaurant;
import com.restaurant.reservation.repository.SimpleReservationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class SimpleReservationService {
    
    private final SimpleReservationRepository reservationRepository;
    private final SimpleRestaurantService restaurantService;
    
    public SimpleReservation createReservation(SimpleReservationDTO dto) {
        log.info("Creating reservation for customer: {} at restaurant: {}", 
                dto.getCustomerName(), dto.getRestaurantId());
        
        SimpleRestaurant restaurant = restaurantService.getRestaurantById(dto.getRestaurantId());
        
        // Basic validation
        if (dto.getReservationDateTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Cannot make reservation in the past");
        }
        
        // Check capacity (simplified - just count active reservations in the same hour)
        LocalDateTime startHour = dto.getReservationDateTime().withMinute(0).withSecond(0);
        LocalDateTime endHour = startHour.plusHours(1);
        
        Long activeReservations = reservationRepository.countActiveReservationsInTimeRange(
                dto.getRestaurantId(), startHour, endHour);
        
        if (activeReservations >= restaurant.getCapacity()) {
            throw new RuntimeException("Restaurant is fully booked for the requested time");
        }
        
        SimpleReservation reservation = SimpleReservation.builder()
                .customerName(dto.getCustomerName())
                .customerEmail(dto.getCustomerEmail())
                .customerPhone(dto.getCustomerPhone())
                .reservationDateTime(dto.getReservationDateTime())
                .partySize(dto.getPartySize())
                .specialRequests(dto.getSpecialRequests())
                .status(SimpleReservation.ReservationStatus.PENDING)
                .restaurant(restaurant)
                .build();
        
        return reservationRepository.save(reservation);
    }
    
    @Transactional(readOnly = true)
    public SimpleReservation getReservationById(Long id) {
        log.info("Fetching reservation with id: {}", id);
        return reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found with id: " + id));
    }
    
    @Transactional(readOnly = true)
    public List<SimpleReservation> getReservationsByRestaurant(Long restaurantId) {
        log.info("Fetching reservations for restaurant: {}", restaurantId);
        return reservationRepository.findByRestaurantId(restaurantId);
    }
    
    @Transactional(readOnly = true)
    public Page<SimpleReservation> getReservationsByRestaurant(Long restaurantId, Pageable pageable) {
        log.info("Fetching reservations for restaurant: {} with pagination", restaurantId);
        return reservationRepository.findByRestaurantId(restaurantId, pageable);
    }
    
    @Transactional(readOnly = true)
    public List<SimpleReservation> getReservationsByCustomerEmail(String email) {
        log.info("Fetching reservations for customer email: {}", email);
        return reservationRepository.findByCustomerEmailIgnoreCase(email);
    }
    
    public SimpleReservation updateReservationStatus(Long id, SimpleReservation.ReservationStatus status) {
        log.info("Updating reservation {} status to: {}", id, status);
        
        SimpleReservation reservation = getReservationById(id);
        reservation.setStatus(status);
        
        return reservationRepository.save(reservation);
    }
    
    public SimpleReservation updateReservation(Long id, SimpleReservationDTO dto) {
        log.info("Updating reservation with id: {}", id);
        
        SimpleReservation reservation = getReservationById(id);
        
        // Basic validation
        if (dto.getReservationDateTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Cannot update reservation to a time in the past");
        }
        
        reservation.setCustomerName(dto.getCustomerName());
        reservation.setCustomerEmail(dto.getCustomerEmail());
        reservation.setCustomerPhone(dto.getCustomerPhone());
        reservation.setReservationDateTime(dto.getReservationDateTime());
        reservation.setPartySize(dto.getPartySize());
        reservation.setSpecialRequests(dto.getSpecialRequests());
        
        return reservationRepository.save(reservation);
    }
    
    public void cancelReservation(Long id) {
        log.info("Cancelling reservation with id: {}", id);
        updateReservationStatus(id, SimpleReservation.ReservationStatus.CANCELLED);
    }
    
    public void confirmReservation(Long id) {
        log.info("Confirming reservation with id: {}", id);
        updateReservationStatus(id, SimpleReservation.ReservationStatus.CONFIRMED);
    }
    
    @Transactional(readOnly = true)
    public List<SimpleReservation> getReservationsByDateRange(LocalDateTime start, LocalDateTime end) {
        log.info("Fetching reservations between {} and {}", start, end);
        return reservationRepository.findByDateTimeRange(start, end);
    }
}