package com.restaurant.reservation.service;

import com.restaurant.reservation.dto.ReservationDTO;
import com.restaurant.reservation.dto.TableDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class WebSocketNotificationService {
    
    private final SimpMessagingTemplate messagingTemplate;
    
    /**
     * Send reservation update to all subscribers
     */
    public void sendReservationUpdate(Long restaurantId, ReservationDTO reservation, String action) {
        Map<String, Object> notification = new HashMap<>();
        notification.put("type", "RESERVATION_UPDATE");
        notification.put("action", action);
        notification.put("reservation", reservation);
        notification.put("timestamp", System.currentTimeMillis());
        
        String destination = String.format("/topic/restaurant/%d/reservations", restaurantId);
        messagingTemplate.convertAndSend(destination, notification);
        
        log.debug("Sent reservation update to {}: {} - {}", destination, action, reservation.getReservationCode());
    }
    
    /**
     * Send table status update to all subscribers
     */
    public void sendTableStatusUpdate(Long restaurantId, TableDTO table) {
        Map<String, Object> notification = new HashMap<>();
        notification.put("type", "TABLE_STATUS_UPDATE");
        notification.put("table", table);
        notification.put("timestamp", System.currentTimeMillis());
        
        String destination = String.format("/topic/restaurant/%d/tables", restaurantId);
        messagingTemplate.convertAndSend(destination, notification);
        
        log.debug("Sent table status update to {}: Table {} - {}", 
                destination, table.getTableNumber(), table.getStatus());
    }
    
    /**
     * Send notification to specific user
     */
    public void sendUserNotification(String userEmail, String title, String message, Map<String, Object> data) {
        Map<String, Object> notification = new HashMap<>();
        notification.put("type", "USER_NOTIFICATION");
        notification.put("title", title);
        notification.put("message", message);
        notification.put("data", data);
        notification.put("timestamp", System.currentTimeMillis());
        
        messagingTemplate.convertAndSendToUser(userEmail, "/queue/notifications", notification);
        
        log.debug("Sent notification to user {}: {}", userEmail, title);
    }
    
    /**
     * Send real-time stats update to restaurant dashboard
     */
    public void sendStatsUpdate(Long restaurantId, Map<String, Object> stats) {
        Map<String, Object> notification = new HashMap<>();
        notification.put("type", "STATS_UPDATE");
        notification.put("stats", stats);
        notification.put("timestamp", System.currentTimeMillis());
        
        String destination = String.format("/topic/restaurant/%d/stats", restaurantId);
        messagingTemplate.convertAndSend(destination, notification);
        
        log.debug("Sent stats update to {}", destination);
    }
    
    /**
     * Broadcast system-wide announcement
     */
    public void broadcastAnnouncement(String message, String severity) {
        Map<String, Object> notification = new HashMap<>();
        notification.put("type", "SYSTEM_ANNOUNCEMENT");
        notification.put("message", message);
        notification.put("severity", severity); // info, warning, error
        notification.put("timestamp", System.currentTimeMillis());
        
        messagingTemplate.convertAndSend("/topic/announcements", notification);
        
        log.info("Broadcast announcement: {} [{}]", message, severity);
    }
}