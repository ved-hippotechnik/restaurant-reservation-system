package com.restaurant.reservation.dto;

import com.restaurant.reservation.model.Table;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TableUpdateDTO {
    private String tableNumber;
    
    @Min(value = 1, message = "Capacity must be at least 1")
    @Max(value = 20, message = "Capacity cannot exceed 20")
    private Integer capacity;
    
    @Min(value = 1, message = "Minimum capacity must be at least 1")
    private Integer minCapacity;
    
    private String section;
    private Integer xPosition;
    private Integer yPosition;
    private Table.TableShape shape;
    private List<String> features;
}