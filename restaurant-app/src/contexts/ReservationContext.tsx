import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export interface Reservation {
  id: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  time: string;
  partySize: number;
  tableNumber?: number;
  status: 'pending' | 'confirmed' | 'seated' | 'completed' | 'cancelled' | 'no-show';
  specialRequests?: string;
  createdAt: string;
  source: 'website' | 'phone' | 'walk-in' | 'google';
  notes?: string;
}

interface ReservationStats {
  todayTotal: number;
  todayConfirmed: number;
  todayPending: number;
  todaySeated: number;
  upcomingWeek: number;
}

interface ReservationContextType {
  reservations: Reservation[];
  todayReservations: Reservation[];
  upcomingReservations: Reservation[];
  stats: ReservationStats;
  loading: boolean;
  refreshReservations: () => Promise<void>;
  updateReservationStatus: (id: number, status: Reservation['status']) => Promise<void>;
  assignTable: (reservationId: number, tableNumber: number) => Promise<void>;
  addNote: (reservationId: number, note: string) => Promise<void>;
  createReservation: (reservation: Omit<Reservation, 'id' | 'createdAt' | 'status'>) => Promise<void>;
}

const ReservationContext = createContext<ReservationContextType | undefined>(undefined);

export const useReservations = () => {
  const context = useContext(ReservationContext);
  if (!context) {
    throw new Error('useReservations must be used within a ReservationProvider');
  }
  return context;
};

export const ReservationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  const mockReservations: Reservation[] = [
    {
      id: 1,
      customerName: 'John Smith',
      customerEmail: 'john.smith@email.com',
      customerPhone: '(555) 123-4567',
      date: new Date().toISOString().split('T')[0],
      time: '18:00',
      partySize: 4,
      tableNumber: 5,
      status: 'confirmed',
      specialRequests: 'Window seat if possible',
      createdAt: new Date().toISOString(),
      source: 'website',
    },
    {
      id: 2,
      customerName: 'Sarah Johnson',
      customerEmail: 'sarah.j@email.com',
      customerPhone: '(555) 234-5678',
      date: new Date().toISOString().split('T')[0],
      time: '19:00',
      partySize: 2,
      status: 'pending',
      specialRequests: 'Anniversary celebration',
      createdAt: new Date().toISOString(),
      source: 'google',
      notes: 'Regular customer - VIP treatment',
    },
    {
      id: 3,
      customerName: 'Mike Wilson',
      customerEmail: 'mike.w@email.com',
      customerPhone: '(555) 345-6789',
      date: new Date().toISOString().split('T')[0],
      time: '19:30',
      partySize: 6,
      tableNumber: 8,
      status: 'seated',
      createdAt: new Date().toISOString(),
      source: 'phone',
    },
    {
      id: 4,
      customerName: 'Emily Brown',
      customerEmail: 'emily.brown@email.com',
      customerPhone: '(555) 456-7890',
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
      time: '20:00',
      partySize: 3,
      status: 'confirmed',
      specialRequests: 'Gluten-free options needed',
      createdAt: new Date().toISOString(),
      source: 'website',
    },
  ];

  useEffect(() => {
    if (user) {
      refreshReservations();
    }
  }, [user]);

  // Auto-refresh every 30 seconds for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (user) {
        refreshReservations();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [user]);

  const refreshReservations = async () => {
    setLoading(true);
    try {
      // In production, fetch from API
      // const response = await apiService.getRestaurantReservations(user.restaurant.id);
      setReservations(mockReservations);
    } catch (error) {
      console.error('Failed to fetch reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateReservationStatus = async (id: number, status: Reservation['status']) => {
    setReservations(prev =>
      prev.map(res => (res.id === id ? { ...res, status } : res))
    );
    // In production, update via API
  };

  const assignTable = async (reservationId: number, tableNumber: number) => {
    setReservations(prev =>
      prev.map(res =>
        res.id === reservationId ? { ...res, tableNumber } : res
      )
    );
    // In production, update via API
  };

  const addNote = async (reservationId: number, note: string) => {
    setReservations(prev =>
      prev.map(res =>
        res.id === reservationId
          ? { ...res, notes: res.notes ? `${res.notes}\n${note}` : note }
          : res
      )
    );
    // In production, update via API
  };

  const createReservation = async (reservation: Omit<Reservation, 'id' | 'createdAt' | 'status'>) => {
    const newReservation: Reservation = {
      ...reservation,
      id: Math.max(...reservations.map(r => r.id), 0) + 1,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    setReservations(prev => [...prev, newReservation]);
    // In production, create via API
  };

  // Calculate today's reservations
  const today = new Date().toISOString().split('T')[0];
  const todayReservations = reservations.filter(res => res.date === today);
  
  // Calculate upcoming reservations (next 7 days)
  const upcomingReservations = reservations.filter(res => {
    const resDate = new Date(res.date);
    const todayDate = new Date(today);
    const weekFromNow = new Date(todayDate);
    weekFromNow.setDate(weekFromNow.getDate() + 7);
    return resDate > todayDate && resDate <= weekFromNow;
  });

  // Calculate statistics
  const stats: ReservationStats = {
    todayTotal: todayReservations.length,
    todayConfirmed: todayReservations.filter(r => r.status === 'confirmed').length,
    todayPending: todayReservations.filter(r => r.status === 'pending').length,
    todaySeated: todayReservations.filter(r => r.status === 'seated').length,
    upcomingWeek: upcomingReservations.length,
  };

  const value = {
    reservations,
    todayReservations,
    upcomingReservations,
    stats,
    loading,
    refreshReservations,
    updateReservationStatus,
    assignTable,
    addNote,
    createReservation,
  };

  return (
    <ReservationContext.Provider value={value}>{children}</ReservationContext.Provider>
  );
};