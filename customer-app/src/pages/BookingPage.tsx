import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Stepper,
  Step,
  StepLabel,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert,
  Card,
  CardContent,
  Divider,
  Chip,
} from '@mui/material';
import {
  CalendarToday,
  AccessTime,
  People,
  Restaurant,
  CheckCircle,
  Person,
  Email,
  Phone,
  Notes,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { sanitizeFormData, sanitizeEmail, sanitizePhone } from '../utils/sanitize';
import LoadingState from '../components/LoadingState';

const steps = ['Select Date & Time', 'Guest Details', 'Confirm Booking'];

const BookingPage: React.FC = () => {
  const { restaurantId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize with passed state or defaults
  const initialState = location.state || {
    date: new Date().toISOString().split('T')[0],
    time: '19:00',
    partySize: 2,
  };

  const [bookingData, setBookingData] = useState({
    ...initialState,
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    specialRequests: '',
    occasionType: '',
  });

  // Mock restaurant data (would come from API)
  const restaurant = {
    id: restaurantId,
    name: "The Grand Dining",
    address: "123 5th Avenue, New York, NY 10001",
    cuisine: "French",
    priceRange: "$$$",
  };

  const timeSlots = [
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', 
    '20:00', '20:30', '21:00', '21:30', '22:00'
  ];

  const occasions = [
    'Birthday', 'Anniversary', 'Date Night', 'Business Meal', 
    'Special Celebration', 'Other'
  ];

  const handleNext = () => {
    if (activeStep === 0) {
      if (!bookingData.date || !bookingData.time || !bookingData.partySize) {
        setError('Please select date, time, and party size');
        return;
      }
    } else if (activeStep === 1) {
      if (!bookingData.customerName || !bookingData.customerEmail || !bookingData.customerPhone) {
        setError('Please fill in all required fields');
        return;
      }
      const sanitizedEmail = sanitizeEmail(bookingData.customerEmail);
      if (!sanitizedEmail) {
        setError('Please enter a valid email address');
        return;
      }
      const sanitizedPhone = sanitizePhone(bookingData.customerPhone);
      if (!sanitizedPhone) {
        setError('Please enter a valid phone number (10-15 digits)');
        return;
      }
    }
    setError('');
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError('');
      
      // Sanitize all form data before submission
      const sanitizedData = sanitizeFormData(bookingData);
      
      // In real app, make API call to create reservation
      console.log('Creating reservation:', sanitizedData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess(true);
      
      // Redirect to confirmation page after 2 seconds
      setTimeout(() => {
        navigate('/my-reservations');
      }, 2000);
    } catch (err) {
      setError('Failed to create reservation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Select Your Reservation Details
            </Typography>
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <TextField
                  fullWidth
                  type="date"
                  label="Date"
                  value={bookingData.date}
                  onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: new Date().toISOString().split('T')[0] }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <FormControl fullWidth>
                  <InputLabel>Time</InputLabel>
                  <Select
                    value={bookingData.time}
                    onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                    label="Time"
                  >
                    {timeSlots.map((slot) => (
                      <MenuItem key={slot} value={slot}>
                        {format(new Date(`2000-01-01T${slot}`), 'h:mm a')}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                <FormControl fullWidth>
                  <InputLabel>Party Size</InputLabel>
                  <Select
                    value={bookingData.partySize}
                    onChange={(e) => setBookingData({ ...bookingData, partySize: Number(e.target.value) })}
                    label="Party Size"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((size) => (
                      <MenuItem key={size} value={size}>
                        {size} {size === 1 ? 'Guest' : 'Guests'}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Enter Your Details
            </Typography>
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Full Name"
                  required
                  value={bookingData.customerName}
                  onChange={(e) => setBookingData({ ...bookingData, customerName: e.target.value })}
                  InputProps={{
                    startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  required
                  value={bookingData.customerEmail}
                  onChange={(e) => setBookingData({ ...bookingData, customerEmail: e.target.value })}
                  InputProps={{
                    startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  required
                  value={bookingData.customerPhone}
                  onChange={(e) => setBookingData({ ...bookingData, customerPhone: e.target.value })}
                  InputProps={{
                    startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Occasion (Optional)</InputLabel>
                  <Select
                    value={bookingData.occasionType}
                    onChange={(e) => setBookingData({ ...bookingData, occasionType: e.target.value })}
                    label="Occasion (Optional)"
                  >
                    <MenuItem value="">None</MenuItem>
                    {occasions.map((occasion) => (
                      <MenuItem key={occasion} value={occasion}>
                        {occasion}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Special Requests (Optional)"
                  multiline
                  rows={3}
                  value={bookingData.specialRequests}
                  onChange={(e) => setBookingData({ ...bookingData, specialRequests: e.target.value })}
                  placeholder="Dietary restrictions, seating preferences, etc."
                  InputProps={{
                    startAdornment: <Notes sx={{ mr: 1, color: 'text.secondary', alignSelf: 'flex-start', mt: 1 }} />,
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Confirm Your Reservation
            </Typography>
            
            {isSubmitting ? (
              <LoadingState message="Creating your reservation..." />
            ) : success ? (
              <Box textAlign="center" py={4}>
                <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Reservation Confirmed!
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  You will receive a confirmation email shortly.
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={{ xs: 2, sm: 3 }}>
                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Restaurant Details
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Restaurant sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography>{restaurant.name}</Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {restaurant.address}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {restaurant.cuisine} • {restaurant.priceRange}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Reservation Details
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <CalendarToday sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                        <Typography>
                          {format(new Date(bookingData.date), 'EEEE, MMMM d, yyyy')}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <AccessTime sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                        <Typography>
                          {format(new Date(`2000-01-01T${bookingData.time}`), 'h:mm a')}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <People sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                        <Typography>
                          {bookingData.partySize} {bookingData.partySize === 1 ? 'Guest' : 'Guests'}
                        </Typography>
                      </Box>
                      {bookingData.occasionType && (
                        <Box sx={{ mt: 1 }}>
                          <Chip label={bookingData.occasionType} size="small" />
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid size={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Guest Information
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 4, md: 4 }}>
                          <Typography variant="body2" color="text.secondary">Name</Typography>
                          <Typography>{bookingData.customerName}</Typography>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4, md: 4 }}>
                          <Typography variant="body2" color="text.secondary">Email</Typography>
                          <Typography>{bookingData.customerEmail}</Typography>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4, md: 4 }}>
                          <Typography variant="body2" color="text.secondary">Phone</Typography>
                          <Typography>{bookingData.customerPhone}</Typography>
                        </Grid>
                        {bookingData.specialRequests && (
                          <Grid size={12}>
                            <Typography variant="body2" color="text.secondary">Special Requests</Typography>
                            <Typography>{bookingData.specialRequests}</Typography>
                          </Grid>
                        )}
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
      <Paper sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        <Typography variant="h4" gutterBottom>
          Make a Reservation
        </Typography>
        
        <Stepper 
          activeStep={activeStep} 
          sx={{ 
            mb: { xs: 2, sm: 3, md: 4 },
            '& .MuiStepLabel-label': {
              fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
            },
          }}
          alternativeLabel={false}
        >
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel 
                sx={{
                  '& .MuiStepLabel-label': {
                    display: { 
                      xs: index === activeStep ? 'block' : 'none', 
                      sm: 'block' 
                    },
                  },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {renderStepContent()}

        {!success && !isSubmitting && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            mt: { xs: 2, sm: 3, md: 4 },
            gap: 2,
          }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ 
                minWidth: { xs: '80px', sm: '100px' },
              }}
            >
              Back
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={isSubmitting}
                sx={{
                  bgcolor: '#C41E3A',
                  '&:hover': { bgcolor: '#8B0020' },
                }}
              >
                Confirm Booking
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                sx={{
                  bgcolor: '#C41E3A',
                  '&:hover': { bgcolor: '#8B0020' },
                }}
              >
                Next
              </Button>
            )}
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default BookingPage;