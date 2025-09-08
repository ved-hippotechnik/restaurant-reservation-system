import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Rating,
  Chip,
} from '@mui/material';
import {
  LocationOn,
  CalendarToday,
  People,
  Search as SearchIcon,
  AccessTime,
  Restaurant as RestaurantIcon,
} from '@mui/icons-material';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '19:00',
    partySize: 2,
    location: '',
  });

  // Featured restaurants (would come from API)
  const featuredRestaurants = [
    {
      id: 1,
      name: "The Grand Dining",
      cuisine: "French",
      rating: 4.5,
      priceRange: "$$$",
      location: "Midtown Manhattan",
      image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400",
      availableSlots: ["6:00 PM", "6:30 PM", "8:00 PM", "8:30 PM"],
    },
    {
      id: 2,
      name: "Sakura Sushi Bar",
      cuisine: "Japanese",
      rating: 4.8,
      priceRange: "$$$$",
      location: "Upper East Side",
      image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400",
      availableSlots: ["7:00 PM", "7:30 PM", "9:00 PM"],
    },
    {
      id: 3,
      name: "Bella Italia",
      cuisine: "Italian",
      rating: 4.3,
      priceRange: "$$",
      location: "Greenwich Village",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400",
      availableSlots: ["5:30 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM"],
    },
    {
      id: 4,
      name: "The Steakhouse",
      cuisine: "American",
      rating: 4.6,
      priceRange: "$$$",
      location: "Financial District",
      image: "https://images.unsplash.com/photo-1558030006-450675393462?w=400",
      availableSlots: ["6:30 PM", "7:30 PM", "8:30 PM"],
    },
  ];

  const handleSearch = () => {
    navigate('/search', { state: searchData });
  };

  const handleRestaurantClick = (restaurantId: number) => {
    navigate(`/restaurant/${restaurantId}`);
  };

  const handleTimeSlotClick = (restaurantId: number, time: string) => {
    navigate(`/book/${restaurantId}`, { 
      state: { 
        ...searchData, 
        time: time.replace(' PM', '').replace(' AM', '') 
      } 
    });
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          py: { xs: 6, sm: 8, md: 10 },
          px: { xs: 2, sm: 0 },
        }}
      >
        <Container maxWidth="lg">
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom 
            fontWeight="700" 
            textAlign="center"
            sx={{ 
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3.75rem' },
              mb: { xs: 2, sm: 3 }
            }}
          >
            Find & Book the Best Restaurants
          </Typography>
          <Typography 
            variant="h5" 
            textAlign="center" 
            sx={{ 
              mb: { xs: 3, sm: 5 },
              fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
              px: { xs: 2, sm: 0 }
            }}
          >
            Discover and reserve tables at top-rated restaurants near you
          </Typography>

          {/* Search Form */}
          <Paper elevation={3} sx={{ 
            p: { xs: 2, sm: 3 }, 
            borderRadius: 2, 
            maxWidth: 900, 
            mx: 'auto',
            width: '100%'
          }}>
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 12, md: 3 }}>
                <TextField
                  fullWidth
                  type="date"
                  label="Date"
                  value={searchData.date}
                  onChange={(e) => setSearchData({ ...searchData, date: e.target.value })}
                  InputLabelProps={{ shrink: true }}
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
                  fullWidth
                  type="time"
                  label="Time"
                  value={searchData.time}
                  onChange={(e) => setSearchData({ ...searchData, time: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccessTime fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid size={{ xs: 6, md: 2 }}>
                <TextField
                  select
                  fullWidth
                  label="Party Size"
                  value={searchData.partySize}
                  onChange={(e) => setSearchData({ ...searchData, partySize: Number(e.target.value) })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <People fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((size) => (
                    <MenuItem key={size} value={size}>
                      {size} {size === 1 ? 'Guest' : 'Guests'}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <TextField
                  fullWidth
                  placeholder="Location or Restaurant"
                  value={searchData.location}
                  onChange={(e) => setSearchData({ ...searchData, location: e.target.value })}
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
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleSearch}
                  startIcon={<SearchIcon />}
                  sx={{
                    height: 56,
                    bgcolor: '#DA3743',
                    '&:hover': { bgcolor: '#B82E38' },
                  }}
                >
                  Search
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>

      {/* Featured Restaurants */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, sm: 6, md: 8 } }}>
        <Typography 
          variant="h3" 
          component="h2" 
          gutterBottom 
          fontWeight="600"
          sx={{ fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' } }}
        >
          Popular Restaurants Near You
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Book a table at trending restaurants
        </Typography>

        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {featuredRestaurants.map((restaurant) => (
            <Grid size={{ xs: 12, sm: 6, lg: 6 }} key={restaurant.id}>
              <Card 
                sx={{ 
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
                onClick={() => handleRestaurantClick(restaurant.id)}
                tabIndex={0}
                role="article"
                aria-label={`${restaurant.name} restaurant, ${restaurant.cuisine} cuisine, rated ${restaurant.rating} stars`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleRestaurantClick(restaurant.id);
                  }
                }}
              >
                <CardMedia
                  component="img"
                  sx={{ 
                    width: { xs: '100%', sm: 200 }, 
                    height: { xs: 200, sm: 200 },
                    objectFit: 'cover'
                  }}
                  image={restaurant.image}
                  alt={restaurant.name}
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <CardContent sx={{ flex: '1 0 auto' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                      <Typography component="h5" variant="h5">
                        {restaurant.name}
                      </Typography>
                      <Chip 
                        label={restaurant.priceRange} 
                        size="small" 
                        sx={{ bgcolor: '#f5f5f5' }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Rating value={restaurant.rating} readOnly size="small" precision={0.1} />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        ({restaurant.rating})
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {restaurant.cuisine} • {restaurant.location}
                    </Typography>
                    
                    {/* Available Time Slots */}
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                        Available tonight:
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {restaurant.availableSlots.slice(0, 4).map((slot) => (
                          <Button
                            key={slot}
                            size="small"
                            variant="outlined"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTimeSlotClick(restaurant.id, slot);
                            }}
                            aria-label={`Book table at ${restaurant.name} for ${slot}`}
                            sx={{
                              borderColor: 'primary.main',
                              color: 'primary.main',
                              '&:hover': {
                                borderColor: 'primary.dark',
                                bgcolor: 'rgba(196, 30, 58, 0.08)',
                              },
                              minWidth: '80px',
                              minHeight: '44px', // WCAG minimum touch target
                            }}
                          >
                            {slot}
                          </Button>
                        ))}
                      </Box>
                    </Box>
                  </CardContent>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* How It Works */}
      <Box sx={{ bgcolor: '#f5f5f5', py: { xs: 4, sm: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h3" 
            component="h2" 
            gutterBottom 
            fontWeight="600" 
            textAlign="center"
            sx={{ fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' } }}
          >
            How It Works
          </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid size={{ xs: 12, md: 4 }} textAlign="center">
              <SearchIcon sx={{ fontSize: 60, color: '#DA3743', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Search
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Find restaurants by location, cuisine, or name. Filter by date, time, and party size.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }} textAlign="center">
              <RestaurantIcon sx={{ fontSize: 60, color: '#DA3743', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Choose
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Browse menus, photos, and reviews. Pick your perfect table and time slot.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }} textAlign="center">
              <CalendarToday sx={{ fontSize: 60, color: '#DA3743', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Book
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Reserve instantly with confirmation. Get reminders and manage your bookings.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;