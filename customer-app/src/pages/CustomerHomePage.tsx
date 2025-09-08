import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Grid,
  Rating,
  Chip,
  InputAdornment,
  Paper,
  Skeleton,
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn,
  Restaurant as RestaurantIcon,
  AccessTime,
  FilterList,
  Collections,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { apiService, Restaurant } from '../services/api';

const CustomerHomePage: React.FC = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('');

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    filterRestaurants();
  }, [searchQuery, selectedCuisine, selectedPriceRange, restaurants]);

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const result = await apiService.getRestaurants();
      if (!result.error && result.data) {
        // Handle both array and object responses
        const data = result.data;
        let restaurantsList: Restaurant[] = [];
        
        if (Array.isArray(data)) {
          restaurantsList = data;
        } else if (data && typeof data === 'object' && 'content' in data) {
          // Handle paginated response
          const paginatedData = data as any;
          restaurantsList = Array.isArray(paginatedData.content) ? paginatedData.content : [];
        } else if (data && typeof data === 'object') {
          // Handle single object response as array
          restaurantsList = [data as Restaurant];
        }
        
        setRestaurants(restaurantsList);
        setFilteredRestaurants(restaurantsList);
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      setRestaurants([]);
      setFilteredRestaurants([]);
    }
    setLoading(false);
  };

  const filterRestaurants = () => {
    let filtered = [...restaurants];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Cuisine filter
    if (selectedCuisine) {
      filtered = filtered.filter((r) => r.cuisine === selectedCuisine);
    }

    // Price range filter
    if (selectedPriceRange) {
      filtered = filtered.filter((r) => r.priceRange === selectedPriceRange);
    }

    setFilteredRestaurants(filtered);
  };

  const handleRestaurantClick = (restaurantId: number) => {
    navigate(`/restaurant/${restaurantId}`);
  };

  const handleQuickReservation = (restaurantId: number) => {
    navigate(`/book/${restaurantId}`);
  };

  const uniqueCuisines = [...new Set(Array.isArray(restaurants) ? restaurants.map((r) => r.cuisine) : [])];
  const priceRanges = ['$', '$$', '$$$', '$$$$'];

  // Generate placeholder image based on cuisine
  const getRestaurantImage = (cuisine: string) => {
    const images: { [key: string]: string } = {
      Italian: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop',
      Japanese: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop',
      Mexican: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop',
      Indian: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
      Chinese: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&h=300&fit=crop',
      American: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=300&fit=crop',
      French: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
      Thai: 'https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=400&h=300&fit=crop',
    };
    return images[cuisine] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop';
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 8,
          mb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Find Your Perfect Dining Experience
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.95 }}>
            Discover and book the best restaurants in your area
          </Typography>

          {/* Search Bar */}
          <Paper
            elevation={3}
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: 'white',
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  placeholder="Search restaurants, cuisines, or locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& fieldset': { border: 'none' } }}
                />
              </Grid>
              <Grid size={{ xs: 6, md: 2 }}>
                <TextField
                  select
                  fullWidth
                  value={selectedCuisine}
                  onChange={(e) => setSelectedCuisine(e.target.value)}
                  placeholder="Cuisine"
                  SelectProps={{
                    native: true,
                  }}
                  sx={{ '& fieldset': { border: 'none' } }}
                >
                  <option value="">All Cuisines</option>
                  {uniqueCuisines.map((cuisine) => (
                    <option key={cuisine} value={cuisine}>
                      {cuisine}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid size={{ xs: 6, md: 2 }}>
                <TextField
                  select
                  fullWidth
                  value={selectedPriceRange}
                  onChange={(e) => setSelectedPriceRange(e.target.value)}
                  SelectProps={{
                    native: true,
                  }}
                  sx={{ '& fieldset': { border: 'none' } }}
                >
                  <option value="">All Prices</option>
                  {priceRanges.map((range) => (
                    <option key={range} value={range}>
                      {range}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, md: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<FilterList />}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a67d8 0%, #6b4299 100%)',
                    },
                  }}
                >
                  Filter
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>

      {/* Restaurant Grid */}
      <Container maxWidth="lg" sx={{ pb: 6 }}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold' }}>
            {selectedCuisine || selectedPriceRange || searchQuery
              ? `Found ${Array.isArray(filteredRestaurants) ? filteredRestaurants.length : 0} restaurants`
              : 'Popular Restaurants'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {Array.isArray(filteredRestaurants) ? filteredRestaurants.length : 0} restaurants available
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {loading ? (
            // Loading skeletons
            [...Array(6)].map((_, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <Card>
                  <Skeleton variant="rectangular" height={200} />
                  <CardContent>
                    <Skeleton variant="text" sx={{ fontSize: '1.5rem' }} />
                    <Skeleton variant="text" />
                    <Skeleton variant="text" />
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : !Array.isArray(filteredRestaurants) || filteredRestaurants.length === 0 ? (
            <Grid size={12}>
              <Paper sx={{ p: 6, textAlign: 'center' }}>
                <RestaurantIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  No restaurants found
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Try adjusting your filters or search terms
                </Typography>
              </Paper>
            </Grid>
          ) : (
            Array.isArray(filteredRestaurants) && filteredRestaurants.map((restaurant) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={restaurant.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6,
                    },
                  }}
                  onClick={() => handleRestaurantClick(restaurant.id!)}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={restaurant.imageUrl || getRestaurantImage(restaurant.cuisine)}
                      alt={restaurant.name}
                      sx={{ objectFit: 'cover' }}
                    />
                    {restaurant.gallery && restaurant.gallery.length > 0 && (
                      <Chip
                        icon={<Collections />}
                        label={`${restaurant.gallery.length} Photos`}
                        size="small"
                        sx={{
                          position: 'absolute',
                          bottom: 8,
                          right: 8,
                          backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          color: 'white',
                          '& .MuiChip-icon': {
                            color: 'white',
                          },
                        }}
                      />
                    )}
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
                        {restaurant.name}
                      </Typography>
                      <Chip
                        label={restaurant.priceRange}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Rating
                        value={restaurant.rating || 4.5}
                        readOnly
                        precision={0.5}
                        size="small"
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        ({restaurant.rating || 4.5})
                      </Typography>
                    </Box>

                    <Typography variant="body2" color="primary" sx={{ mb: 1 }}>
                      {restaurant.cuisine} Cuisine
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOn sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {restaurant.address}
                      </Typography>
                    </Box>

                    {restaurant.openingHours && (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccessTime sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
                        <Typography variant="body2" color="text.secondary">
                          {restaurant.openingHours}
                        </Typography>
                      </Box>
                    )}

                    {restaurant.description && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mt: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {restaurant.description}
                      </Typography>
                    )}
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickReservation(restaurant.id!);
                      }}
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5a67d8 0%, #6b4299 100%)',
                        },
                      }}
                    >
                      Reserve Table
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default CustomerHomePage;