package com.restaurant.reservation.service;

import com.restaurant.reservation.dto.ReservationCreateDTO;
import com.restaurant.reservation.dto.ReservationDTO;
import com.restaurant.reservation.dto.ReservationUpdateDTO;
import com.restaurant.reservation.exception.ResourceNotFoundException;
import com.restaurant.reservation.exception.ReservationConflictException;
import com.restaurant.reservation.model.*;
import com.restaurant.reservation.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ReservationService {
    
    private final ReservationRepository reservationRepository;
    private final RestaurantRepository restaurantRepository;
    private final TableRepository tableRepository;
    private final CustomerRepository customerRepository;
    private final TableService tableService;
    private final WebSocketNotificationService notificationService;
    
    public Reservation createReservation(ReservationCreateDTO dto) {
        Restaurant restaurant = restaurantRepository.findById(dto.getRestaurantId())
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));
        
        Customer customer = customerRepository.findById(dto.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
        
        // Validate reservation time is within restaurant hours
        validateReservationTime(restaurant, dto.getReservationDateTime());
        
        // Find available table
        LocalDateTime endTime = dto.getReservationDateTime()
                .plusMinutes(dto.getDurationMinutes() != null ? dto.getDurationMinutes() : restaurant.getReservationDurationMinutes());
        
        List<Table> availableTables = tableService.findAvailableTablesForTimeSlot(
                restaurant.getId(), dto.getReservationDateTime(), endTime, dto.getPartySize());
        
        if (availableTables.isEmpty()) {
            throw new ReservationConflictException("No tables available for the requested time and party size");
        }
        
        Table selectedTable = availableTables.get(0); // Select the first available table
        
        // Check for conflicts
        List<Reservation> conflicts = reservationRepository.findConflictingReservations(
                selectedTable.getId(), dto.getReservationDateTime(), endTime);
        
        if (!conflicts.isEmpty()) {
            throw new ReservationConflictException("Table is already reserved for this time slot");
        }
        
        Reservation reservation = Reservation.builder()
                .reservationCode(generateReservationCode())
                .customer(customer)
                .restaurant(restaurant)
                .table(selectedTable)
                .reservationDateTime(dto.getReservationDateTime())
                .partySize(dto.getPartySize())
                .status(Reservation.ReservationStatus.CONFIRMED)
                .specialRequests(dto.getSpecialRequests())
                .customerName(dto.getCustomerName() != null ? dto.getCustomerName() : 
                    customer.getUser().getFirstName() + " " + customer.getUser().getLastName())
                .customerPhone(dto.getCustomerPhone() != null ? dto.getCustomerPhone() : 
                    customer.getUser().getPhoneNumber())
                .customerEmail(dto.getCustomerEmail() != null ? dto.getCustomerEmail() : 
                    customer.getUser().getEmail())
                .occasionType(dto.getOccasionType())
                .durationMinutes(dto.getDurationMinutes() != null ? dto.getDurationMinutes() : 
                    restaurant.getReservationDurationMinutes())
                .source(dto.getSource() != null ? dto.getSource() : "WEBSITE")
                .searchEngineBookingId(dto.getSearchEngineBookingId())
                .build();
        
        return reservationRepository.save(reservation);
    }
    
    public Reservation getReservationById(Long id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found"));
    }
    
    public Reservation getReservationByCode(String code) {
        return reservationRepository.findByReservationCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found"));
    }
    
    public Page<Reservation> getCustomerReservations(Long customerId, Pageable pageable) {
        return reservationRepository.findByCustomerId(customerId, pageable);
    }
    
    public Page<Reservation> getRestaurantReservations(Long restaurantId, Pageable pageable) {
        return reservationRepository.findByRestaurantId(restaurantId, pageable);
    }
    
    public List<Reservation> getRestaurantReservationsByDate(Long restaurantId, LocalDateTime date) {
        return reservationRepository.findByRestaurantIdAndDate(restaurantId, date);
    }
    
    public Reservation updateReservation(Long id, ReservationUpdateDTO dto) {
        Reservation reservation = getReservationById(id);
        
        if (reservation.getStatus() == Reservation.ReservationStatus.CANCELLED ||
            reservation.getStatus() == Reservation.ReservationStatus.COMPLETED) {
            throw new IllegalStateException("Cannot update cancelled or completed reservations");
        }
        
        if (dto.getReservationDateTime() != null || dto.getPartySize() != null) {
            // Need to find new table if time or party size changes
            LocalDateTime newDateTime = dto.getReservationDateTime() != null ? 
                dto.getReservationDateTime() : reservation.getReservationDateTime();
            Integer newPartySize = dto.getPartySize() != null ? 
                dto.getPartySize() : reservation.getPartySize();
            LocalDateTime endTime = newDateTime.plusMinutes(reservation.getDurationMinutes());
            
            List<Table> availableTables = tableService.findAvailableTablesForTimeSlot(
                    reservation.getRestaurant().getId(), newDateTime, endTime, newPartySize);
            
            if (availableTables.isEmpty()) {
                throw new ReservationConflictException("No tables available for the updated time and party size");
            }
            
            reservation.setTable(availableTables.get(0));
            reservation.setReservationDateTime(newDateTime);
            reservation.setPartySize(newPartySize);
        }
        
        if (dto.getSpecialRequests() != null) reservation.setSpecialRequests(dto.getSpecialRequests());
        if (dto.getOccasionType() != null) reservation.setOccasionType(dto.getOccasionType());
        
        return reservationRepository.save(reservation);
    }
    
    public Reservation updateReservationStatus(Long id, Reservation.ReservationStatus status) {
        Reservation reservation = getReservationById(id);
        reservation.setStatus(status);
        
        switch (status) {
            case SEATED:
                reservation.setSeatedTime(LocalDateTime.now());
                reservation.getTable().setStatus(Table.TableStatus.OCCUPIED);
                tableRepository.save(reservation.getTable());
                break;
            case COMPLETED:
                reservation.setCompletedTime(LocalDateTime.now());
                reservation.getTable().setStatus(Table.TableStatus.CLEANING);
                tableRepository.save(reservation.getTable());
                break;
            case CANCELLED:
                reservation.setCancellationTime(LocalDateTime.now());
                break;
        }
        
        return reservationRepository.save(reservation);
    }
    
    public Reservation cancelReservation(Long id, String reason) {
        Reservation reservation = getReservationById(id);
        
        if (reservation.getStatus() == Reservation.ReservationStatus.CANCELLED) {
            throw new IllegalStateException("Reservation is already cancelled");
        }
        
        reservation.setStatus(Reservation.ReservationStatus.CANCELLED);
        reservation.setCancellationReason(reason);
        reservation.setCancellationTime(LocalDateTime.now());
        
        return reservationRepository.save(reservation);
    }
    
    public List<Reservation> findReservationsNeedingReminder() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime reminderWindow = now.plusHours(24); // Send reminders 24 hours before
        return reservationRepository.findReservationsNeedingReminder(now, reminderWindow);
    }
    
    public void markReminderSent(Long id) {
        Reservation reservation = getReservationById(id);
        reservation.setReminderSent(true);
        reservationRepository.save(reservation);
    }
    
    public Optional<Reservation> getReservationBySearchEngineBookingId(String bookingId) {
        return reservationRepository.findBySearchEngineBookingId(bookingId);
    }
    
    private void validateReservationTime(Restaurant restaurant, LocalDateTime dateTime) {
        if (dateTime.toLocalTime().isBefore(restaurant.getOpeningTime()) ||
            dateTime.toLocalTime().isAfter(restaurant.getClosingTime())) {
            throw new IllegalArgumentException("Reservation time is outside restaurant operating hours");
        }
        
        if (dateTime.isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Cannot make reservations in the past");
        }
    }
    
    private String generateReservationCode() {
        return UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}