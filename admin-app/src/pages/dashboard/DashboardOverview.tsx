import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  People,
  BookOnline,
  TableBar,
  AttachMoney,
  Schedule,
  CheckCircle,
} from '@mui/icons-material';
import { format } from 'date-fns';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const DashboardOverview: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  // Mock statistics
  const stats = {
    todayReservations: 24,
    totalGuests: 87,
    tablesOccupied: 15,
    revenue: 3450,
    pendingReservations: 5,
    confirmedReservations: 19,
    averagePartySize: 3.6,
    peakHour: '7:00 PM',
  };

  const upcomingReservations = [
    {
      id: 1,
      customerName: 'Sarah Johnson',
      time: '6:30 PM',
      partySize: 4,
      status: 'CONFIRMED',
    },
    {
      id: 2,
      customerName: 'Michael Chen',
      time: '7:00 PM',
      partySize: 2,
      status: 'PENDING',
    },
    {
      id: 3,
      customerName: 'Emily Davis',
      time: '7:30 PM',
      partySize: 6,
      status: 'CONFIRMED',
    },
    {
      id: 4,
      customerName: 'Robert Wilson',
      time: '8:00 PM',
      partySize: 3,
      status: 'CONFIRMED',
    },
  ];

  const tableOccupancy = 75; // percentage

  if (loading) {
    return <LoadingSpinner message="Loading dashboard data..." fullScreen />;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        {format(new Date(), 'EEEE, MMMM dd, yyyy')}
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BookOnline sx={{ color: 'primary.main', mr: 1 }} />
                <Typography color="text.secondary" variant="body2">
                  Today's Reservations
                </Typography>
              </Box>
              <Typography variant="h4">{stats.todayReservations}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TrendingUp sx={{ color: 'success.main', fontSize: 16, mr: 0.5 }} />
                <Typography variant="caption" color="success.main">
                  +12% from yesterday
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <People sx={{ color: 'info.main', mr: 1 }} />
                <Typography color="text.secondary" variant="body2">
                  Total Guests
                </Typography>
              </Box>
              <Typography variant="h4">{stats.totalGuests}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Avg party size: {stats.averagePartySize}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TableBar sx={{ color: 'warning.main', mr: 1 }} />
                <Typography color="text.secondary" variant="body2">
                  Tables Occupied
                </Typography>
              </Box>
              <Typography variant="h4">{stats.tablesOccupied}/20</Typography>
              <LinearProgress
                variant="determinate"
                value={tableOccupancy}
                sx={{ mt: 1 }}
                color="warning"
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AttachMoney sx={{ color: 'success.main', mr: 1 }} />
                <Typography color="text.secondary" variant="body2">
                  Est. Revenue
                </Typography>
              </Box>
              <Typography variant="h4">${stats.revenue}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TrendingUp sx={{ color: 'success.main', fontSize: 16, mr: 0.5 }} />
                <Typography variant="caption" color="success.main">
                  +8% from last week
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Upcoming Reservations */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Upcoming Reservations
            </Typography>
            <List>
              {upcomingReservations.map((reservation) => (
                <ListItem key={reservation.id} sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar 
                      sx={{ bgcolor: 'primary.main' }}
                      aria-label={`${reservation.customerName} avatar`}
                    >
                      {reservation.customerName.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={reservation.customerName}
                    secondary={`${reservation.time} • ${reservation.partySize} guests`}
                  />
                  <Chip
                    label={reservation.status}
                    size="small"
                    color={reservation.status === 'CONFIRMED' ? 'success' : 'warning'}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Quick Stats */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Today's Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid size={6}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Schedule sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                  <Typography variant="h6">{stats.peakHour}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Peak Hour
                  </Typography>
                </Box>
              </Grid>
              <Grid size={6}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <CheckCircle sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                  <Typography variant="h6">{stats.confirmedReservations}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Confirmed
                  </Typography>
                </Box>
              </Grid>
              <Grid size={6}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Schedule sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                  <Typography variant="h6">{stats.pendingReservations}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending
                  </Typography>
                </Box>
              </Grid>
              <Grid size={6}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <People sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                  <Typography variant="h6">{stats.averagePartySize}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg Party Size
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardOverview;