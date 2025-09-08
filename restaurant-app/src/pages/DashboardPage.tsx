import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
  Alert,
  Badge,
  Tooltip,
} from '@mui/material';
import {
  People,
  TableRestaurant,
  Schedule,
  TrendingUp,
  CheckCircle,
  PendingActions,
  Cancel,
  PhoneInTalk,
  Email,
  NotificationsActive,
  Refresh,
  EventSeat,
  Timer,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useReservations } from '../contexts/ReservationContext';
import LoadingState from '../components/LoadingState';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { 
    todayReservations, 
    stats, 
    loading,
    refreshReservations,
    updateReservationStatus 
  } = useReservations();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'seated': return 'info';
      case 'completed': return 'default';
      case 'cancelled': return 'error';
      case 'no-show': return 'error';
      default: return 'default';
    }
  };

  const getTimeStatus = (time: string) => {
    const now = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    const reservationTime = new Date();
    reservationTime.setHours(hours, minutes, 0, 0);
    
    const diffMinutes = Math.floor((reservationTime.getTime() - now.getTime()) / 60000);
    
    if (diffMinutes < -30) return { status: 'past', label: 'Past' };
    if (diffMinutes < 0) return { status: 'now', label: 'Now' };
    if (diffMinutes < 30) return { status: 'soon', label: `In ${diffMinutes} min` };
    return { status: 'later', label: time };
  };

  // Sort reservations by time
  const sortedReservations = [...todayReservations].sort((a, b) => {
    return a.time.localeCompare(b.time);
  });

  // Get upcoming reservations (next 2 hours)
  const upcomingReservations = sortedReservations.filter(res => {
    const timeStatus = getTimeStatus(res.time);
    return timeStatus.status === 'soon' || timeStatus.status === 'now';
  });

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <LoadingState type="dashboard" />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Welcome back, {user?.name}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {user?.restaurant.name} • {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={refreshReservations}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2 }}>
                  <People />
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div">
                    {stats.todayTotal}
                  </Typography>
                  <Typography variant="body2">
                    Today's Reservations
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2 }}>
                  <PendingActions />
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div">
                    {stats.todayPending}
                  </Typography>
                  <Typography variant="body2">
                    Pending Confirmation
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2 }}>
                  <EventSeat />
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div">
                    {stats.todaySeated}
                  </Typography>
                  <Typography variant="body2">
                    Currently Seated
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2 }}>
                  <TrendingUp />
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div">
                    {stats.upcomingWeek}
                  </Typography>
                  <Typography variant="body2">
                    Next 7 Days
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Alerts for urgent items */}
      {upcomingReservations.length > 0 && (
        <Alert 
          severity="info" 
          icon={<NotificationsActive />}
          sx={{ mb: 3 }}
        >
          <Typography variant="subtitle1">
            {upcomingReservations.length} reservation{upcomingReservations.length > 1 ? 's' : ''} arriving soon
          </Typography>
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Today's Reservations Timeline */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Schedule sx={{ mr: 1 }} />
                Today's Timeline
              </Typography>
              
              <List sx={{ maxHeight: 600, overflow: 'auto' }}>
                {sortedReservations.map((reservation) => {
                  const timeStatus = getTimeStatus(reservation.time);
                  return (
                    <ListItem
                      key={reservation.id}
                      sx={{
                        mb: 1,
                        bgcolor: timeStatus.status === 'now' ? 'action.selected' : 'background.paper',
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: timeStatus.status === 'now' ? 'primary.main' : 'divider',
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: `${getStatusColor(reservation.status)}.main` }}>
                          {reservation.customerName.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1" fontWeight="medium">
                              {reservation.customerName}
                            </Typography>
                            <Chip 
                              label={reservation.status} 
                              size="small" 
                              color={getStatusColor(reservation.status) as any}
                            />
                            {reservation.source === 'google' && (
                              <Chip 
                                label="Google" 
                                size="small" 
                                sx={{ 
                                  bgcolor: '#4285f4', 
                                  color: 'white',
                                  '& .MuiChip-label': { fontSize: '0.7rem' }
                                }}
                              />
                            )}
                            {timeStatus.status === 'now' && (
                              <Badge color="error" variant="dot">
                                <Timer fontSize="small" color="error" />
                              </Badge>
                            )}
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" component="span">
                              {reservation.time} • {reservation.partySize} guests
                              {reservation.tableNumber && ` • Table ${reservation.tableNumber}`}
                            </Typography>
                            {reservation.specialRequests && (
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                Note: {reservation.specialRequests}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="Call customer">
                            <IconButton 
                              size="small"
                              href={`tel:${reservation.customerPhone}`}
                            >
                              <PhoneInTalk fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Email customer">
                            <IconButton 
                              size="small"
                              href={`mailto:${reservation.customerEmail}`}
                            >
                              <Email fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          {reservation.status === 'pending' && (
                            <Button
                              size="small"
                              variant="contained"
                              color="success"
                              onClick={() => updateReservationStatus(reservation.id, 'confirmed')}
                            >
                              Confirm
                            </Button>
                          )}
                          {reservation.status === 'confirmed' && (
                            <Button
                              size="small"
                              variant="contained"
                              onClick={() => updateReservationStatus(reservation.id, 'seated')}
                            >
                              Seat
                            </Button>
                          )}
                        </Box>
                      </ListItemSecondaryAction>
                    </ListItem>
                  );
                })}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<People />}
                  href="/reservations"
                >
                  View All Reservations
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<TableRestaurant />}
                  href="/tables"
                >
                  Manage Tables
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<PhoneInTalk />}
                  onClick={() => window.location.href = '/reservations?source=phone'}
                >
                  Add Phone Reservation
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Capacity Overview */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tonight's Overview
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="6:00 PM - 7:00 PM" />
                  <Chip label="3 tables" size="small" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="7:00 PM - 8:00 PM" />
                  <Chip label="5 tables" size="small" color="warning" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="8:00 PM - 9:00 PM" />
                  <Chip label="7 tables" size="small" color="error" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="9:00 PM - 10:00 PM" />
                  <Chip label="2 tables" size="small" />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage;