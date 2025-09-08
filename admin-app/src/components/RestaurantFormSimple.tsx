import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Save,
  Cancel,
  ImportExport,
  Restaurant,
  LocationOn,
  Phone,
  Add,
  Delete,
} from '@mui/icons-material';
import RestaurantDataImporter from './RestaurantDataImporter';

interface RestaurantFormData {
  name: string;
  cuisine: string;
  address: string;
  city: string;
  state?: string;
  zipCode?: string;
  phoneNumber?: string;
  phone: string;
  email: string;
  description: string;
  openingTime?: string;
  closingTime?: string;
  capacity: number;
  priceRange: string;
  rating: number;
  imageUrl: string;
  gallery: string[];
  website?: string;
  active?: boolean;
}

interface RestaurantFormProps {
  initialData?: RestaurantFormData;
  onSubmit: (data: RestaurantFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

const RestaurantFormSimple: React.FC<RestaurantFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState<RestaurantFormData>(
    initialData || {
      name: '',
      cuisine: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      phoneNumber: '',
      phone: '',
      email: '',
      description: '',
      openingTime: '09:00',
      closingTime: '21:00',
      capacity: 50,
      priceRange: '$$',
      rating: 0,
      imageUrl: '',
      gallery: [],
      website: '',
      active: true,
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showImporter, setShowImporter] = useState(false);
  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  const cuisineTypes = [
    'American', 'Italian', 'Chinese', 'Mexican', 'Japanese', 'French', 'Indian', 
    'Thai', 'Mediterranean', 'Greek', 'Korean', 'Vietnamese', 'Middle Eastern',
    'Spanish', 'German', 'British', 'Caribbean', 'African', 'Fusion', 'Other'
  ];

  const priceRanges = ['$', '$$', '$$$', '$$$$'];
  const usStates = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  const handleInputChange = (field: keyof RestaurantFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Restaurant name is required';
    if (!formData.cuisine.trim()) newErrors.cuisine = 'Cuisine type is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Valid email address is required';
    }
    if (formData.capacity <= 0) newErrors.capacity = 'Capacity must be greater than 0';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleImportData = (importedData: any) => {
    setFormData(prev => ({
      ...prev,
      ...importedData,
    }));
    setShowImporter(false);
  };

  const addGalleryImage = () => {
    if (newGalleryUrl.trim() && !formData.gallery.includes(newGalleryUrl.trim())) {
      setFormData(prev => ({
        ...prev,
        gallery: [...prev.gallery, newGalleryUrl.trim()],
      }));
      setNewGalleryUrl('');
    }
  };

  const removeGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5" component="h2">
            {initialData ? 'Edit Restaurant' : 'Add New Restaurant'}
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ImportExport />}
            onClick={() => setShowImporter(true)}
          >
            Import Data
          </Button>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Basic Information */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Restaurant sx={{ mr: 1 }} />
              Basic Information
            </Typography>
            
            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
              <TextField
                label="Restaurant Name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
                fullWidth
                required
              />
              
              <FormControl fullWidth required error={!!errors.cuisine}>
                <InputLabel>Cuisine Type</InputLabel>
                <Select
                  value={formData.cuisine}
                  label="Cuisine Type"
                  onChange={(e) => handleInputChange('cuisine', e.target.value)}
                >
                  {cuisineTypes.map((cuisine) => (
                    <MenuItem key={cuisine} value={cuisine}>
                      {cuisine}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ mt: 2 }}>
              <TextField
                label="Description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                multiline
                rows={3}
                fullWidth
              />
            </Box>
          </Box>

          {/* Location Information */}
          <Box>
            <Divider />
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <LocationOn sx={{ mr: 1 }} />
              Location Information
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                error={!!errors.address}
                helperText={errors.address}
                fullWidth
                required
              />
              
              <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr' } }}>
                <TextField
                  label="City"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  error={!!errors.city}
                  helperText={errors.city}
                  fullWidth
                  required
                />
                
                <FormControl fullWidth required error={!!errors.state}>
                  <InputLabel>State</InputLabel>
                  <Select
                    value={formData.state}
                    label="State"
                    onChange={(e) => handleInputChange('state', e.target.value)}
                  >
                    {usStates.map((state) => (
                      <MenuItem key={state} value={state}>
                        {state}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <TextField
                  label="ZIP Code"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  error={!!errors.zipCode}
                  helperText={errors.zipCode}
                  fullWidth
                  required
                />
              </Box>
            </Box>
          </Box>

          {/* Contact Information */}
          <Box>
            <Divider />
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <Phone sx={{ mr: 1 }} />
              Contact Information
            </Typography>
            
            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
              <TextField
                label="Phone Number"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber}
                fullWidth
                required
              />
              
              <TextField
                label="Email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
                type="email"
                fullWidth
              />
            </Box>

            <Box sx={{ mt: 2 }}>
              <TextField
                label="Website URL"
                value={formData.website || ''}
                onChange={(e) => handleInputChange('website', e.target.value)}
                fullWidth
                placeholder="https://restaurantwebsite.com"
              />
            </Box>
          </Box>

          {/* Business Information */}
          <Box>
            <Divider />
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Business Information
            </Typography>
            
            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr 1fr' } }}>
              <TextField
                label="Opening Time"
                type="time"
                value={formData.openingTime}
                onChange={(e) => handleInputChange('openingTime', e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              
              <TextField
                label="Closing Time"
                type="time"
                value={formData.closingTime}
                onChange={(e) => handleInputChange('closingTime', e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              
              <TextField
                label="Capacity"
                value={formData.capacity}
                onChange={(e) => handleInputChange('capacity', parseInt(e.target.value) || 0)}
                error={!!errors.capacity}
                helperText={errors.capacity}
                type="number"
                fullWidth
              />
              
              <FormControl fullWidth>
                <InputLabel>Price Range</InputLabel>
                <Select
                  value={formData.priceRange}
                  label="Price Range"
                  onChange={(e) => handleInputChange('priceRange', e.target.value)}
                >
                  {priceRanges.map((range) => (
                    <MenuItem key={range} value={range}>
                      {range}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            
            <Box sx={{ mt: 2 }}>
              <TextField
                label="Rating"
                value={formData.rating}
                onChange={(e) => handleInputChange('rating', parseFloat(e.target.value) || 0)}
                type="number"
                inputProps={{ min: 0, max: 5, step: 0.1 }}
                fullWidth
                helperText="Rating out of 5"
              />
            </Box>
          </Box>

          {/* Images */}
          <Box>
            <Divider />
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Images
            </Typography>
            
            <TextField
              label="Main Image URL"
              value={formData.imageUrl}
              onChange={(e) => handleInputChange('imageUrl', e.target.value)}
              fullWidth
              placeholder="https://example.com/restaurant-image.jpg"
              sx={{ mb: 2 }}
            />
            
            <Typography variant="subtitle1" gutterBottom>
              Gallery Images
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                label="Gallery Image URL"
                value={newGalleryUrl}
                onChange={(e) => setNewGalleryUrl(e.target.value)}
                placeholder="https://example.com/gallery-image.jpg"
                fullWidth
                size="small"
              />
              <Button
                variant="outlined"
                onClick={addGalleryImage}
                startIcon={<Add />}
                disabled={!newGalleryUrl.trim()}
              >
                Add
              </Button>
            </Box>
            
            {formData.gallery.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.gallery.map((url, index) => (
                  <Chip
                    key={index}
                    label={`Image ${index + 1}`}
                    onDelete={() => removeGalleryImage(index)}
                    deleteIcon={<Delete />}
                    variant="outlined"
                  />
                ))}
              </Box>
            )}
          </Box>

          {/* Actions */}
          <Box>
            <Divider />
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="outlined"
                onClick={onCancel}
                startIcon={<Cancel />}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                startIcon={<Save />}
                disabled={loading}
              >
                {loading ? 'Saving...' : initialData ? 'Update Restaurant' : 'Add Restaurant'}
              </Button>
            </Box>
          </Box>
        </Box>
      </CardContent>

      {/* Data Import Dialog */}
      <Dialog open={showImporter} onClose={() => setShowImporter(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Import Restaurant Data</DialogTitle>
        <DialogContent>
          <RestaurantDataImporter onImport={handleImportData} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowImporter(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default RestaurantFormSimple;