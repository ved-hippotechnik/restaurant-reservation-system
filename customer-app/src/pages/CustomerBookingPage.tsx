import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  ArrowBack,
  CalendarToday,
  AccessTime,
  People,
  Person,
  Email,
  Phone,
  Restaurant as RestaurantIcon,
  CheckCircle,
  LocationOn,
  AttachMoney,
  Event as EventIcon,
  GetApp as DownloadIcon,
} from '@mui/icons-material';
import { apiService, Restaurant, ReservationRequest } from '../services/api';
import { createGoogleCalendarUrl, downloadICSFile } from '../utils/googleCalendar';

const CustomerBookingPage: React.FC = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [reservation, setReservation] = useState<ReservationRequest>({
    restaurantId: parseInt(restaurantId || '0'),
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    reservationDate: '',
    reservationTime: '',
    partySize: 2,
    specialRequests: '',
  });

  const timeSlots = [
    '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
    '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM',
    '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM',
    '9:00 PM', '9:30 PM',
  ];

  useEffect(() => {
    if (restaurantId) {
      fetchRestaurantDetails(parseInt(restaurantId));
    }
  }, [restaurantId]);

  const fetchRestaurantDetails = async (id: number) => {
    setLoading(true);
    try {
      const result = await apiService.getRestaurant(id);
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

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleInputChange = (field: keyof ReservationRequest, value: string | number) => {
    setReservation((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateSelect = (date: string) => {
    handleInputChange('reservationDate', date);
    handleNext();
  };

  const handleTimeSelect = (time: string) => {
    // Convert to 24-hour format for backend
    const convertedTime = convertTo24Hour(time);
    handleInputChange('reservationTime', convertedTime);
    handleNext();
  };

  const convertTo24Hour = (time12h: string): string => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') {
      hours = '00';
    }
    if (modifier === 'PM') {
      hours = String(parseInt(hours, 10) + 12);
    }
    return `${hours}:${minutes}`;
  };

  const handleSubmit = async () => {
    setError(null);
    try {
      const result = await apiService.createReservation(reservation);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        setTimeout(() => {
          navigate('/my-reservations');
        }, 3000);
      }
    } catch (error) {
      setError('Failed to create reservation. Please try again.');
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    return maxDate.toISOString().split('T')[0];
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 0:
        return !!reservation.reservationDate;
      case 1:
        return !!reservation.reservationTime;
      case 2:
        return !!reservation.partySize;
      case 3:
        return !!(
          reservation.customerName &&
          reservation.customerEmail &&
          reservation.customerPhone
        );
      default:
        return false;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (error && !success) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/')} sx={{ mt: 2 }}>
          Back to Restaurants
        </Button>
      </Container>
    );
  }

  if (success) {
    const handleAddToGoogleCalendar = () => {
      const calendarUrl = createGoogleCalendarUrl({
        restaurantName: restaurant?.name || '',
        restaurantAddress: restaurant?.address || '',
        date: reservation.reservationDate,
        time: reservation.reservationTime,
        partySize: reservation.partySize,
        customerName: reservation.customerName,
        customerPhone: reservation.customerPhone,
        specialRequests: reservation.specialRequests,
      });
      window.open(calendarUrl, '_blank');
    };

    const handleDownloadICS = () => {
      downloadICSFile({
        restaurantName: restaurant?.name || '',
        restaurantAddress: restaurant?.address || '',
        date: reservation.reservationDate,
        time: reservation.reservationTime,
        partySize: reservation.partySize,
        customerName: reservation.customerName,
        customerEmail: reservation.customerEmail,
        customerPhone: reservation.customerPhone,
        specialRequests: reservation.specialRequests,
      });
    };

    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Reservation Confirmed!
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Your reservation at {restaurant?.name} has been successfully booked.
          </Typography>
          
          <Box sx={{ my: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              Reservation Details
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Date: {new Date(reservation.reservationDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Time: {reservation.reservationTime}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Party Size: {reservation.partySize} {reservation.partySize === 1 ? 'person' : 'people'}
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" paragraph>
            A confirmation email has been sent to {reservation.customerEmail}
          </Typography>

          <Divider sx={{ my: 3 }} />
          
          <Typography variant="subtitle1" gutterBottom>
            Add to Your Calendar
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={<EventIcon />}
              onClick={handleAddToGoogleCalendar}
              sx={{ 
                borderColor: '#4285f4',
                color: '#4285f4',
                '&:hover': {
                  borderColor: '#357ae8',
                  bgcolor: 'rgba(66, 133, 244, 0.04)',
                }
              }}
            >
              Add to Google Calendar
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleDownloadICS}
              sx={{ 
                borderColor: 'grey.600',
                color: 'grey.700',
              }}
            >
              Download .ics File
            </Button>
          </Box>

          <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 2 }}>
            The .ics file can be imported into Apple Calendar, Outlook, and other calendar apps
          </Typography>

          <Button
            variant="contained"
            onClick={() => navigate('/my-reservations')}
            sx={{ mt: 3 }}
            fullWidth
          >
            View My Reservations
          </Button>
        </Paper>
      </Container>
    );
  }

  const steps = [
    {
      label: 'Select Date',
      icon: <CalendarToday />,
    },
    {
      label: 'Select Time',
      icon: <AccessTime />,
    },
    {
      label: 'Party Size',
      icon: <People />,
    },
    {
      label: 'Contact Details',
      icon: <Person />,
    },
  ];

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(`/restaurant/${restaurantId}`)}
          sx={{ mb: 3 }}
        >
          Back to Restaurant
        </Button>

        <Grid container spacing={4}>
          {/* Booking Form */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card>
              <CardContent>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Make a Reservation
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Stepper activeStep={activeStep} orientation="vertical">
                  {steps.map((step, index) => (
                    <Step key={step.label}>
                      <StepLabel
                        StepIconComponent={() => (
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              bgcolor: activeStep >= index ? 'primary.main' : 'grey.300',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            {step.icon}
                          </Box>
                        )}
                      >
                        {step.label}
                      </StepLabel>
                      <StepContent>
                        {index === 0 && (
                          <Box sx={{ mb: 2 }}>
                            <TextField
                              type="date"
                              fullWidth
                              value={reservation.reservationDate}
                              onChange={(e) => handleDateSelect(e.target.value)}
                              InputLabelProps={{ shrink: true }}
                              inputProps={{
                                min: getMinDate(),
                                max: getMaxDate(),
                              }}
                              sx={{ mb: 2 }}
                            />
                          </Box>
                        )}

                        {index === 1 && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Available time slots for {reservation.reservationDate}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                              {timeSlots.map((time) => (
                                <Chip
                                  key={time}
                                  label={time}
                                  onClick={() => handleTimeSelect(time)}
                                  color="primary"
                                  variant="outlined"
                                  sx={{
                                    '&:hover': {
                                      bgcolor: 'primary.main',
                                      color: 'white',
                                    },
                                  }}
                                />
                              ))}
                            </Box>
                          </Box>
                        )}

                        {index === 2 && (
                          <Box sx={{ mb: 2 }}>
                            <FormControl fullWidth>
                              <InputLabel>Number of Guests</InputLabel>
                              <Select
                                value={reservation.partySize}
                                onChange={(e) => {
                                  handleInputChange('partySize', e.target.value);
                                  handleNext();
                                }}
                                label="Number of Guests"
                              >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((size) => (
                                  <MenuItem key={size} value={size}>
                                    {size} {size === 1 ? 'Guest' : 'Guests'}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Box>
                        )}

                        {index === 3 && (
                          <Box sx={{ mb: 2 }}>
                            <Grid container spacing={2}>
                              <Grid size={12}>
                                <TextField
                                  fullWidth
                                  label="Full Name"
                                  value={reservation.customerName}
                                  onChange={(e) => handleInputChange('customerName', e.target.value)}
                                  required
                                />
                              </Grid>
                              <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                  fullWidth
                                  label="Email"
                                  type="email"
                                  value={reservation.customerEmail}
                                  onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                                  required
                                />
                              </Grid>
                              <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                  fullWidth
                                  label="Phone"
                                  value={reservation.customerPhone}
                                  onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                                  required
                                />
                              </Grid>
                              <Grid size={12}>
                                <TextField
                                  fullWidth
                                  label="Special Requests (Optional)"
                                  multiline
                                  rows={3}
                                  value={reservation.specialRequests}
                                  onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                                  placeholder="Any dietary restrictions, special occasions, or preferences..."
                                />
                              </Grid>
                            </Grid>
                          </Box>
                        )}

                        <Box sx={{ mb: 2 }}>
                          {index > 0 && (
                            <Button onClick={handleBack} sx={{ mr: 1 }}>
                              Back
                            </Button>
                          )}
                          {index < steps.length - 1 ? (
                            <Button
                              variant="contained"
                              onClick={handleNext}
                              disabled={!isStepValid(index)}
                            >
                              Continue
                            </Button>
                          ) : (
                            <Button
                              variant="contained"
                              onClick={handleSubmit}
                              disabled={!isStepValid(index)}
                              sx={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                '&:hover': {
                                  background: 'linear-gradient(135deg, #5a67d8 0%, #6b4299 100%)',
                                },
                              }}
                            >
                              Confirm Reservation
                            </Button>
                          )}
                        </Box>
                      </StepContent>
                    </Step>
                  ))}
                </Stepper>
              </CardContent>
            </Card>
          </Grid>

          {/* Restaurant Summary */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ position: 'sticky', top: 20 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Reservation Summary
                </Typography>
                <Divider sx={{ mb: 2 }} />

                {restaurant && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {restaurant.name}
                    </Typography>
                    <Chip
                      label={restaurant.cuisine}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Chip
                      label={restaurant.priceRange}
                      size="small"
                    />
                  </Box>
                )}

                <List dense>
                  {reservation.reservationDate && (
                    <ListItem>
                      <ListItemIcon>
                        <CalendarToday color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Date"
                        secondary={new Date(reservation.reservationDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      />
                    </ListItem>
                  )}
                  {reservation.reservationTime && (
                    <ListItem>
                      <ListItemIcon>
                        <AccessTime color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Time"
                        secondary={reservation.reservationTime}
                      />
                    </ListItem>
                  )}
                  {reservation.partySize > 0 && (
                    <ListItem>
                      <ListItemIcon>
                        <People color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Party Size"
                        secondary={`${reservation.partySize} ${reservation.partySize === 1 ? 'Guest' : 'Guests'}`}
                      />
                    </ListItem>
                  )}
                  {restaurant && (
                    <ListItem>
                      <ListItemIcon>
                        <LocationOn color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Location"
                        secondary={restaurant.address}
                      />
                    </ListItem>
                  )}
                </List>

                {restaurant && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      <strong>Cancellation Policy:</strong> Free cancellation up to 2 hours before reservation time.
                    </Typography>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CustomerBookingPage;