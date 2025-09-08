import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  Alert,
  Rating,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Restaurant,
  LocationOn,
  Phone,
  Schedule,
  Star,
  Language,
} from '@mui/icons-material';
import RestaurantFormSimple from '../components/RestaurantFormSimple';
import { apiService, Restaurant as RestaurantData } from '../services/api';

interface RestaurantWithAdmin extends RestaurantData {
  state?: string;
  zipCode?: string;
  phoneNumber?: string;
  openingTime?: string;
  closingTime?: string;
  website?: string;
  active?: boolean;
}

const RestaurantsPage: React.FC = () => {
  const [restaurants, setRestaurants] = useState<RestaurantWithAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<RestaurantWithAdmin | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [viewingRestaurant, setViewingRestaurant] = useState<RestaurantWithAdmin | null>(null);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const response = await apiService.getRestaurants();
      // Ensure restaurants is always an array
      const data = response.data;
      if (Array.isArray(data)) {
        setRestaurants(data);
      } else if (data && typeof data === 'object' && 'content' in data && Array.isArray(data.content)) {
        // Handle paginated response
        setRestaurants(data.content);
      } else if (data && typeof data === 'object') {
        // Handle single object response
        setRestaurants([data]);
      } else {
        setRestaurants([]);
      }
      setError(null);
    } catch (err: any) {
      console.error('Failed to fetch restaurants:', err);
      setError('Failed to load restaurants. Please try again.');
      // Set some mock data for demonstration
      setRestaurants([
        {
          id: 1,
          name: 'The Grand Dining',
          cuisine: 'French',
          address: '123 5th Avenue',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          phoneNumber: '(212) 555-0123',
          email: 'info@granddining.com',
          phone: '(212) 555-0123',
          description: 'An elegant French restaurant offering classic dishes with a modern twist.',
          openingTime: '11:30',
          closingTime: '22:00',
          capacity: 80,
          priceRange: '$$$',
          rating: 4.5,
          imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
          gallery: [],
          website: 'https://granddining.com',
          active: true,
        },
        {
          id: 2,
          name: 'Sakura Sushi Bar',
          cuisine: 'Japanese',
          address: '456 Park Avenue',
          city: 'New York',
          state: 'NY',
          zipCode: '10022',
          phoneNumber: '(212) 555-0456',
          email: 'hello@sakurasushi.com',
          phone: '(212) 555-0456',
          description: 'Authentic Japanese cuisine featuring fresh sushi and sashimi.',
          openingTime: '17:00',
          closingTime: '23:00',
          capacity: 60,
          priceRange: '$$$$',
          rating: 4.8,
          imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400',
          gallery: [],
          website: 'https://sakurasushi.com',
          active: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRestaurant = () => {
    setEditingRestaurant(null);
    setShowForm(true);
  };

  const handleEditRestaurant = (restaurant: RestaurantWithAdmin) => {
    setEditingRestaurant(restaurant);
    setShowForm(true);
  };

  const handleViewRestaurant = (restaurant: RestaurantWithAdmin) => {
    setViewingRestaurant(restaurant);
  };

  const handleDeleteRestaurant = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this restaurant?')) {
      return;
    }

    try {
      await apiService.deleteRestaurant(id);
      setRestaurants(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error('Failed to delete restaurant:', err);
      alert('Failed to delete restaurant. Please try again.');
    }
  };

  const handleFormSubmit = async (data: RestaurantWithAdmin) => {
    setFormLoading(true);
    try {
      if (editingRestaurant?.id) {
        // Update existing restaurant
        const response = await apiService.updateRestaurant(editingRestaurant.id, data);
        setRestaurants(prev =>
          prev.map(r => (r.id === editingRestaurant.id ? response.data || data : r))
        );
      } else {
        // Create new restaurant
        const response = await apiService.createRestaurant(data);
        setRestaurants(prev => [...prev, response.data || { ...data, id: Math.max(...prev.map(r => r.id || 0), 0) + 1 }]);
      }
      setShowForm(false);
      setEditingRestaurant(null);
    } catch (err: any) {
      console.error('Failed to save restaurant:', err);
      // For demo purposes, simulate success
      const newRestaurant = {
        ...data,
        id: editingRestaurant?.id || Math.max(...restaurants.map(r => r.id || 0), 0) + 1,
        active: true,
      };
      
      if (editingRestaurant?.id) {
        setRestaurants(prev =>
          prev.map(r => (r.id === editingRestaurant.id ? newRestaurant : r))
        );
      } else {
        setRestaurants(prev => [...prev, newRestaurant]);
      }
      setShowForm(false);
      setEditingRestaurant(null);
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingRestaurant(null);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1">
            Restaurants
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddRestaurant}
            size="large"
          >
            Add Restaurant
          </Button>
        </Box>
        
        {error && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {error} (Showing demo data)
          </Alert>
        )}

        <Typography variant="body2" color="text.secondary">
          Manage your restaurant listings, import data from external sources, and update information.
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Restaurant</TableCell>
                  <TableCell>Cuisine</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(restaurants) && restaurants.map((restaurant) => (
                  <TableRow key={restaurant.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          src={restaurant.imageUrl}
                          alt={restaurant.name}
                          sx={{ width: 50, height: 50 }}
                        >
                          <Restaurant />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="medium">
                            {restaurant.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Capacity: {restaurant.capacity} people
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={restaurant.cuisine} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {restaurant.city}, {restaurant.state}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {restaurant.zipCode}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Rating value={restaurant.rating} readOnly size="small" precision={0.1} />
                        <Typography variant="body2">
                          ({restaurant.rating})
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={restaurant.priceRange} size="small" />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={restaurant.active ? 'Active' : 'Inactive'}
                        color={restaurant.active ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => handleViewRestaurant(restaurant)}
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => handleEditRestaurant(restaurant)}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => restaurant.id && handleDeleteRestaurant(restaurant.id)}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {(!Array.isArray(restaurants) || restaurants.length === 0) && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Restaurant sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No restaurants found
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Get started by adding your first restaurant
              </Typography>
              <Button variant="contained" startIcon={<Add />} onClick={handleAddRestaurant}>
                Add Restaurant
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Restaurant Dialog */}
      <Dialog open={showForm} onClose={handleFormCancel} maxWidth="lg" fullWidth>
        <DialogTitle>
          {editingRestaurant ? 'Edit Restaurant' : 'Add New Restaurant'}
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <RestaurantFormSimple
            initialData={editingRestaurant || undefined}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            loading={formLoading}
          />
        </DialogContent>
      </Dialog>

      {/* View Restaurant Dialog */}
      <Dialog
        open={!!viewingRestaurant}
        onClose={() => setViewingRestaurant(null)}
        maxWidth="md"
        fullWidth
      >
        {viewingRestaurant && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  src={viewingRestaurant.imageUrl}
                  alt={viewingRestaurant.name}
                  sx={{ width: 60, height: 60 }}
                >
                  <Restaurant />
                </Avatar>
                <Box>
                  <Typography variant="h5">{viewingRestaurant.name}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <Rating value={viewingRestaurant.rating} readOnly size="small" precision={0.1} />
                    <Typography variant="body2">({viewingRestaurant.rating})</Typography>
                  </Box>
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'grid', gap: 3 }}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Basic Information
                  </Typography>
                  <Box sx={{ display: 'grid', gap: 1 }}>
                    <Typography variant="body2">
                      <strong>Cuisine:</strong> {viewingRestaurant.cuisine}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Price Range:</strong> {viewingRestaurant.priceRange}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Capacity:</strong> {viewingRestaurant.capacity} people
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOn fontSize="small" />
                    Location & Contact
                  </Typography>
                  <Box sx={{ display: 'grid', gap: 1 }}>
                    <Typography variant="body2">
                      <strong>Address:</strong> {viewingRestaurant.address}
                    </Typography>
                    <Typography variant="body2">
                      <strong>City:</strong> {viewingRestaurant.city}, {viewingRestaurant.state} {viewingRestaurant.zipCode}
                    </Typography>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Phone fontSize="small" />
                      {viewingRestaurant.phoneNumber}
                    </Typography>
                    {viewingRestaurant.email && (
                      <Typography variant="body2">
                        <strong>Email:</strong> {viewingRestaurant.email}
                      </Typography>
                    )}
                    {viewingRestaurant.website && (
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Language fontSize="small" />
                        <a href={viewingRestaurant.website} target="_blank" rel="noopener noreferrer">
                          {viewingRestaurant.website}
                        </a>
                      </Typography>
                    )}
                  </Box>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Schedule fontSize="small" />
                    Hours
                  </Typography>
                  <Typography variant="body2">
                    {viewingRestaurant.openingTime} - {viewingRestaurant.closingTime}
                  </Typography>
                </Box>

                {viewingRestaurant.description && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Description
                    </Typography>
                    <Typography variant="body2">
                      {viewingRestaurant.description}
                    </Typography>
                  </Box>
                )}
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default RestaurantsPage;