package com.restaurant.reservation.service;

import com.restaurant.reservation.dto.TableDTO;
import com.restaurant.reservation.dto.TableCreateDTO;
import com.restaurant.reservation.dto.TableUpdateDTO;
import com.restaurant.reservation.exception.ResourceNotFoundException;
import com.restaurant.reservation.model.Restaurant;
import com.restaurant.reservation.model.Table;
import com.restaurant.reservation.repository.RestaurantRepository;
import com.restaurant.reservation.repository.TableRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class TableService {
    
    private final TableRepository tableRepository;
    private final RestaurantRepository restaurantRepository;
    
    public Table createTable(Long restaurantId, TableCreateDTO dto) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + restaurantId));
        
        Table table = Table.builder()
                .tableNumber(dto.getTableNumber())
                .capacity(dto.getCapacity())
                .minCapacity(dto.getMinCapacity())
                .restaurant(restaurant)
                .section(dto.getSection())
                .xPosition(dto.getXPosition())
                .yPosition(dto.getYPosition())
                .shape(dto.getShape())
                .status(Table.TableStatus.AVAILABLE)
                .active(true)
                .build();
        
        if (dto.getFeatures() != null) {
            table.setFeatures(dto.getFeatures());
        }
        
        return tableRepository.save(table);
    }
    
    public List<Table> getTablesByRestaurant(Long restaurantId) {
        return tableRepository.findByRestaurantIdAndActiveTrue(restaurantId);
    }
    
    public Table getTableById(Long id) {
        return tableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Table not found with id: " + id));
    }
    
    public Table updateTable(Long id, TableUpdateDTO dto) {
        Table table = getTableById(id);
        
        if (dto.getTableNumber() != null) table.setTableNumber(dto.getTableNumber());
        if (dto.getCapacity() != null) table.setCapacity(dto.getCapacity());
        if (dto.getMinCapacity() != null) table.setMinCapacity(dto.getMinCapacity());
        if (dto.getSection() != null) table.setSection(dto.getSection());
        if (dto.getXPosition() != null) table.setXPosition(dto.getXPosition());
        if (dto.getYPosition() != null) table.setYPosition(dto.getYPosition());
        if (dto.getShape() != null) table.setShape(dto.getShape());
        if (dto.getFeatures() != null) table.setFeatures(dto.getFeatures());
        
        return tableRepository.save(table);
    }
    
    public Table updateTableStatus(Long id, Table.TableStatus status) {
        Table table = getTableById(id);
        table.setStatus(status);
        return tableRepository.save(table);
    }
    
    public List<Table> findAvailableTablesForTimeSlot(Long restaurantId, LocalDateTime startTime, 
                                                      LocalDateTime endTime, Integer partySize) {
        List<Table> availableTables = tableRepository.findAvailableTablesForTimeSlot(
                restaurantId, startTime, endTime);
        
        // Filter by party size
        return availableTables.stream()
                .filter(table -> table.getMinCapacity() <= partySize && table.getCapacity() >= partySize)
                .sorted((t1, t2) -> {
                    // Sort by capacity (prefer smaller tables that fit the party)
                    int capacityDiff1 = t1.getCapacity() - partySize;
                    int capacityDiff2 = t2.getCapacity() - partySize;
                    return Integer.compare(capacityDiff1, capacityDiff2);
                })
                .collect(Collectors.toList());
    }
    
    public void deactivateTable(Long id) {
        Table table = getTableById(id);
        table.setActive(false);
        table.setStatus(Table.TableStatus.UNAVAILABLE);
        tableRepository.save(table);
    }
    
    public void activateTable(Long id) {
        Table table = getTableById(id);
        table.setActive(true);
        table.setStatus(Table.TableStatus.AVAILABLE);
        tableRepository.save(table);
    }
    
    public List<Table> bulkCreateTables(Long restaurantId, List<TableCreateDTO> tables) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + restaurantId));
        
        List<Table> newTables = tables.stream()
                .map(dto -> {
                    Table table = Table.builder()
                            .tableNumber(dto.getTableNumber())
                            .capacity(dto.getCapacity())
                            .minCapacity(dto.getMinCapacity())
                            .restaurant(restaurant)
                            .section(dto.getSection())
                            .xPosition(dto.getXPosition())
                            .yPosition(dto.getYPosition())
                            .shape(dto.getShape())
                            .status(Table.TableStatus.AVAILABLE)
                            .active(true)
                            .build();
                    
                    if (dto.getFeatures() != null) {
                        table.setFeatures(dto.getFeatures());
                    }
                    
                    return table;
                })
                .collect(Collectors.toList());
        
        return tableRepository.saveAll(newTables);
    }
}