import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/common/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';
import RestaurantList from './components/RestaurantList';
import theme from './styles/theme';

// Lazy load pages for code splitting
const SimpleHomePage = lazy(() => import('./pages/SimpleHomePage'));
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RestaurantsPage = lazy(() => import('./pages/RestaurantsPage'));
const DashboardLayout = lazy(() => import('./components/dashboard/DashboardLayout'));
const DashboardOverview = lazy(() => import('./pages/dashboard/DashboardOverview'));
const ReservationsPage = lazy(() => import('./pages/dashboard/ReservationsPage'));
const TablesPage = lazy(() => import('./pages/dashboard/TablesPage'));
const CustomersPage = lazy(() => import('./pages/dashboard/CustomersPage'));
const SettingsPage = lazy(() => import('./pages/dashboard/SettingsPage'));
const ComingSoonPage = lazy(() => import('./pages/ComingSoonPage'));

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <Suspense fallback={<LoadingSpinner fullScreen message="Loading..." />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Navigate to="/restaurants" replace />} />
                <Route path="/search" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                
                {/* Restaurant Management Route */}
                <Route path="/restaurants" element={<RestaurantsPage />} />
                
                {/* Protected Dashboard Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<DashboardOverview />} />
                  <Route path="reservations" element={<ReservationsPage />} />
                  <Route path="tables" element={<TablesPage />} />
                  <Route path="customers" element={<CustomersPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                </Route>
                
                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
