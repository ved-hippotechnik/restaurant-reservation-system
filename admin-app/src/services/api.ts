const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8082/api';

// Generic API response type
interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// Restaurant interfaces
export interface Restaurant {
  id?: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  cuisine: string;
  priceRange: string;
  description?: string;
  capacity: number;
  rating?: number;
  imageUrl?: string;
  gallery?: string[]; // Array of image URLs for gallery
  openingHours?: string;
  city?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Reservation interfaces
export interface Reservation {
  id?: number;
  restaurantId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  reservationDate: string;
  reservationTime: string;
  partySize: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  specialRequests?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ReservationRequest {
  restaurantId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  reservationDate: string;
  reservationTime: string;
  partySize: number;
  specialRequests?: string;
}

// Health check interface
export interface HealthStatus {
  status: string;
  service: string;
  version: string;
  timestamp: string;
  database: string;
}

class ApiService {
  private async fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorText = await response.text();
        return { error: `HTTP ${response.status}: ${errorText}` };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('API request failed:', error);
      return { error: error instanceof Error ? error.message : 'Unknown error occurred' };
    }
  }

  // Health endpoints
  async getHealth(): Promise<ApiResponse<HealthStatus>> {
    return this.fetchAPI<HealthStatus>('/health');
  }

  async ping(): Promise<ApiResponse<{ message: string; timestamp: string }>> {
    return this.fetchAPI<{ message: string; timestamp: string }>('/health/ping');
  }

  // Restaurant endpoints
  async getRestaurants(): Promise<ApiResponse<Restaurant[]>> {
    return this.fetchAPI<Restaurant[]>('/restaurants');
  }

  async getRestaurant(id: number): Promise<ApiResponse<Restaurant>> {
    return this.fetchAPI<Restaurant>(`/restaurants/${id}`);
  }

  async createRestaurant(restaurant: Omit<Restaurant, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Restaurant>> {
    return this.fetchAPI<Restaurant>('/restaurants', {
      method: 'POST',
      body: JSON.stringify(restaurant),
    });
  }

  async updateRestaurant(id: number, restaurant: Partial<Restaurant>): Promise<ApiResponse<Restaurant>> {
    return this.fetchAPI<Restaurant>(`/restaurants/${id}`, {
      method: 'PUT',
      body: JSON.stringify(restaurant),
    });
  }

  async deleteRestaurant(id: number): Promise<ApiResponse<void>> {
    return this.fetchAPI<void>(`/restaurants/${id}`, {
      method: 'DELETE',
    });
  }

  async searchRestaurants(query: string): Promise<ApiResponse<Restaurant[]>> {
    return this.fetchAPI<Restaurant[]>(`/restaurants/search?query=${encodeURIComponent(query)}`);
  }

  async getRestaurantsByCity(city: string): Promise<ApiResponse<Restaurant[]>> {
    return this.fetchAPI<Restaurant[]>(`/restaurants/city/${encodeURIComponent(city)}`);
  }

  async getRestaurantsByCuisine(cuisine: string): Promise<ApiResponse<Restaurant[]>> {
    return this.fetchAPI<Restaurant[]>(`/restaurants/cuisine/${encodeURIComponent(cuisine)}`);
  }

  // Reservation endpoints
  async getReservations(): Promise<ApiResponse<Reservation[]>> {
    return this.fetchAPI<Reservation[]>('/reservations');
  }

  async getReservation(id: number): Promise<ApiResponse<Reservation>> {
    return this.fetchAPI<Reservation>(`/reservations/${id}`);
  }

  async createReservation(reservation: ReservationRequest): Promise<ApiResponse<Reservation>> {
    return this.fetchAPI<Reservation>('/reservations', {
      method: 'POST',
      body: JSON.stringify(reservation),
    });
  }

  async updateReservation(id: number, reservation: Partial<Reservation>): Promise<ApiResponse<Reservation>> {
    return this.fetchAPI<Reservation>(`/reservations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(reservation),
    });
  }

  async deleteReservation(id: number): Promise<ApiResponse<void>> {
    return this.fetchAPI<void>(`/reservations/${id}`, {
      method: 'DELETE',
    });
  }

  async getReservationsByRestaurant(restaurantId: number): Promise<ApiResponse<Reservation[]>> {
    return this.fetchAPI<Reservation[]>(`/reservations/restaurant/${restaurantId}`);
  }

  async getReservationsByCustomer(email: string): Promise<ApiResponse<Reservation[]>> {
    return this.fetchAPI<Reservation[]>(`/reservations/customer/${encodeURIComponent(email)}`);
  }

  async updateReservationStatus(id: number, status: Reservation['status']): Promise<ApiResponse<Reservation>> {
    return this.fetchAPI<Reservation>(`/reservations/${id}/status?status=${status}`, {
      method: 'PUT',
    });
  }
}

export const apiService = new ApiService();
export default apiService;