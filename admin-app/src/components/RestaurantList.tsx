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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Tabs,
  Tab,
  CardMedia,
  ImageList,
  ImageListItem,
} from '@mui/material';
import { Add, Edit, Delete, Restaurant as RestaurantIcon, Image, Info, Collections } from '@mui/icons-material';
import { apiService, Restaurant } from '../services/api';
import ErrorBoundary from './ErrorBoundary';
import ImageGalleryUpload from './ImageGalleryUpload';

const RestaurantList: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState<Partial<Restaurant>>({
    name: '',
    address: '',
    phone: '',
    email: '',
    cuisine: '',
    priceRange: '$',
    description: '',
    capacity: 50,
    city: '',
    openingHours: '9:00 AM - 10:00 PM',
    imageUrl: '',
    gallery: [],
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
      setRestaurants(result.data || []);
    }
    setLoading(false);
  };

  const handleOpenDialog = (restaurant?: Restaurant) => {
    setTabValue(0); // Reset to first tab
    if (restaurant) {
      setEditingRestaurant(restaurant);
      setFormData({
        ...restaurant,
        gallery: restaurant.gallery || [],
      });
    } else {
      setEditingRestaurant(null);
      setFormData({
        name: '',
        address: '',
        phone: '',
        email: '',
        cuisine: '',
        priceRange: '$',
        description: '',
        capacity: 50,
        city: '',
        openingHours: '9:00 AM - 10:00 PM',
        imageUrl: '',
        gallery: [],
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingRestaurant(null);
    setTabValue(0);
  };

  const handleGalleryChange = (images: string[]) => {
    setFormData(prev => ({ 
      ...prev, 
      gallery: images,
      // Set the first image as the main image if no imageUrl is set
      imageUrl: prev.imageUrl || images[0] || ''
    }));
  };

  const handleSave = async () => {
    try {
      if (editingRestaurant) {
        await apiService.updateRestaurant(editingRestaurant.id!, formData);
      } else {
        await apiService.createRestaurant(formData as Omit<Restaurant, 'id' | 'createdAt' | 'updatedAt'>);
      }
      handleCloseDialog();
      fetchRestaurants();
    } catch (error) {
      console.error('Error saving restaurant:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this restaurant?')) {
      const result = await apiService.deleteRestaurant(id);
      if (result.error) {
        setError(result.error);
      } else {
        fetchRestaurants();
      }
    }
  };

  const handleInputChange = (field: keyof Restaurant, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            Restaurant Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
            sx={{
              bgcolor: '#1976d2',
              '&:hover': { bgcolor: '#1565c0' },
            }}
          >
            Add Restaurant
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            Error: {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {restaurants.length === 0 ? (
            <Grid size={12}>
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 6 }}>
                  <RestaurantIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    No restaurants found
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Start by adding your first restaurant
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => handleOpenDialog()}
                  >
                    Add Restaurant
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ) : (
            restaurants.map((restaurant) => (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={restaurant.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {/* Display main image or first gallery image */}
                  {(restaurant.imageUrl || restaurant.gallery?.[0]) && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={restaurant.imageUrl || restaurant.gallery?.[0]}
                      alt={restaurant.name}
                      sx={{ objectFit: 'cover' }}
                    />
                  )}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                      <Typography variant="h6" component="h2">
                        {restaurant.name}
                      </Typography>
                      {restaurant.gallery && restaurant.gallery.length > 0 && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Collections fontSize="small" color="action" />
                          <Typography variant="caption" color="text.secondary">
                            {restaurant.gallery.length}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {restaurant.cuisine} • {restaurant.priceRange}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      📍 {restaurant.address}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      📞 {restaurant.phone}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      👥 Capacity: {restaurant.capacity}
                    </Typography>
                    {restaurant.description && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {restaurant.description}
                      </Typography>
                    )}
                  </CardContent>
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Button
                      startIcon={<Edit />}
                      onClick={() => handleOpenDialog(restaurant)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      startIcon={<Delete />}
                      color="error"
                      onClick={() => handleDelete(restaurant.id!)}
                    >
                      Delete
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))
          )}
        </Grid>

        {/* Add/Edit Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
          <DialogTitle>
            {editingRestaurant ? 'Edit Restaurant' : 'Add New Restaurant'}
          </DialogTitle>
          <DialogContent>
            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tab label="Basic Information" icon={<Info />} iconPosition="start" />
              <Tab label="Gallery" icon={<Collections />} iconPosition="start" />
            </Tabs>
            
            {/* Basic Information Tab */}
            {tabValue === 0 && (
              <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Restaurant Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Cuisine Type"
                  value={formData.cuisine}
                  onChange={(e) => handleInputChange('cuisine', e.target.value)}
                  required
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  select
                  fullWidth
                  label="Price Range"
                  value={formData.priceRange}
                  onChange={(e) => handleInputChange('priceRange', e.target.value)}
                >
                  <MenuItem value="$">$ - Budget</MenuItem>
                  <MenuItem value="$$">$$ - Moderate</MenuItem>
                  <MenuItem value="$$$">$$$ - Expensive</MenuItem>
                  <MenuItem value="$$$$">$$$$ - Very Expensive</MenuItem>
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => handleInputChange('capacity', parseInt(e.target.value))}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="City"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Opening Hours"
                  value={formData.openingHours}
                  onChange={(e) => handleInputChange('openingHours', e.target.value)}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Main Image URL (Optional)"
                  value={formData.imageUrl}
                  onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                  placeholder="https://example.com/restaurant-image.jpg"
                  helperText="This will be the main display image for your restaurant"
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </Grid>
              </Grid>
            )}
            
            {/* Gallery Tab */}
            {tabValue === 1 && (
              <Box sx={{ mt: 2 }}>
                <ImageGalleryUpload
                  images={formData.gallery || []}
                  onImagesChange={handleGalleryChange}
                  maxImages={12}
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSave} variant="contained">
              {editingRestaurant ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ErrorBoundary>
  );
};

export default RestaurantList;