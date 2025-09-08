import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { Restaurant, AccountCircle } from '@mui/icons-material';

// Components
import ErrorBoundary from './components/ErrorBoundary';

// Pages
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';

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

const Navbar: React.FC = () => {
  return (
    <AppBar position="sticky" sx={{ bgcolor: 'white', color: 'text.primary' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Restaurant sx={{ mr: 2, color: '#DA3743' }} />
          <Typography
            variant="h6"
            component="a"
            href="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
              fontWeight: 700,
            }}
          >
            TableReserve
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button color="inherit">
              Browse Restaurants
            </Button>
            <Button color="inherit" startIcon={<AccountCircle />}>
              Sign In
            </Button>
            <Button 
              variant="contained" 
              color="primary"
            >
              For Restaurants
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <Box sx={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<div>Search Page (Coming Soon)</div>} />
              <Route path="/restaurant/:id" element={<div>Restaurant Details (Coming Soon)</div>} />
              <Route path="/book/:restaurantId" element={<BookingPage />} />
              <Route path="/my-reservations" element={<div>My Reservations (Coming Soon)</div>} />
            </Routes>
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
