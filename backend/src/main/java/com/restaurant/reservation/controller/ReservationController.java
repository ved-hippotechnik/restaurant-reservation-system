package com.restaurant.reservation.controller;

import com.restaurant.reservation.dto.ReservationCreateDTO;
import com.restaurant.reservation.dto.ReservationDTO;
import com.restaurant.reservation.dto.ReservationUpdateDTO;
import com.restaurant.reservation.model.Reservation;
import com.restaurant.reservation.service.ReservationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/reservations")
@RequiredArgsConstructor
@CrossOrigin
public class ReservationController {
    
    private final ReservationService reservationService;
    
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ReservationDTO> createReservation(@Valid @RequestBody ReservationCreateDTO dto) {
        Reservation reservation = reservationService.createReservation(dto);
        return new ResponseEntity<>(convertToDTO(reservation), HttpStatus.CREATED);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ReservationDTO> getReservation(@PathVariable Long id) {
        Reservation reservation = reservationService.getReservationById(id);
        return ResponseEntity.ok(convertToDTO(reservation));
    }
    
    @GetMapping("/code/{code}")
    public ResponseEntity<ReservationDTO> getReservationByCode(@PathVariable String code) {
        Reservation reservation = reservationService.getReservationByCode(code);
        return ResponseEntity.ok(convertToDTO(reservation));
    }
    
    @GetMapping("/customer/{customerId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<ReservationDTO>> getCustomerReservations(
            @PathVariable Long customerId,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<Reservation> reservations = reservationService.getCustomerReservations(customerId, pageable);
        Page<ReservationDTO> dtos = reservations.map(this::convertToDTO);
        return ResponseEntity.ok(dtos);
    }
    
    @GetMapping("/restaurant/{restaurantId}")
    @PreAuthorize("hasRole('RESTAURANT_STAFF') or hasRole('RESTAURANT_MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Page<ReservationDTO>> getRestaurantReservations(
            @PathVariable Long restaurantId,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<Reservation> reservations = reservationService.getRestaurantReservations(restaurantId, pageable);
        Page<ReservationDTO> dtos = reservations.map(this::convertToDTO);
        return ResponseEntity.ok(dtos);
    }
    
    @GetMapping("/restaurant/{restaurantId}/date")
    @PreAuthorize("hasRole('RESTAURANT_STAFF') or hasRole('RESTAURANT_MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<ReservationDTO>> getRestaurantReservationsByDate(
            @PathVariable Long restaurantId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime date) {
        List<Reservation> reservations = reservationService.getRestaurantReservationsByDate(restaurantId, date);
        List<ReservationDTO> dtos = reservations.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ReservationDTO> updateReservation(
            @PathVariable Long id,
            @Valid @RequestBody ReservationUpdateDTO dto) {
        Reservation reservation = reservationService.updateReservation(id, dto);
        return ResponseEntity.ok(convertToDTO(reservation));
    }
    
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('RESTAURANT_STAFF') or hasRole('RESTAURANT_MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<ReservationDTO> updateReservationStatus(
            @PathVariable Long id,
            @RequestParam Reservation.ReservationStatus status) {
        Reservation reservation = reservationService.updateReservationStatus(id, status);
        return ResponseEntity.ok(convertToDTO(reservation));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ReservationDTO> cancelReservation(
            @PathVariable Long id,
            @RequestParam(required = false) String reason) {
        Reservation reservation = reservationService.cancelReservation(id, reason);
        return ResponseEntity.ok(convertToDTO(reservation));
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
                .arrivalTime(reservation.getArrivalTime())
                .seatedTime(reservation.getSeatedTime())
                .completedTime(reservation.getCompletedTime())
                .cancellationReason(reservation.getCancellationReason())
                .cancellationTime(reservation.getCancellationTime())
                .tags(reservation.getTags())
                .source(reservation.getSource())
                .createdAt(reservation.getCreatedAt())
                .build();
    }
}