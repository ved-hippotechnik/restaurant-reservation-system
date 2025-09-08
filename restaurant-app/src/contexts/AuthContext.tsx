import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Restaurant {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
}

interface User {
  id: number;
  email: string;
  name: string;
  role: 'owner' | 'manager' | 'staff';
  restaurant: Restaurant;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('restaurantUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // For demo purposes, we'll use a mock login
    // In production, this would call your backend API
    
    // Mock successful login
    const mockUser: User = {
      id: 1,
      email: email,
      name: 'Restaurant Manager',
      role: 'manager',
      restaurant: {
        id: 1,
        name: 'The Grand Dining',
        address: '123 5th Avenue, New York, NY 10001',
        phone: '(212) 555-0123',
        email: 'info@granddining.com',
      },
    };

    localStorage.setItem('restaurantUser', JSON.stringify(mockUser));
    setUser(mockUser);
  };

  const logout = () => {
    localStorage.removeItem('restaurantUser');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};