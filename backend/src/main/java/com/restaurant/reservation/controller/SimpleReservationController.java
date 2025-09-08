package com.restaurant.reservation.controller;

import com.restaurant.reservation.dto.SimpleReservationDTO;
import com.restaurant.reservation.model.SimpleReservation;
import com.restaurant.reservation.service.SimpleReservationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*") // Allow all origins for now
public class SimpleReservationController {
    
    private final SimpleReservationService reservationService;
    
    @PostMapping
    public ResponseEntity<SimpleReservationDTO> createReservation(@Valid @RequestBody SimpleReservationDTO dto) {
        log.info("Creating reservation for customer: {}", dto.getCustomerName());
        SimpleReservation reservation = reservationService.createReservation(dto);
        return new ResponseEntity<>(convertToDTO(reservation), HttpStatus.CREATED);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<SimpleReservationDTO> getReservation(@PathVariable Long id) {
        log.info("Fetching reservation with id: {}", id);
        SimpleReservation reservation = reservationService.getReservationById(id);
        return ResponseEntity.ok(convertToDTO(reservation));
    }
    
    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<Page<SimpleReservationDTO>> getReservationsByRestaurant(
            @PathVariable Long restaurantId,
            @PageableDefault(size = 20) Pageable pageable) {
        log.info("Fetching reservations for restaurant: {}", restaurantId);
        Page<SimpleReservation> reservations = reservationService.getReservationsByRestaurant(restaurantId, pageable);
        Page<SimpleReservationDTO> dtos = reservations.map(this::convertToDTO);
        return ResponseEntity.ok(dtos);
    }
    
    @GetMapping("/customer/{email}")
    public ResponseEntity<List<SimpleReservationDTO>> getReservationsByCustomer(@PathVariable String email) {
        log.info("Fetching reservations for customer: {}", email);
        List<SimpleReservation> reservations = reservationService.getReservationsByCustomerEmail(email);
        List<SimpleReservationDTO> dtos = reservations.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
    
    @GetMapping("/date-range")
    public ResponseEntity<List<SimpleReservationDTO>> getReservationsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        log.info("Fetching reservations between {} and {}", start, end);
        List<SimpleReservation> reservations = reservationService.getReservationsByDateRange(start, end);
        List<SimpleReservationDTO> dtos = reservations.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<SimpleReservationDTO> updateReservation(
            @PathVariable Long id,
            @Valid @RequestBody SimpleReservationDTO dto) {
        log.info("Updating reservation with id: {}", id);
        SimpleReservation reservation = reservationService.updateReservation(id, dto);
        return ResponseEntity.ok(convertToDTO(reservation));
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<SimpleReservationDTO> updateReservationStatus(
            @PathVariable Long id,
            @RequestParam SimpleReservation.ReservationStatus status) {
        log.info("Updating reservation {} status to: {}", id, status);
        SimpleReservation reservation = reservationService.updateReservationStatus(id, status);
        return ResponseEntity.ok(convertToDTO(reservation));
    }
    
    @PutMapping("/{id}/confirm")
    public ResponseEntity<SimpleReservationDTO> confirmReservation(@PathVariable Long id) {
        log.info("Confirming reservation with id: {}", id);
        reservationService.confirmReservation(id);
        SimpleReservation reservation = reservationService.getReservationById(id);
        return ResponseEntity.ok(convertToDTO(reservation));
    }
    
    @PutMapping("/{id}/cancel")
    public ResponseEntity<SimpleReservationDTO> cancelReservation(@PathVariable Long id) {
        log.info("Cancelling reservation with id: {}", id);
        reservationService.cancelReservation(id);
        SimpleReservation reservation = reservationService.getReservationById(id);
        return ResponseEntity.ok(convertToDTO(reservation));
    }
    
    private SimpleReservationDTO convertToDTO(SimpleReservation reservation) {
        return SimpleReservationDTO.builder()
                .id(reservation.getId())
                .customerName(reservation.getCustomerName())
                .customerEmail(reservation.getCustomerEmail())
                .customerPhone(reservation.getCustomerPhone())
                .reservationDateTime(reservation.getReservationDateTime())
                .partySize(reservation.getPartySize())
                .specialRequests(reservation.getSpecialRequests())
                .status(reservation.getStatus())
                .restaurantId(reservation.getRestaurant().getId())
                .restaurantName(reservation.getRestaurant().getName())
                .build();
    }
}