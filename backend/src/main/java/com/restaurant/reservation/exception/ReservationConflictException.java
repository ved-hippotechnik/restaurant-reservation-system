package com.restaurant.reservation.exception;

public class ReservationConflictException extends RuntimeException {
    public ReservationConflictException(String message) {
        super(message);
    }
    
    public ReservationConflictException(String message, Throwable cause) {
        super(message, cause);
    }
}