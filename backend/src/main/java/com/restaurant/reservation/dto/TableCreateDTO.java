package com.restaurant.reservation.dto;

import com.restaurant.reservation.model.Table;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TableCreateDTO {
    @NotBlank(message = "Table number is required")
    private String tableNumber;
    
    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be at least 1")
    @Max(value = 20, message = "Capacity cannot exceed 20")
    private Integer capacity;
    
    @NotNull(message = "Minimum capacity is required")
    @Min(value = 1, message = "Minimum capacity must be at least 1")
    private Integer minCapacity;
    
    @NotBlank(message = "Section is required")
    private String section;
    
    private Integer xPosition;
    private Integer yPosition;
    
    private Table.TableShape shape = Table.TableShape.SQUARE;
    
    private List<String> features;
}