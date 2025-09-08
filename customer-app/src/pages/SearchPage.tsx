import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Chip,
  Rating,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  IconButton,
  Skeleton,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Restaurant as RestaurantIcon,
  FilterList as FilterIcon,
  Star as StarIcon,
  Schedule as ScheduleIcon,
  AttachMoney as PriceIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface Restaurant {
  id: string;
  name: string;
  cuisineType: string;
  address: string;
  city: string;
  rating: number;
  priceRange: number;
  imageUrl: string;
  description: string;
  openTime: string;
  closeTime: string;
  availableSlots: number;
  distance?: number;
}

const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    filterRestaurants();
  }, [searchQuery, selectedCuisine, selectedPriceRange, selectedRating, restaurants]);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8081/api/v1/restaurants/search');
      if (response.ok) {
        const data = await response.json();
        setRestaurants(data);
        setFilteredRestaurants(data);
      } else {
        // Use mock data if API fails
        const mockData = [
          {
            id: '1',
            name: 'The Italian Kitchen',
            cuisineType: 'Italian',
            address: '123 Main St',
            city: 'New York',
            rating: 4.5,
            priceRange: 3,
            imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
            description: 'Authentic Italian cuisine in a cozy atmosphere',
            openTime: '11:00',
            closeTime: '22:00',
            availableSlots: 5,
            distance: 0.5,
          },
          {
            id: '2',
            name: 'Sushi Palace',
            cuisineType: 'Japanese',
            address: '456 Oak Ave',
            city: 'New York',
            rating: 4.8,
            priceRange: 4,
            imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
            description: 'Fresh sushi and traditional Japanese dishes',
            openTime: '12:00',
            closeTime: '23:00',
            availableSlots: 3,
            distance: 1.2,
          },
          {
            id: '3',
            name: 'Garden Bistro',
            cuisineType: 'American',
            address: '789 Park Rd',
            city: 'New York',
            rating: 4.2,
            priceRange: 2,
            imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400',
            description: 'Farm-to-table American cuisine',
            openTime: '10:00',
            closeTime: '21:00',
            availableSlots: 8,
            distance: 2.1,
          },
          {
            id: '4',
            name: 'Spice Garden',
            cuisineType: 'Indian',
            address: '321 Curry Lane',
            city: 'New York',
            rating: 4.6,
            priceRange: 2,
            imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400',
            description: 'Authentic Indian flavors and spices',
            openTime: '11:30',
            closeTime: '22:30',
            availableSlots: 6,
            distance: 1.8,
          },
          {
            id: '5',
            name: 'Le Petit Café',
            cuisineType: 'French',
            address: '555 Bistro Blvd',
            city: 'New York',
            rating: 4.7,
            priceRange: 4,
            imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400',
            description: 'Classic French cuisine in an elegant setting',
            openTime: '17:00',
            closeTime: '23:00',
            availableSlots: 2,
            distance: 3.5,
          },
          {
            id: '6',
            name: 'Taco Fiesta',
            cuisineType: 'Mexican',
            address: '999 Salsa St',
            city: 'New York',
            rating: 4.3,
            priceRange: 1,
            imageUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400',
            description: 'Vibrant Mexican street food and cocktails',
            openTime: '11:00',
            closeTime: '24:00',
            availableSlots: 10,
            distance: 0.8,
          },
        ];
        setRestaurants(mockData);
        setFilteredRestaurants(mockData);
      }
    } catch (err) {
      setError('Failed to load restaurants');
      // Use mock data on error
      const mockData = [
        {
          id: '1',
          name: 'The Italian Kitchen',
          cuisineType: 'Italian',
          address: '123 Main St',
          city: 'New York',
          rating: 4.5,
          priceRange: 3,
          imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
          description: 'Authentic Italian cuisine in a cozy atmosphere',
          openTime: '11:00',
          closeTime: '22:00',
          availableSlots: 5,
        },
      ];
      setRestaurants(mockData);
      setFilteredRestaurants(mockData);
    } finally {
      setLoading(false);
    }
  };

  const filterRestaurants = () => {
    let filtered = [...restaurants];

    // Search query filter
    if (searchQuery) {
      filtered = filtered.filter(r =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.cuisineType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Cuisine filter
    if (selectedCuisine !== 'all') {
      filtered = filtered.filter(r => r.cuisineType === selectedCuisine);
    }

    // Price range filter
    if (selectedPriceRange !== 'all') {
      filtered = filtered.filter(r => r.priceRange === parseInt(selectedPriceRange));
    }

    // Rating filter
    if (selectedRating !== 'all') {
      filtered = filtered.filter(r => r.rating >= parseFloat(selectedRating));
    }

    setFilteredRestaurants(filtered);
  };

  const getCuisineTypes = () => {
    const types = new Set(restaurants.map(r => r.cuisineType));
    return Array.from(types);
  };

  const getPriceDisplay = (priceRange: number) => {
    return '$'.repeat(priceRange);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Search Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom align="center">
          Find Your Perfect Restaurant
        </Typography>
        <Typography variant="h6" color="text.secondary" align="center" gutterBottom>
          Discover and book the best restaurants in your area
        </Typography>
      </Box>

      {/* Search and Filters */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              placeholder="Search by name, cuisine, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Cuisine</InputLabel>
              <Select
                value={selectedCuisine}
                onChange={(e) => setSelectedCuisine(e.target.value)}
                label="Cuisine"
              >
                <MenuItem value="all">All Cuisines</MenuItem>
                {getCuisineTypes().map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Price Range</InputLabel>
              <Select
                value={selectedPriceRange}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
                label="Price Range"
              >
                <MenuItem value="all">All Prices</MenuItem>
                <MenuItem value="1">$ (Budget)</MenuItem>
                <MenuItem value="2">$$ (Moderate)</MenuItem>
                <MenuItem value="3">$$$ (Upscale)</MenuItem>
                <MenuItem value="4">$$$$ (Fine Dining)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Min Rating</InputLabel>
              <Select
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
                label="Min Rating"
              >
                <MenuItem value="all">All Ratings</MenuItem>
                <MenuItem value="4.5">4.5+ Stars</MenuItem>
                <MenuItem value="4">4+ Stars</MenuItem>
                <MenuItem value="3.5">3.5+ Stars</MenuItem>
                <MenuItem value="3">3+ Stars</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Results Summary */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          {filteredRestaurants.length} restaurants found
        </Typography>
        {error && (
          <Alert severity="info" onClose={() => setError('')}>
            {error}
          </Alert>
        )}
      </Box>

      {/* Restaurant Grid */}
      <Grid container spacing={3}>
        {loading ? (
          // Loading skeletons
          Array.from(new Array(6)).map((_, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Card>
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                  <Skeleton variant="text" height={32} />
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" />
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : filteredRestaurants.length > 0 ? (
          filteredRestaurants.map((restaurant) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={restaurant.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3,
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={restaurant.imageUrl}
                  alt={restaurant.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {restaurant.name}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                    <Chip 
                      label={restaurant.cuisineType} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                    <Chip 
                      label={getPriceDisplay(restaurant.priceRange)} 
                      size="small" 
                      color="secondary" 
                      variant="outlined"
                    />
                    {restaurant.availableSlots > 0 && (
                      <Chip 
                        label={`${restaurant.availableSlots} slots`} 
                        size="small" 
                        color="success"
                      />
                    )}
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating value={restaurant.rating} readOnly size="small" />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {restaurant.rating}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {restaurant.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationIcon fontSize="small" color="action" />
                      <Typography variant="caption" sx={{ ml: 0.5 }}>
                        {restaurant.distance ? `${restaurant.distance} mi` : restaurant.address}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <ScheduleIcon fontSize="small" color="action" />
                      <Typography variant="caption" sx={{ ml: 0.5 }}>
                        {restaurant.openTime} - {restaurant.closeTime}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
                
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button 
                    fullWidth 
                    variant="contained"
                    onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                    disabled={restaurant.availableSlots === 0}
                  >
                    {restaurant.availableSlots > 0 ? 'View Details' : 'Fully Booked'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid size={12}>
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <RestaurantIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No restaurants found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search filters or search query
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default SearchPage;