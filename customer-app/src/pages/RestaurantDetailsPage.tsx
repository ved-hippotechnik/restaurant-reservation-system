import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Chip,
  Rating,
  Tabs,
  Tab,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  TextField,
  IconButton,
  ImageList,
  ImageListItem,
  Breadcrumbs,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Schedule as ScheduleIcon,
  Restaurant as RestaurantIcon,
  Star as StarIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
  NavigateNext as NavigateNextIcon,
  AttachMoney as PriceIcon,
  LocalParking as ParkingIcon,
  Wifi as WifiIcon,
  AcUnit as AcIcon,
  EventAvailable as ReserveIcon,
  Groups as GroupsIcon,
  AccessTime as TimeIcon,
  Collections as CollectionsIcon,
  Close as CloseIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface Restaurant {
  id: string;
  name: string;
  cuisineType: string;
  description: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  website: string;
  rating: number;
  totalReviews: number;
  priceRange: number;
  images: string[];
  gallery?: string[]; // Gallery of restaurant images
  openTime: string;
  closeTime: string;
  amenities: string[];
  capacity: number;
  menu?: {
    category: string;
    items: { name: string; price: number; description: string }[];
  }[];
  reviews?: {
    id: string;
    userName: string;
    rating: number;
    date: string;
    comment: string;
  }[];
}

const RestaurantDetailsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openReservation, setOpenReservation] = useState(false);
  const [openGallery, setOpenGallery] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Reservation form state
  const [reservationDate, setReservationDate] = useState<Date | null>(new Date());
  const [reservationTime, setReservationTime] = useState<Date | null>(new Date());
  const [partySize, setPartySize] = useState(2);
  const [specialRequests, setSpecialRequests] = useState('');

  useEffect(() => {
    fetchRestaurantDetails();
  }, [id]);

  const fetchRestaurantDetails = async () => {
    try {
      setLoading(true);
      // Mock data for demonstration
      const mockData: Restaurant = {
        id: id || '1',
        name: 'The Italian Kitchen',
        cuisineType: 'Italian',
        description: 'Experience authentic Italian cuisine in our warm and inviting restaurant. Our chefs use only the finest ingredients imported directly from Italy to create traditional dishes with a modern twist.',
        address: '123 Main Street',
        city: 'New York, NY 10001',
        phone: '+1 (555) 123-4567',
        email: 'info@italiankitchen.com',
        website: 'www.italiankitchen.com',
        rating: 4.5,
        totalReviews: 342,
        priceRange: 3,
        images: [
          'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
          'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
          'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800',
          'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
        ],
        gallery: [
          'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
          'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
          'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800',
          'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
          'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800',
          'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800',
          'https://images.unsplash.com/photo-1570560258879-af7f8e1447ac?w=800',
          'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800',
        ],
        openTime: '11:00',
        closeTime: '22:00',
        amenities: ['WiFi', 'Parking', 'Air Conditioning', 'Outdoor Seating', 'Private Dining', 'Bar'],
        capacity: 120,
        menu: [
          {
            category: 'Appetizers',
            items: [
              { name: 'Bruschetta', price: 12, description: 'Toasted bread with tomatoes and basil' },
              { name: 'Calamari Fritti', price: 15, description: 'Fried squid with marinara sauce' },
              { name: 'Caprese Salad', price: 14, description: 'Fresh mozzarella, tomatoes, and basil' },
            ],
          },
          {
            category: 'Main Courses',
            items: [
              { name: 'Spaghetti Carbonara', price: 22, description: 'Classic Roman pasta with eggs and pancetta' },
              { name: 'Osso Buco', price: 38, description: 'Braised veal shanks with risotto' },
              { name: 'Margherita Pizza', price: 18, description: 'Traditional pizza with tomato, mozzarella, and basil' },
            ],
          },
          {
            category: 'Desserts',
            items: [
              { name: 'Tiramisu', price: 10, description: 'Classic Italian coffee-flavored dessert' },
              { name: 'Panna Cotta', price: 9, description: 'Silky custard with berry sauce' },
              { name: 'Gelato', price: 8, description: 'Selection of homemade Italian ice cream' },
            ],
          },
        ],
        reviews: [
          {
            id: '1',
            userName: 'John Doe',
            rating: 5,
            date: '2024-01-10',
            comment: 'Amazing food and excellent service! The pasta was perfectly cooked and the atmosphere was wonderful.',
          },
          {
            id: '2',
            userName: 'Jane Smith',
            rating: 4,
            date: '2024-01-08',
            comment: 'Great Italian restaurant with authentic dishes. The only downside was the wait time, but it was worth it.',
          },
          {
            id: '3',
            userName: 'Mike Johnson',
            rating: 5,
            date: '2024-01-05',
            comment: 'Best Italian food in the city! The osso buco was incredible and the wine selection is outstanding.',
          },
        ],
      };
      setRestaurant(mockData);
    } catch (error) {
      console.error('Failed to fetch restaurant details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReservation = () => {
    // Handle reservation logic
    navigate(`/book/${restaurant?.id}`);
    setOpenReservation(false);
  };

  const getPriceDisplay = (priceRange: number) => {
    return '$'.repeat(priceRange);
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi':
        return <WifiIcon />;
      case 'parking':
        return <ParkingIcon />;
      case 'air conditioning':
        return <AcIcon />;
      default:
        return <RestaurantIcon />;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (!restaurant) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Restaurant not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 2 }}>
        <Link
          underline="hover"
          color="inherit"
          href="/"
          onClick={(e) => {
            e.preventDefault();
            navigate('/');
          }}
        >
          Home
        </Link>
        <Link
          underline="hover"
          color="inherit"
          href="/search"
          onClick={(e) => {
            e.preventDefault();
            navigate('/search');
          }}
        >
          Search
        </Link>
        <Typography color="text.primary">{restaurant.name}</Typography>
      </Breadcrumbs>

      {/* Header Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h3" gutterBottom>
                  {restaurant.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Chip label={restaurant.cuisineType} color="primary" />
                  <Chip label={getPriceDisplay(restaurant.priceRange)} color="secondary" />
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Rating value={restaurant.rating} readOnly />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {restaurant.rating} ({restaurant.totalReviews} reviews)
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body1" color="text.secondary" paragraph>
                  {restaurant.description}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton onClick={() => setIsFavorite(!isFavorite)} color="error">
                  {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
                <IconButton>
                  <ShareIcon />
                </IconButton>
              </Box>
            </Box>

            {/* Contact Information */}
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationIcon color="action" />
                  <Box>
                    <Typography variant="body2">{restaurant.address}</Typography>
                    <Typography variant="body2">{restaurant.city}</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PhoneIcon color="action" />
                  <Typography variant="body2">{restaurant.phone}</Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ScheduleIcon color="action" />
                  <Typography variant="body2">
                    Open: {restaurant.openTime} - {restaurant.closeTime}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <GroupsIcon color="action" />
                  <Typography variant="body2">
                    Capacity: {restaurant.capacity} guests
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quick Reservation
                </Typography>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<ReserveIcon />}
                  onClick={() => setOpenReservation(true)}
                  sx={{ mb: 2 }}
                >
                  Reserve a Table
                </Button>
                <Typography variant="body2" color="text.secondary" align="center">
                  Free cancellation up to 4 hours before
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" gutterBottom>
                  Amenities
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {restaurant.amenities.map(amenity => (
                    <Chip
                      key={amenity}
                      icon={getAmenityIcon(amenity)}
                      label={amenity}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Image Gallery */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">
            Gallery
          </Typography>
          {restaurant.gallery && restaurant.gallery.length > 0 && (
            <Chip
              icon={<CollectionsIcon />}
              label={`${restaurant.gallery.length} Photos`}
              color="primary"
              variant="outlined"
            />
          )}
        </Box>
        <ImageList 
          sx={{ height: 400 }} 
          cols={window.innerWidth < 600 ? 2 : window.innerWidth < 960 ? 3 : 4} 
          rowHeight={200}
        >
          {(restaurant.gallery || restaurant.images).map((image, index) => (
            <ImageListItem 
              key={index}
              sx={{ cursor: 'pointer' }}
              onClick={() => {
                setCurrentImageIndex(index);
                setOpenGallery(true);
              }}
            >
              <Box
                component="img"
                src={image}
                alt={`${restaurant.name} ${index + 1}`}
                loading="lazy"
                sx={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'scale(1.05)'
                  }
                }}
              />
            </ImageListItem>
          ))}
        </ImageList>
      </Paper>

      {/* Tabs Section */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="Menu" />
          <Tab label="Reviews" />
          <Tab label="About" />
        </Tabs>

        {/* Menu Tab */}
        {tabValue === 0 && (
          <Box sx={{ p: 3 }}>
            {restaurant.menu?.map((category) => (
              <Box key={category.category} sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                  {category.category}
                </Typography>
                <List>
                  {category.items.map((item, index) => (
                    <React.Fragment key={item.name}>
                      <ListItem>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="subtitle1">{item.name}</Typography>
                              <Typography variant="subtitle1" color="primary">
                                ${item.price}
                              </Typography>
                            </Box>
                          }
                          secondary={item.description}
                        />
                      </ListItem>
                      {index < category.items.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </Box>
            ))}
          </Box>
        )}

        {/* Reviews Tab */}
        {tabValue === 1 && (
          <Box sx={{ p: 3 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Customer Reviews
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Rating value={restaurant.rating} readOnly size="large" />
                <Typography variant="h5">
                  {restaurant.rating} out of 5
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Based on {restaurant.totalReviews} reviews
                </Typography>
              </Box>
            </Box>
            <List>
              {restaurant.reviews?.map((review) => (
                <React.Fragment key={review.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar>{review.userName[0]}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="subtitle1">{review.userName}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(review.date).toLocaleDateString()}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <>
                          <Rating value={review.rating} readOnly size="small" />
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {review.comment}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
          </Box>
        )}

        {/* About Tab */}
        {tabValue === 2 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              About {restaurant.name}
            </Typography>
            <Typography variant="body1" paragraph>
              {restaurant.description}
            </Typography>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Contact Information
                </Typography>
                <Typography variant="body2">Phone: {restaurant.phone}</Typography>
                <Typography variant="body2">Email: {restaurant.email}</Typography>
                <Typography variant="body2">Website: {restaurant.website}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Location
                </Typography>
                <Typography variant="body2">{restaurant.address}</Typography>
                <Typography variant="body2">{restaurant.city}</Typography>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      {/* Reservation Dialog */}
      <Dialog open={openReservation} onClose={() => setOpenReservation(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Make a Reservation</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <DatePicker
                  label="Date"
                  value={reservationDate}
                  onChange={(newValue) => setReservationDate(newValue)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TimePicker
                  label="Time"
                  value={reservationTime}
                  onChange={(newValue) => setReservationTime(newValue)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid size={12}>
                <FormControl fullWidth>
                  <InputLabel>Party Size</InputLabel>
                  <Select
                    value={partySize}
                    onChange={(e) => setPartySize(e.target.value as number)}
                    label="Party Size"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(size => (
                      <MenuItem key={size} value={size}>
                        {size} {size === 1 ? 'Guest' : 'Guests'}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Special Requests (Optional)"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                />
              </Grid>
            </Grid>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReservation(false)}>Cancel</Button>
          <Button onClick={handleReservation} variant="contained">
            Confirm Reservation
          </Button>
        </DialogActions>
      </Dialog>

      {/* Gallery Modal */}
      <Dialog
        open={openGallery}
        onClose={() => setOpenGallery(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            m: 0,
            maxHeight: '100vh',
          }
        }}
      >
        <DialogTitle sx={{ p: 0 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            p: 2,
            color: 'white'
          }}>
            <Typography variant="h6">
              {currentImageIndex + 1} / {(restaurant?.gallery || restaurant?.images || []).length}
            </Typography>
            <IconButton onClick={() => setOpenGallery(false)} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ 
          p: 0, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          position: 'relative',
          minHeight: '400px'
        }}>
          {restaurant && (
            <>
              <IconButton
                onClick={() => {
                  const images = restaurant.gallery || restaurant.images;
                  setCurrentImageIndex((prev) => 
                    prev === 0 ? images.length - 1 : prev - 1
                  );
                }}
                sx={{
                  position: 'absolute',
                  left: 16,
                  color: 'white',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' }
                }}
              >
                <ChevronLeftIcon />
              </IconButton>
              
              <Box
                component="img"
                src={(restaurant.gallery || restaurant.images)[currentImageIndex]}
                alt={`${restaurant.name} ${currentImageIndex + 1}`}
                sx={{
                  maxWidth: '90%',
                  maxHeight: '70vh',
                  objectFit: 'contain'
                }}
              />
              
              <IconButton
                onClick={() => {
                  const images = restaurant.gallery || restaurant.images;
                  setCurrentImageIndex((prev) => 
                    prev === images.length - 1 ? 0 : prev + 1
                  );
                }}
                sx={{
                  position: 'absolute',
                  right: 16,
                  color: 'white',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' }
                }}
              >
                <ChevronRightIcon />
              </IconButton>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default RestaurantDetailsPage;