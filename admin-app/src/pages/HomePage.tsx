import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardMedia,
  CardContent,
  Paper,
  MenuItem,
  InputAdornment,
  Grid,
} from '@mui/material';
import {
  LocationOn,
  CalendarToday,
  People,
  Search as SearchIcon,
} from '@mui/icons-material';

const HomePage: React.FC = () => {
  const [partySize, setPartySize] = useState(2);
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('7:00 PM');

  const handleSearch = () => {
    console.log('Search clicked with:', {
      date: selectedDate,
      time: selectedTime,
      partySize,
      location: searchLocation
    });
    alert(`Searching for restaurants...\nDate: ${selectedDate || 'Today'}\nTime: ${selectedTime}\nParty Size: ${partySize}\nLocation: ${searchLocation || 'All locations'}`);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 2 }}>
        <Container>
          <Typography variant="h4" fontWeight="bold">
            TableReserve
          </Typography>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1600)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" gutterBottom fontWeight="700">
            Find your table for any occasion
          </Typography>

          {/* Search Form */}
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2, maxWidth: 900, mx: 'auto' }}>
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 12, md: 3 }}>
                <TextField
                  label="Date"
                  fullWidth
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarToday fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid size={{ xs: 6, md: 2 }}>
                <TextField
                  label="Time"
                  fullWidth
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 6, md: 2 }}>
                <TextField
                  select
                  label="Party Size"
                  value={partySize}
                  onChange={(e) => setPartySize(Number(e.target.value))}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <People fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((size) => (
                    <MenuItem key={size} value={size}>
                      {size} {size === 1 ? 'Person' : 'People'}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <TextField
                  label="Location, Restaurant, or Cuisine"
                  fullWidth
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOn fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={handleSearch}
                  startIcon={<SearchIcon />}
                  sx={{ height: 56 }}
                >
                  Let's go
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>

      {/* Popular Restaurants */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom fontWeight="600">
          Trending in New York
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {[1, 2, 3, 4].map((id) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={id}>
              <Card sx={{ height: '100%' }}>
                <CardMedia
                  component="img"
                  height="160"
                  image={`https://images.unsplash.com/photo-151724813546${id}?w=400`}
                  alt="Restaurant"
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Restaurant {id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    American • $$$ • Midtown
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;
