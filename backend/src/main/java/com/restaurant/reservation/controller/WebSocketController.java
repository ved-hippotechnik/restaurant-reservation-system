package com.restaurant.reservation.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequiredArgsConstructor
@Slf4j
public class WebSocketController {
    
    /**
     * Handle subscription to restaurant updates
     */
    @SubscribeMapping("/restaurant/{restaurantId}/subscribe")
    public Map<String, Object> subscribeToRestaurant(@DestinationVariable Long restaurantId, Principal principal) {
        log.info("User {} subscribed to restaurant {} updates", 
                principal != null ? principal.getName() : "anonymous", restaurantId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", "subscribed");
        response.put("restaurantId", restaurantId);
        response.put("timestamp", System.currentTimeMillis());
        
        return response;
    }
    
    /**
     * Handle heartbeat/ping messages
     */
    @MessageMapping("/ping")
    @SendTo("/topic/pong")
    public Map<String, Object> ping(Map<String, Object> message) {
        Map<String, Object> response = new HashMap<>();
        response.put("type", "pong");
        response.put("timestamp", System.currentTimeMillis());
        response.put("originalMessage", message);
        
        return response;
    }
    
    /**
     * Handle connection status
     */
    @MessageMapping("/status")
    @SendTo("/topic/status")
    public Map<String, Object> status(Principal principal) {
        Map<String, Object> response = new HashMap<>();
        response.put("type", "connection_status");
        response.put("connected", true);
        response.put("user", principal != null ? principal.getName() : "anonymous");
        response.put("timestamp", System.currentTimeMillis());
        
        return response;
    }
}