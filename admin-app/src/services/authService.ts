import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8081/api';

// Configure axios to send cookies
axios.defaults.withCredentials = true;

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
    restaurantId?: number;
  };
}

class AuthService {
  private user: any = null;

  constructor() {
    // Try to get user from secure session storage (not localStorage)
    const userStr = sessionStorage.getItem('user');
    if (userStr) {
      try {
        this.user = JSON.parse(userStr);
      } catch (e) {
        console.error('Failed to parse user data');
      }
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Server should set httpOnly cookie with token
      const response = await axios.post(`${API_URL}/v1/auth/login`, credentials, {
        withCredentials: true,
      });
      const { user } = response.data;
      
      this.user = user;
      // Only store non-sensitive user info in sessionStorage
      sessionStorage.setItem('user', JSON.stringify(user));
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(userData: any): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/v1/auth/register`, userData, {
        withCredentials: true,
      });
      const { user } = response.data;
      
      this.user = user;
      sessionStorage.setItem('user', JSON.stringify(user));
      
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async logout() {
    try {
      // Call server to clear httpOnly cookie
      await axios.post(`${API_URL}/v1/auth/logout`, {}, {
        withCredentials: true,
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.user = null;
      sessionStorage.removeItem('user');
    }
  }

  getCurrentUser() {
    return this.user;
  }

  async checkAuth(): Promise<boolean> {
    try {
      // Verify authentication with server
      const response = await axios.get(`${API_URL}/v1/auth/me`, {
        withCredentials: true,
      });
      this.user = response.data;
      sessionStorage.setItem('user', JSON.stringify(this.user));
      return true;
    } catch (error) {
      this.user = null;
      sessionStorage.removeItem('user');
      return false;
    }
  }

  isAuthenticated() {
    return !!this.user;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user && user.role === role;
  }

  isRestaurantStaff(): boolean {
    const user = this.getCurrentUser();
    return user && ['RESTAURANT_STAFF', 'RESTAURANT_MANAGER', 'ADMIN'].includes(user.role);
  }
}

export default new AuthService();