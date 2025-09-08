import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Rating,
  Chip,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tabs,
  Tab,
  Alert,
} from '@mui/material';
import {
  ArrowBack,
  LocationOn,
  Phone,
  Email,
  AccessTime,
  Restaurant as RestaurantIcon,
  AttachMoney,
  People,
  Star,
  Favorite,
  FavoriteBorder,
  Share,
  Info,
  MenuBook,
  Reviews,
} from '@mui/icons-material';
import { apiService, Restaurant } from '../services/api';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const CustomerRestaurantDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    if (id) {
      fetchRestaurantDetails(parseInt(id));
    }
  }, [id]);

  const fetchRestaurantDetails = async (restaurantId: number) => {
    setLoading(true);
    try {
      const result = await apiService.getRestaurant(restaurantId);
      if (result.error) {
        setError(result.error);
      } else {
        setRestaurant(result.data || null);
      }
    } catch (error) {
      setError('Failed to load restaurant details');
    }
    setLoading(false);
  };

  const handleReservation = () => {
    navigate(`/book/${id}`);
  };

  const handleBack = () => {
    navigate('/');
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: restaurant?.name,
        text: `Check out ${restaurant?.name} - ${restaurant?.cuisine} cuisine`,
        url: window.location.href,
      });
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Loading restaurant details...</Typography>
      </Container>
    );
  }

  if (error || !restaurant) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error || 'Restaurant not found'}</Alert>
        <Button startIcon={<ArrowBack />} onClick={handleBack} sx={{ mt: 2 }}>
          Back to Restaurants
        </Button>
      </Container>
    );
  }

  // Generate placeholder image based on cuisine
  const getRestaurantImage = (cuisine: string) => {
    const images: { [key: string]: string } = {
      Italian: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=400&fit=crop',
      Japanese: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=400&fit=crop',
      Mexican: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&h=400&fit=crop',
      Indian: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=400&fit=crop',
      Chinese: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&h=400&fit=crop',
      American: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&h=400&fit=crop',
      French: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=400&fit=crop',
      Thai: 'https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=800&h=400&fit=crop',
    };
    return images[cuisine] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop';
  };

  const menuItems = [
    { category: 'Appetizers', items: ['Bruschetta', 'Calamari', 'Caesar Salad'] },
    { category: 'Main Courses', items: ['Grilled Salmon', 'Ribeye Steak', 'Pasta Primavera'] },
    { category: 'Desserts', items: ['Tiramisu', 'Cheesecake', 'Gelato'] },
  ];

  const reviews = [
    { name: 'John D.', rating: 5, comment: 'Amazing food and great atmosphere!', date: '2 days ago' },
    { name: 'Sarah M.', rating: 4, comment: 'Good service, will definitely come back.', date: '1 week ago' },
    { name: 'Mike R.', rating: 5, comment: 'Best restaurant in town!', date: '2 weeks ago' },
  ];

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Hero Image Section */}
      <Box
        sx={{
          height: 400,
          backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(${
            restaurant.imageUrl || getRestaurantImage(restaurant.cuisine)
          })`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        <Container maxWidth="lg">
          <Button
            startIcon={<ArrowBack />}
            onClick={handleBack}
            sx={{
              position: 'absolute',
              top: 20,
              left: 20,
              bgcolor: 'white',
              '&:hover': { bgcolor: 'grey.100' },
            }}
          >
            Back
          </Button>

          <Box sx={{ pb: 4, color: 'white' }}>
            <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold', mb: 2 }}>
              {restaurant.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Chip
                label={restaurant.cuisine}
                icon={<RestaurantIcon />}
                sx={{ bgcolor: 'white', color: 'primary.main' }}
              />
              <Chip
                label={restaurant.priceRange}
                icon={<AttachMoney />}
                sx={{ bgcolor: 'white', color: 'primary.main' }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Rating value={restaurant.rating || 4.5} readOnly precision={0.5} />
                <Typography sx={{ ml: 1 }}>({restaurant.rating || 4.5})</Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h5" component="h2">
                    About {restaurant.name}
                  </Typography>
                  <Box>
                    <IconButton onClick={toggleFavorite}>
                      {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
                    </IconButton>
                    <IconButton onClick={handleShare}>
                      <Share />
                    </IconButton>
                  </Box>
                </Box>
                <Typography variant="body1" paragraph>
                  {restaurant.description ||
                    `Welcome to ${restaurant.name}, where we serve authentic ${restaurant.cuisine} cuisine in a warm and inviting atmosphere. Our expert chefs use only the freshest ingredients to create memorable dining experiences.`}
                </Typography>
              </CardContent>
            </Card>

            {/* Tabs Section */}
            <Card>
              <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tab label="Information" icon={<Info />} iconPosition="start" />
                <Tab label="Menu" icon={<MenuBook />} iconPosition="start" />
                <Tab label="Reviews" icon={<Reviews />} iconPosition="start" />
              </Tabs>

              <CardContent>
                <TabPanel value={tabValue} index={0}>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <LocationOn color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Address"
                        secondary={restaurant.address}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Phone color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Phone"
                        secondary={restaurant.phone}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Email color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Email"
                        secondary={restaurant.email}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <AccessTime color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Opening Hours"
                        secondary={restaurant.openingHours || 'Mon-Sun: 11:00 AM - 10:00 PM'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <People color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Capacity"
                        secondary={`${restaurant.capacity} guests`}
                      />
                    </ListItem>
                  </List>
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                  {menuItems.map((section) => (
                    <Box key={section.category} sx={{ mb: 3 }}>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                        {section.category}
                      </Typography>
                      <List dense>
                        {section.items.map((item) => (
                          <ListItem key={item}>
                            <ListItemText primary={item} />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  ))}
                </TabPanel>

                <TabPanel value={tabValue} index={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Rating value={restaurant.rating || 4.5} readOnly precision={0.5} size="large" />
                    <Typography variant="h6" sx={{ ml: 2 }}>
                      {restaurant.rating || 4.5} out of 5
                    </Typography>
                  </Box>
                  {reviews.map((review, index) => (
                    <Paper key={index} sx={{ p: 2, mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {review.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {review.date}
                        </Typography>
                      </Box>
                      <Rating value={review.rating} readOnly size="small" sx={{ mb: 1 }} />
                      <Typography variant="body2">{review.comment}</Typography>
                    </Paper>
                  ))}
                </TabPanel>
              </CardContent>
            </Card>
          </Grid>

          {/* Sidebar - Reservation Card */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ position: 'sticky', top: 20 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Make a Reservation
                </Typography>
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Available Times Today
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                    {['5:30 PM', '6:00 PM', '7:30 PM', '8:00 PM'].map((time) => (
                      <Chip
                        key={time}
                        label={time}
                        clickable
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                    ))}
                  </Box>
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleReservation}
                  sx={{
                    py: 1.5,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a67d8 0%, #6b4299 100%)',
                    },
                  }}
                >
                  Reserve Your Table
                </Button>

                <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Star sx={{ fontSize: 16, mr: 0.5, color: 'warning.main' }} />
                    Popular restaurant - Book early!
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <People sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                    87 reservations today
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CustomerRestaurantDetails;