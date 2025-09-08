import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  Chip,
  Divider,
} from '@mui/material';
import {
  LocationOn,
  Phone,
  AccessTime,
} from '@mui/icons-material';

const SimpleHomePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);
  const [openModal, setOpenModal] = useState(false);

  // Mock restaurant data
  const restaurants = [
    {
      id: 1,
      name: "The Grand Dining",
      cuisine: "French",
      price: "$$$",
      location: "Midtown Manhattan",
      rating: 4.5,
      address: "123 5th Avenue, New York, NY 10001",
      phone: "(212) 555-0123",
      hours: "Mon-Fri: 11:30 AM - 10:00 PM\nSat-Sun: 10:00 AM - 11:00 PM",
      description: "An elegant French restaurant offering classic dishes with a modern twist. Known for their exceptional wine list and romantic ambiance.",
      features: ["Wine Bar", "Private Dining", "Outdoor Seating", "Valet Parking"]
    },
    {
      id: 2,
      name: "Sakura Sushi Bar",
      cuisine: "Japanese",
      price: "$$$$",
      location: "Upper East Side",
      rating: 4.8,
      address: "456 Park Avenue, New York, NY 10022",
      phone: "(212) 555-0456",
      hours: "Tue-Sun: 5:00 PM - 11:00 PM\nClosed Mondays",
      description: "Authentic Japanese cuisine featuring fresh sushi and sashimi flown in daily from Tokyo's Tsukiji market.",
      features: ["Sushi Bar", "Sake Selection", "Chef's Table", "Reservations Required"]
    },
    {
      id: 3,
      name: "Bella Italia",
      cuisine: "Italian",
      price: "$$",
      location: "Greenwich Village",
      rating: 4.3,
      address: "789 Bleecker Street, New York, NY 10014",
      phone: "(212) 555-0789",
      hours: "Daily: 12:00 PM - 11:00 PM",
      description: "Family-owned trattoria serving traditional Italian recipes passed down through generations. Cozy atmosphere perfect for date nights.",
      features: ["Wood-Fired Pizza", "Gluten-Free Options", "Live Music", "BYOB"]
    },
    {
      id: 4,
      name: "The Steakhouse",
      cuisine: "American",
      price: "$$$",
      location: "Financial District",
      rating: 4.6,
      address: "321 Wall Street, New York, NY 10005",
      phone: "(212) 555-0321",
      hours: "Mon-Fri: 11:00 AM - 11:00 PM\nSat-Sun: 4:00 PM - 12:00 AM",
      description: "Premium aged steaks and fresh seafood in a classic American steakhouse setting. Popular with the business crowd.",
      features: ["Dry-Aged Beef", "Raw Bar", "Extensive Wine List", "Business Dining"]
    }
  ];

  const handleFindRestaurants = () => {
    console.log('Find Restaurants clicked');
    navigate('/search');
  };

  const handleViewDetails = (id: number) => {
    console.log('View Details clicked for restaurant', id);
    const restaurant = restaurants.find(r => r.id === id);
    setSelectedRestaurant(restaurant);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedRestaurant(null);
  };
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1600)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            TableReserve
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
            Find your table for any occasion
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleFindRestaurants}
              sx={{
                bgcolor: '#DA3743',
                '&:hover': { bgcolor: '#B82E38' },
                px: 4,
                py: 1.5,
              }}
            >
              Find Restaurants
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/login')}
              sx={{
                color: 'white',
                borderColor: 'white',
                '&:hover': { 
                  borderColor: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)' 
                },
                px: 4,
                py: 1.5,
              }}
            >
              Restaurant Login
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Content Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
          Popular Restaurants
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {restaurants.map((restaurant) => (
            <Card 
              key={restaurant.id} 
              sx={{ 
                minWidth: 300, 
                flex: '1 1 300px',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
              onClick={() => {
                console.log('Card clicked for restaurant:', restaurant.id);
                handleViewDetails(restaurant.id);
              }}
            >
              <Box
                component="img"
                src={`https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=200&fit=crop`}
                alt={restaurant.name}
                sx={{ width: '100%', height: 200, objectFit: 'cover' }}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {restaurant.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {restaurant.cuisine} • {restaurant.price} • {restaurant.location}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Rating value={restaurant.rating} readOnly size="small" precision={0.1} />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    ({restaurant.rating})
                  </Typography>
                </Box>
                <Button 
                  variant="outlined" 
                  size="small" 
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('Button clicked for restaurant:', restaurant.id);
                    handleViewDetails(restaurant.id);
                  }}
                  sx={{ 
                    mt: 2, 
                    color: '#DA3743', 
                    borderColor: '#DA3743',
                    '&:hover': {
                      borderColor: '#DA3743',
                      backgroundColor: 'rgba(218, 55, 67, 0.08)'
                    },
                    zIndex: 1
                  }}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>

      {/* Restaurant Details Modal */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        {selectedRestaurant && (
          <>
            <DialogTitle>
              <Typography variant="h5" component="div" fontWeight="600">
                {selectedRestaurant.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Rating value={selectedRestaurant.rating} readOnly precision={0.1} />
                <Typography variant="body1" sx={{ ml: 1 }}>
                  ({selectedRestaurant.rating})
                </Typography>
              </Box>
            </DialogTitle>
            
            <DialogContent>
              <Box sx={{ mb: 2 }}>
                <Chip label={selectedRestaurant.cuisine} size="small" sx={{ mr: 1 }} />
                <Chip label={selectedRestaurant.price} size="small" />
              </Box>
              
              <Typography variant="body1" paragraph>
                {selectedRestaurant.description}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationOn fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">
                    {selectedRestaurant.address}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Phone fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">
                    {selectedRestaurant.phone}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                  <AccessTime fontSize="small" sx={{ mr: 1, color: 'text.secondary', mt: 0.5 }} />
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                    {selectedRestaurant.hours}
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Features
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {selectedRestaurant.features.map((feature: string, index: number) => (
                    <Chip key={index} label={feature} size="small" variant="outlined" />
                  ))}
                </Box>
              </Box>
            </DialogContent>
            
            <DialogActions>
              <Button onClick={handleCloseModal}>Close</Button>
              <Button 
                variant="contained" 
                onClick={() => {
                  handleCloseModal();
                  navigate('/search');
                }}
                sx={{ 
                  bgcolor: '#DA3743',
                  '&:hover': { bgcolor: '#B82E38' }
                }}
              >
                Make Reservation
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default SimpleHomePage;
