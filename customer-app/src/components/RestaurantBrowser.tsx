import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Alert,
  CircularProgress,
  TextField,
  InputAdornment,
  MenuItem,
  Chip,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Search,
  Restaurant as RestaurantIcon,
  LocationOn,
  Phone,
  Schedule,
  People,
  Email,
} from '@mui/icons-material';
import { apiService, Restaurant, ReservationRequest } from '../services/api';
import ErrorBoundary from './ErrorBoundary';

const RestaurantBrowser: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [openReservationDialog, setOpenReservationDialog] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [reservationForm, setReservationForm] = useState<ReservationRequest>({
    restaurantId: 0,
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    reservationDate: '',
    reservationTime: '',
    partySize: 2,
    specialRequests: '',
  });

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    setLoading(true);
    setError(null);
    
    const result = await apiService.getRestaurants();
    if (result.error) {
      setError(result.error);
    } else {
      // Handle both array and object responses
      const data = result.data;
      if (Array.isArray(data)) {
        setRestaurants(data);
      } else if (data && typeof data === 'object' && 'content' in data) {
        // Handle paginated response
        const paginatedData = data as any;
        setRestaurants(Array.isArray(paginatedData.content) ? paginatedData.content : []);
      } else if (data && typeof data === 'object') {
        // Handle single object response as array
        setRestaurants([data as Restaurant]);
      } else {
        setRestaurants([]);
      }
    }
    setLoading(false);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchRestaurants();
      return;
    }

    setLoading(true);
    const result = await apiService.searchRestaurants(searchQuery);
    if (result.error) {
      setError(result.error);
    } else {
      // Handle both array and object responses
      const data = result.data;
      if (Array.isArray(data)) {
        setRestaurants(data);
      } else if (data && typeof data === 'object' && 'content' in data) {
        const paginatedData = data as any;
        setRestaurants(Array.isArray(paginatedData.content) ? paginatedData.content : []);
      } else {
        setRestaurants([]);
      }
    }
    setLoading(false);
  };

  const handleCuisineFilter = async (cuisine: string) => {
    if (!cuisine) {
      fetchRestaurants();
      return;
    }

    setLoading(true);
    const result = await apiService.getRestaurantsByCuisine(cuisine);
    if (result.error) {
      setError(result.error);
    } else {
      // Handle both array and object responses
      const data = result.data;
      if (Array.isArray(data)) {
        setRestaurants(data);
      } else if (data && typeof data === 'object' && 'content' in data) {
        const paginatedData = data as any;
        setRestaurants(Array.isArray(paginatedData.content) ? paginatedData.content : []);
      } else {
        setRestaurants([]);
      }
    }
    setLoading(false);
  };

  const handleCityFilter = async (city: string) => {
    if (!city) {
      fetchRestaurants();
      return;
    }

    setLoading(true);
    const result = await apiService.getRestaurantsByCity(city);
    if (result.error) {
      setError(result.error);
    } else {
      // Handle both array and object responses
      const data = result.data;
      if (Array.isArray(data)) {
        setRestaurants(data);
      } else if (data && typeof data === 'object' && 'content' in data) {
        const paginatedData = data as any;
        setRestaurants(Array.isArray(paginatedData.content) ? paginatedData.content : []);
      } else if (data && typeof data === 'object') {
        // Handle single object response as array
        setRestaurants([data as Restaurant]);
      } else {
        setRestaurants([]);
      }
    }
    setLoading(false);
  };

  const handleOpenReservationDialog = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setReservationForm(prev => ({
      ...prev,
      restaurantId: restaurant.id!,
    }));
    setOpenReservationDialog(true);
  };

  const handleCloseReservationDialog = () => {
    setOpenReservationDialog(false);
    setSelectedRestaurant(null);
  };

  const handleReservationSubmit = async () => {
    try {
      const result = await apiService.createReservation(reservationForm);
      if (result.error) {
        setError(result.error);
      } else {
        alert('Reservation created successfully!');
        handleCloseReservationDialog();
        // Reset form
        setReservationForm({
          restaurantId: 0,
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          reservationDate: '',
          reservationTime: '',
          partySize: 2,
          specialRequests: '',
        });
      }
    } catch (error) {
      console.error('Error creating reservation:', error);
    }
  };

  const handleReservationInputChange = (field: keyof ReservationRequest, value: string | number) => {
    setReservationForm(prev => ({ ...prev, [field]: value }));
  };

  // Get unique cuisines and cities for filters
  const uniqueCuisines = [...new Set(restaurants.map(r => r.cuisine))];
  const uniqueCities = [...new Set(restaurants.map(r => r.city).filter(Boolean))];

  const getMinimumDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>Loading restaurants...</Typography>
      </Box>
    );
  }

  return (
    <ErrorBoundary>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          Find Your Perfect Restaurant
        </Typography>

        {/* Search and Filters */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              placeholder="Search restaurants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              select
              fullWidth
              label="Cuisine Type"
              value={selectedCuisine}
              onChange={(e) => {
                setSelectedCuisine(e.target.value);
                handleCuisineFilter(e.target.value);
              }}
            >
              <MenuItem value="">All Cuisines</MenuItem>
              {uniqueCuisines.map((cuisine) => (
                <MenuItem key={cuisine} value={cuisine}>
                  {cuisine}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              select
              fullWidth
              label="City"
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                handleCityFilter(e.target.value);
              }}
            >
              <MenuItem value="">All Cities</MenuItem>
              {uniqueCities.map((city) => (
                <MenuItem key={city} value={city}>
                  {city}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleSearch}
              sx={{ height: '56px' }}
            >
              Search
            </Button>
          </Grid>
        </Grid>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Restaurant Grid */}
        <Grid container spacing={3}>
          {restaurants.length === 0 ? (
            <Grid size={12}>
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 6 }}>
                  <RestaurantIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    No restaurants found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Try adjusting your search criteria
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ) : (
            restaurants.map((restaurant) => (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={restaurant.id}>
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Typography variant="h6" component="h2">
                        {restaurant.name}
                      </Typography>
                      <Chip 
                        label={restaurant.priceRange} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                    </Box>

                    <Box display="flex" alignItems="center" mb={1}>
                      <Typography variant="body2" color="primary" sx={{ fontWeight: 'medium' }}>
                        {restaurant.cuisine}
                      </Typography>
                      {restaurant.rating && (
                        <Box display="flex" alignItems="center" ml={2}>
                          <Rating value={restaurant.rating} readOnly size="small" />
                          <Typography variant="caption" sx={{ ml: 0.5 }}>
                            ({restaurant.rating})
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    <Box display="flex" alignItems="center" mb={1}>
                      <LocationOn sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
                      <Typography variant="body2" color="text.secondary">
                        {restaurant.address}
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" mb={1}>
                      <Phone sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
                      <Typography variant="body2" color="text.secondary">
                        {restaurant.phone}
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" mb={1}>
                      <People sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
                      <Typography variant="body2" color="text.secondary">
                        Capacity: {restaurant.capacity} guests
                      </Typography>
                    </Box>

                    {restaurant.openingHours && (
                      <Box display="flex" alignItems="center" mb={2}>
                        <Schedule sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
                        <Typography variant="body2" color="text.secondary">
                          {restaurant.openingHours}
                        </Typography>
                      </Box>
                    )}

                    {restaurant.description && (
                      <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                        {restaurant.description}
                      </Typography>
                    )}
                  </CardContent>
                  
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => handleOpenReservationDialog(restaurant)}
                      sx={{
                        bgcolor: '#1976d2',
                        '&:hover': { bgcolor: '#1565c0' },
                      }}
                    >
                      Make Reservation
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))
          )}
        </Grid>

        {/* Reservation Dialog */}
        <Dialog 
          open={openReservationDialog} 
          onClose={handleCloseReservationDialog} 
          maxWidth="md" 
          fullWidth
        >
          <DialogTitle>
            Make Reservation at {selectedRestaurant?.name}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Your Name"
                  value={reservationForm.customerName}
                  onChange={(e) => handleReservationInputChange('customerName', e.target.value)}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={reservationForm.customerEmail}
                  onChange={(e) => handleReservationInputChange('customerEmail', e.target.value)}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={reservationForm.customerPhone}
                  onChange={(e) => handleReservationInputChange('customerPhone', e.target.value)}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  select
                  fullWidth
                  label="Party Size"
                  value={reservationForm.partySize}
                  onChange={(e) => handleReservationInputChange('partySize', parseInt(e.target.value))}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((size) => (
                    <MenuItem key={size} value={size}>
                      {size} {size === 1 ? 'person' : 'people'}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  type="date"
                  label="Reservation Date"
                  value={reservationForm.reservationDate}
                  onChange={(e) => handleReservationInputChange('reservationDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: getMinimumDate() }}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  select
                  fullWidth
                  label="Reservation Time"
                  value={reservationForm.reservationTime}
                  onChange={(e) => handleReservationInputChange('reservationTime', e.target.value)}
                  required
                >
                  {['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'].map((time) => (
                    <MenuItem key={time} value={time}>
                      {time}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Special Requests"
                  value={reservationForm.specialRequests}
                  onChange={(e) => handleReservationInputChange('specialRequests', e.target.value)}
                  placeholder="Any dietary restrictions, special occasions, or other requests..."
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseReservationDialog}>Cancel</Button>
            <Button 
              onClick={handleReservationSubmit} 
              variant="contained"
              disabled={
                !reservationForm.customerName ||
                !reservationForm.customerEmail ||
                !reservationForm.customerPhone ||
                !reservationForm.reservationDate ||
                !reservationForm.reservationTime
              }
            >
              Make Reservation
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ErrorBoundary>
  );
};

export default RestaurantBrowser;