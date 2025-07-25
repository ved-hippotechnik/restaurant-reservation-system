package com.restaurant.reservation.controller;

import com.restaurant.reservation.dto.TableCreateDTO;
import com.restaurant.reservation.dto.TableDTO;
import com.restaurant.reservation.dto.TableUpdateDTO;
import com.restaurant.reservation.model.Table;
import com.restaurant.reservation.service.TableService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@CrossOrigin
public class TableController {
    
    private final TableService tableService;
    
    @PostMapping("/restaurants/{restaurantId}/tables")
    @PreAuthorize("hasRole('RESTAURANT_MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<TableDTO> createTable(
            @PathVariable Long restaurantId,
            @Valid @RequestBody TableCreateDTO dto) {
        Table table = tableService.createTable(restaurantId, dto);
        return new ResponseEntity<>(convertToDTO(table), HttpStatus.CREATED);
    }
    
    @PostMapping("/restaurants/{restaurantId}/tables/bulk")
    @PreAuthorize("hasRole('RESTAURANT_MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<TableDTO>> createTables(
            @PathVariable Long restaurantId,
            @Valid @RequestBody List<TableCreateDTO> tables) {
        List<Table> createdTables = tableService.bulkCreateTables(restaurantId, tables);
        List<TableDTO> dtos = createdTables.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return new ResponseEntity<>(dtos, HttpStatus.CREATED);
    }
    
    @GetMapping("/restaurants/{restaurantId}/tables")
    public ResponseEntity<List<TableDTO>> getTablesByRestaurant(@PathVariable Long restaurantId) {
        List<Table> tables = tableService.getTablesByRestaurant(restaurantId);
        List<TableDTO> dtos = tables.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
    
    @GetMapping("/tables/{id}")
    public ResponseEntity<TableDTO> getTable(@PathVariable Long id) {
        Table table = tableService.getTableById(id);
        return ResponseEntity.ok(convertToDTO(table));
    }
    
    @PutMapping("/tables/{id}")
    @PreAuthorize("hasRole('RESTAURANT_STAFF') or hasRole('RESTAURANT_MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<TableDTO> updateTable(
            @PathVariable Long id,
            @Valid @RequestBody TableUpdateDTO dto) {
        Table table = tableService.updateTable(id, dto);
        return ResponseEntity.ok(convertToDTO(table));
    }
    
    @PutMapping("/tables/{id}/status")
    @PreAuthorize("hasRole('RESTAURANT_STAFF') or hasRole('RESTAURANT_MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<TableDTO> updateTableStatus(
            @PathVariable Long id,
            @RequestParam Table.TableStatus status) {
        Table table = tableService.updateTableStatus(id, status);
        return ResponseEntity.ok(convertToDTO(table));
    }
    
    @GetMapping("/restaurants/{restaurantId}/tables/available")
    public ResponseEntity<List<TableDTO>> getAvailableTables(
            @PathVariable Long restaurantId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime,
            @RequestParam Integer partySize) {
        List<Table> tables = tableService.findAvailableTablesForTimeSlot(
                restaurantId, startTime, endTime, partySize);
        List<TableDTO> dtos = tables.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
    
    @DeleteMapping("/tables/{id}")
    @PreAuthorize("hasRole('RESTAURANT_MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Void> deactivateTable(@PathVariable Long id) {
        tableService.deactivateTable(id);
        return ResponseEntity.noContent().build();
    }
    
    @PutMapping("/tables/{id}/activate")
    @PreAuthorize("hasRole('RESTAURANT_MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Void> activateTable(@PathVariable Long id) {
        tableService.activateTable(id);
        return ResponseEntity.noContent().build();
    }
    
    private TableDTO convertToDTO(Table table) {
        return TableDTO.builder()
                .id(table.getId())
                .tableNumber(table.getTableNumber())
                .capacity(table.getCapacity())
                .minCapacity(table.getMinCapacity())
                .restaurantId(table.getRestaurant().getId())
                .restaurantName(table.getRestaurant().getName())
                .status(table.getStatus())
                .section(table.getSection())
                .xPosition(table.getXPosition())
                .yPosition(table.getYPosition())
                .shape(table.getShape())
                .active(table.getActive())
                .features(table.getFeatures())
                .build();
    }
}