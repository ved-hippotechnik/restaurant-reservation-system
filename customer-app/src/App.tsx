import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Box, Typography } from '@mui/material';

// Components
import ErrorBoundary from './components/ErrorBoundary';
import ResponsiveNavbar from './components/ResponsiveNavbar';
import LoadingSpinner from './components/common/LoadingSpinner';
import CustomerHomePage from './pages/CustomerHomePage';

// Lazy load pages for code splitting
const CustomerBookingPage = lazy(() => import('./pages/CustomerBookingPage'));
const CustomerRestaurantDetails = lazy(() => import('./pages/CustomerRestaurantDetails'));
const MyReservationsPage = lazy(() => import('./pages/MyReservationsPage'));

const theme = createTheme({
  palette: {
    primary: {
      main: '#C41E3A', // Darker red for better contrast (WCAG AA compliant)
      light: '#DA3743',
      dark: '#8B0020',
    },
    secondary: {
      main: '#1976D2', // Darker blue for better contrast
    },
    error: {
      main: '#D32F2F',
    },
    text: {
      primary: '#212121',
      secondary: '#616161',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});


function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <ResponsiveNavbar />
          <Box component="main" sx={{ flex: 1 }}>
            <Suspense fallback={<LoadingSpinner fullScreen message="Loading..." />}>
              <Routes>
                <Route path="/" element={<CustomerHomePage />} />
                <Route path="/browse" element={<CustomerHomePage />} />
                <Route path="/restaurants" element={<Navigate to="/" replace />} />
                <Route path="/restaurant/:id" element={<CustomerRestaurantDetails />} />
                <Route path="/book/:restaurantId" element={<CustomerBookingPage />} />
                <Route path="/my-reservations" element={<MyReservationsPage />} />
                {/* Redirect any unknown routes to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </Box>
          
          {/* Footer */}
          <Box
            component="footer"
            sx={{
              py: 4,
              px: 2,
              mt: 'auto',
              backgroundColor: '#f5f5f5',
            }}
          >
            <Container maxWidth="lg">
              <Typography variant="body2" color="text.secondary" align="center">
                © 2024 TableReserve. All rights reserved.
              </Typography>
            </Container>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
