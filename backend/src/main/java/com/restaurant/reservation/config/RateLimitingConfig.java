package com.restaurant.reservation.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Configuration
public class RateLimitingConfig implements WebMvcConfigurer {
    
    private static final Logger logger = LoggerFactory.getLogger(RateLimitingConfig.class);
    
    @Value("${app.rate-limiting.enabled:true}")
    private boolean rateLimitingEnabled;
    
    @Value("${app.rate-limiting.requests-per-minute:100}")
    private int requestsPerMinute;
    
    @Value("${app.rate-limiting.requests-per-hour:2000}")
    private int requestsPerHour;
    
    private final ConcurrentHashMap<String, AtomicInteger> minuteCounters = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, AtomicInteger> hourCounters = new ConcurrentHashMap<>();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(2);
    
    public RateLimitingConfig() {
        // Reset minute counters every minute
        scheduler.scheduleAtFixedRate(() -> {
            minuteCounters.clear();
            logger.debug("Cleared minute rate limit counters");
        }, 1, 1, TimeUnit.MINUTES);
        
        // Reset hour counters every hour
        scheduler.scheduleAtFixedRate(() -> {
            hourCounters.clear();
            logger.debug("Cleared hourly rate limit counters");
        }, 1, 1, TimeUnit.HOURS);
    }
    
    @Override
    public void addInterceptors(@NonNull InterceptorRegistry registry) {
        if (rateLimitingEnabled) {
            registry.addInterceptor(new RateLimitInterceptor())
                    .addPathPatterns("/api/**")
                    .excludePathPatterns("/api/health/**", "/actuator/**");
            
            logger.info("Rate limiting enabled with {} requests/minute and {} requests/hour", 
                       requestsPerMinute, requestsPerHour);
        } else {
            logger.warn("Rate limiting is disabled");
        }
    }
    
    private class RateLimitInterceptor implements HandlerInterceptor {
        
        @Override
        public boolean preHandle(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull Object handler) throws Exception {
            if (!rateLimitingEnabled) {
                return true;
            }
            
            String clientIp = getClientIP(request);
            
            // Check minute limit
            AtomicInteger minuteCount = minuteCounters.computeIfAbsent(clientIp, k -> new AtomicInteger(0));
            if (minuteCount.incrementAndGet() > requestsPerMinute) {
                logger.warn("Rate limit exceeded for IP: {} (minute limit: {})", clientIp, requestsPerMinute);
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.getWriter().write("{\"error\":\"Rate limit exceeded. Try again later.\",\"retryAfter\":60}");
                response.setContentType("application/json");
                response.setHeader("Retry-After", "60");
                response.setHeader("X-RateLimit-Limit", String.valueOf(requestsPerMinute));
                response.setHeader("X-RateLimit-Remaining", "0");
                response.setHeader("X-RateLimit-Reset", String.valueOf(System.currentTimeMillis() + 60000));
                return false;
            }
            
            // Check hour limit
            AtomicInteger hourCount = hourCounters.computeIfAbsent(clientIp, k -> new AtomicInteger(0));
            if (hourCount.incrementAndGet() > requestsPerHour) {
                logger.warn("Hourly rate limit exceeded for IP: {} (hour limit: {})", clientIp, requestsPerHour);
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.getWriter().write("{\"error\":\"Hourly rate limit exceeded. Try again later.\",\"retryAfter\":3600}");
                response.setContentType("application/json");
                response.setHeader("Retry-After", "3600");
                response.setHeader("X-RateLimit-Limit", String.valueOf(requestsPerHour));
                response.setHeader("X-RateLimit-Remaining", "0");
                response.setHeader("X-RateLimit-Reset", String.valueOf(System.currentTimeMillis() + 3600000));
                return false;
            }
            
            // Set rate limit headers
            response.setHeader("X-RateLimit-Limit", String.valueOf(requestsPerMinute));
            response.setHeader("X-RateLimit-Remaining", String.valueOf(requestsPerMinute - minuteCount.get()));
            response.setHeader("X-RateLimit-Reset", String.valueOf(System.currentTimeMillis() + 60000));
            
            return true;
        }
        
        private String getClientIP(HttpServletRequest request) {
            String xfHeader = request.getHeader("X-Forwarded-For");
            if (xfHeader == null) {
                return request.getRemoteAddr();
            }
            return xfHeader.split(",")[0].trim();
        }
    }
}