import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Button,
  Chip,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Rating,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  Schedule as TimeIcon,
  People as PeopleIcon,
  Restaurant as RestaurantIcon,
  LocationOn as LocationIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  PendingActions as PendingIcon,
  Block as CancelledIcon,
  RateReview as ReviewIcon,
  History as HistoryIcon,
  EventAvailable as UpcomingIcon,
  Event as EventIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { createGoogleCalendarUrl } from '../utils/googleCalendar';

interface Reservation {
  id: string;
  restaurantName: string;
  restaurantImage: string;
  restaurantAddress: string;
  date: string;
  time: string;
  partySize: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  confirmationCode: string;
  specialRequests?: string;
  totalAmount?: number;
  rating?: number;
  review?: string;
}

const MyReservationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [openModifyDialog, setOpenModifyDialog] = useState(false);
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      // Mock data for demonstration
      const mockData: Reservation[] = [
        {
          id: '1',
          restaurantName: 'The Italian Kitchen',
          restaurantImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
          restaurantAddress: '123 Main St, New York',
          date: '2024-01-20',
          time: '19:00',
          partySize: 4,
          status: 'confirmed',
          confirmationCode: 'RES2024012001',
          specialRequests: 'Window seat preferred',
          totalAmount: 120,
        },
        {
          id: '2',
          restaurantName: 'Sushi Palace',
          restaurantImage: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
          restaurantAddress: '456 Oak Ave, New York',
          date: '2024-01-15',
          time: '20:00',
          partySize: 2,
          status: 'confirmed',
          confirmationCode: 'RES2024011502',
          totalAmount: 85,
        },
        {
          id: '3',
          restaurantName: 'Garden Bistro',
          restaurantImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400',
          restaurantAddress: '789 Park Rd, New York',
          date: '2024-01-10',
          time: '18:30',
          partySize: 3,
          status: 'completed',
          confirmationCode: 'RES2024011003',
          totalAmount: 95,
          rating: 5,
          review: 'Excellent food and service!',
        },
        {
          id: '4',
          restaurantName: 'Le Petit Café',
          restaurantImage: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400',
          restaurantAddress: '555 Bistro Blvd, New York',
          date: '2023-12-25',
          time: '19:30',
          partySize: 2,
          status: 'completed',
          confirmationCode: 'RES2023122504',
          totalAmount: 150,
          rating: 4,
          review: 'Great atmosphere, food was good',
        },
        {
          id: '5',
          restaurantName: 'Taco Fiesta',
          restaurantImage: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400',
          restaurantAddress: '999 Salsa St, New York',
          date: '2024-01-08',
          time: '18:00',
          partySize: 6,
          status: 'cancelled',
          confirmationCode: 'RES2024010805',
        },
      ];
      setReservations(mockData);
    } catch (error) {
      console.error('Failed to fetch reservations:', error);
    }
  };

  const getUpcomingReservations = () => {
    const today = new Date();
    return reservations.filter(r => 
      r.status !== 'cancelled' && 
      r.status !== 'completed' &&
      new Date(r.date) >= today
    );
  };

  const getPastReservations = () => {
    return reservations.filter(r => 
      r.status === 'completed' || 
      (r.status !== 'cancelled' && new Date(r.date) < new Date())
    );
  };

  const getCancelledReservations = () => {
    return reservations.filter(r => r.status === 'cancelled');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircleIcon color="success" />;
      case 'pending':
        return <PendingIcon color="warning" />;
      case 'cancelled':
        return <CancelledIcon color="error" />;
      case 'completed':
        return <CheckCircleIcon color="info" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      case 'completed':
        return 'info';
      default:
        return 'default';
    }
  };

  const handleCancelReservation = () => {
    if (selectedReservation) {
      setReservations(reservations.map(r => 
        r.id === selectedReservation.id 
          ? { ...r, status: 'cancelled' as const }
          : r
      ));
      setOpenCancelDialog(false);
      setSelectedReservation(null);
      setCancelReason('');
    }
  };

  const handleSubmitReview = () => {
    if (selectedReservation) {
      setReservations(reservations.map(r => 
        r.id === selectedReservation.id 
          ? { ...r, rating: reviewRating, review: reviewComment }
          : r
      ));
      setOpenReviewDialog(false);
      setSelectedReservation(null);
      setReviewRating(5);
      setReviewComment('');
    }
  };

  const ReservationCard = ({ reservation }: { reservation: Reservation }) => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 3 }}>
            <Box
              component="img"
              src={reservation.restaurantImage}
              alt={reservation.restaurantName}
              sx={{
                width: '100%',
                height: 150,
                objectFit: 'cover',
                borderRadius: 1,
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="h6">{reservation.restaurantName}</Typography>
              <Chip
                icon={getStatusIcon(reservation.status) ?? undefined}
                label={reservation.status.toUpperCase()}
                color={getStatusColor(reservation.status) as any}
                size="small"
              />
            </Box>
            
            <List dense>
              <ListItem disablePadding>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <CalendarIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary={new Date(reservation.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                />
              </ListItem>
              <ListItem disablePadding>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <TimeIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={reservation.time} />
              </ListItem>
              <ListItem disablePadding>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <PeopleIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={`${reservation.partySize} guests`} />
              </ListItem>
              <ListItem disablePadding>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <LocationIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={reservation.restaurantAddress} />
              </ListItem>
            </List>

            {reservation.specialRequests && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Special requests: {reservation.specialRequests}
              </Typography>
            )}
            
            <Typography variant="caption" color="text.secondary">
              Confirmation: {reservation.confirmationCode}
            </Typography>

            {reservation.rating && (
              <Box sx={{ mt: 1 }}>
                <Rating value={reservation.rating} readOnly size="small" />
                {reservation.review && (
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    "{reservation.review}"
                  </Typography>
                )}
              </Box>
            )}
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {reservation.totalAmount && (
                <Typography variant="h6" color="primary" align="right">
                  ${reservation.totalAmount}
                </Typography>
              )}
              
              {reservation.status === 'confirmed' && (
                <>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<EventIcon />}
                    onClick={() => {
                      const calendarUrl = createGoogleCalendarUrl({
                        restaurantName: reservation.restaurantName,
                        restaurantAddress: reservation.restaurantAddress,
                        date: reservation.date,
                        time: reservation.time,
                        partySize: reservation.partySize,
                        customerName: 'Guest', // This would come from user context in a real app
                        customerPhone: '', // This would come from user context in a real app
                        specialRequests: reservation.specialRequests,
                      });
                      window.open(calendarUrl, '_blank');
                    }}
                    sx={{ 
                      borderColor: '#4285f4',
                      color: '#4285f4',
                      '&:hover': {
                        borderColor: '#357ae8',
                        bgcolor: 'rgba(66, 133, 244, 0.04)',
                      }
                    }}
                  >
                    Add to Calendar
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => {
                      setSelectedReservation(reservation);
                      setOpenModifyDialog(true);
                    }}
                  >
                    Modify
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<CancelIcon />}
                    onClick={() => {
                      setSelectedReservation(reservation);
                      setOpenCancelDialog(true);
                    }}
                  >
                    Cancel
                  </Button>
                </>
              )}
              
              {reservation.status === 'completed' && !reservation.rating && (
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<ReviewIcon />}
                  onClick={() => {
                    setSelectedReservation(reservation);
                    setOpenReviewDialog(true);
                  }}
                >
                  Write Review
                </Button>
              )}
              
              <Button
                variant="text"
                size="small"
                onClick={() => navigate(`/restaurant/${reservation.id}`)}
              >
                View Restaurant
              </Button>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const renderReservations = (reservationList: Reservation[]) => {
    if (reservationList.length === 0) {
      return (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <RestaurantIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No reservations found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Start exploring restaurants and make your first reservation!
          </Typography>
          <Button variant="contained" onClick={() => navigate('/search')}>
            Find Restaurants
          </Button>
        </Paper>
      );
    }

    return reservationList.map(reservation => (
      <ReservationCard key={reservation.id} reservation={reservation} />
    ));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Reservations
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab icon={<UpcomingIcon />} label="Upcoming" />
          <Tab icon={<HistoryIcon />} label="Past" />
          <Tab icon={<CancelledIcon />} label="Cancelled" />
        </Tabs>
      </Box>

      {tabValue === 0 && (
        <Box>
          {getUpcomingReservations().length > 0 && (
            <Alert severity="info" sx={{ mb: 2 }}>
              You have {getUpcomingReservations().length} upcoming reservation(s)
            </Alert>
          )}
          {renderReservations(getUpcomingReservations())}
        </Box>
      )}

      {tabValue === 1 && renderReservations(getPastReservations())}
      
      {tabValue === 2 && renderReservations(getCancelledReservations())}

      {/* Cancel Reservation Dialog */}
      <Dialog open={openCancelDialog} onClose={() => setOpenCancelDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Cancel Reservation</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to cancel your reservation at {selectedReservation?.restaurantName}?
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Date: {selectedReservation?.date} at {selectedReservation?.time}
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Reason for cancellation (optional)"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCancelDialog(false)}>Keep Reservation</Button>
          <Button onClick={handleCancelReservation} color="error" variant="contained">
            Cancel Reservation
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modify Reservation Dialog */}
      <Dialog open={openModifyDialog} onClose={() => setOpenModifyDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Modify Reservation</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            To modify your reservation, please cancel this one and create a new reservation with your preferred date and time.
          </Alert>
          <Typography variant="body2">
            Current reservation: {selectedReservation?.restaurantName}
          </Typography>
          <Typography variant="body2">
            Date: {selectedReservation?.date} at {selectedReservation?.time}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModifyDialog(false)}>Close</Button>
          <Button 
            onClick={() => {
              setOpenModifyDialog(false);
              navigate(`/restaurant/${selectedReservation?.id}`);
            }} 
            variant="contained"
          >
            Make New Reservation
          </Button>
        </DialogActions>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={openReviewDialog} onClose={() => setOpenReviewDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Write a Review</DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            {selectedReservation?.restaurantName}
          </Typography>
          <Box sx={{ my: 2 }}>
            <Typography component="legend">Your Rating</Typography>
            <Rating
              value={reviewRating}
              onChange={(e, newValue) => setReviewRating(newValue || 5)}
              size="large"
            />
          </Box>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Your Review"
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            placeholder="Share your experience..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReviewDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmitReview} variant="contained">
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyReservationsPage;