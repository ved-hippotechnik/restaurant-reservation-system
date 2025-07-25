package com.restaurant.reservation.dto;

import com.restaurant.reservation.model.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TableDTO {
    private Long id;
    private String tableNumber;
    private Integer capacity;
    private Integer minCapacity;
    private Long restaurantId;
    private String restaurantName;
    private Table.TableStatus status;
    private String section;
    private Integer xPosition;
    private Integer yPosition;
    private Table.TableShape shape;
    private Boolean active;
    private List<String> features;
}