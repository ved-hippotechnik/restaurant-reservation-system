import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  Tooltip,
  useMediaQuery,
  Stack,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Search,
  FilterList,
  Visibility,
  Edit,
  CheckCircle,
  Cancel,
  AccessTime,
  Person,
  Phone,
  Email,
  Restaurant,
  CalendarToday,
  Group,
} from '@mui/icons-material';
import { format } from 'date-fns';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import ReservationCard from '../../components/ReservationCard';
import LoadingState from '../../components/LoadingState';
import ErrorState from '../../components/ErrorState';

interface Reservation {
  id: number;
  reservationCode: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  restaurantName: string;
  tableNumber: string;
  reservationDateTime: string;
  partySize: number;
  status: string;
  specialRequests?: string;
  occasionType?: string;
}

const ReservationsPage: React.FC = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In real app, fetch from API
        // const response = await axios.get('/api/v1/reservations');
        // setReservations(response.data);
        
        const mockReservations: Reservation[] = [
      {
        id: 1,
        reservationCode: 'RES001',
        customerName: 'John Doe',
        customerPhone: '(555) 123-4567',
        customerEmail: 'john.doe@email.com',
        restaurantName: 'The Grand Dining',
        tableNumber: 'Table 5',
        reservationDateTime: new Date().toISOString(),
        partySize: 4,
        status: 'CONFIRMED',
        specialRequests: 'Window seat preferred',
        occasionType: 'Birthday',
      },
      {
        id: 2,
        reservationCode: 'RES002',
        customerName: 'Jane Smith',
        customerPhone: '(555) 987-6543',
        customerEmail: 'jane.smith@email.com',
        restaurantName: 'The Grand Dining',
        tableNumber: 'Table 3',
        reservationDateTime: new Date(Date.now() + 3600000).toISOString(),
        partySize: 2,
        status: 'PENDING',
      },
      {
        id: 3,
        reservationCode: 'RES003',
        customerName: 'Mike Johnson',
        customerPhone: '(555) 456-7890',
        customerEmail: 'mike.j@email.com',
        restaurantName: 'The Grand Dining',
        tableNumber: 'Table 8',
        reservationDateTime: new Date(Date.now() + 7200000).toISOString(),
        partySize: 6,
        status: 'ARRIVED',
        occasionType: 'Anniversary',
      },
      {
        id: 4,
        reservationCode: 'RES004',
        customerName: 'Sarah Williams',
        customerPhone: '(555) 321-9876',
        customerEmail: 'sarah.w@email.com',
        restaurantName: 'The Grand Dining',
        tableNumber: 'Table 2',
        reservationDateTime: new Date(Date.now() - 3600000).toISOString(),
        partySize: 3,
        status: 'COMPLETED',
      },
    ];

        setReservations(mockReservations);
        setFilteredReservations(mockReservations);
      } catch (err) {
        console.error('Error fetching reservations:', err);
        setError('Failed to load reservations. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReservations();
  }, []);

  useEffect(() => {
    let filtered = reservations;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (res) =>
          res.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          res.reservationCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          res.customerPhone.includes(searchTerm)
      );
    }

    // Filter by status
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter((res) => res.status === statusFilter);
    }

    setFilteredReservations(filtered);
  }, [searchTerm, statusFilter, reservations]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'ARRIVED':
        return 'info';
      case 'COMPLETED':
        return 'default';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleStatusUpdate = async (reservationId: number, newStatus: string) => {
    try {
      // In real app, make API call
      // await axios.put(`/api/v1/reservations/${reservationId}/status`, { status: newStatus });
      
      // Update local state
      setReservations((prev) =>
        prev.map((res) =>
          res.id === reservationId ? { ...res, status: newStatus } : res
        )
      );
      setDetailsModalOpen(false);
    } catch (error) {
      console.error('Error updating reservation status:', error);
    }
  };

  const handleViewDetails = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setDetailsModalOpen(true);
  };

  const stats = {
    total: reservations.length,
    confirmed: reservations.filter((r) => r.status === 'CONFIRMED').length,
    arrived: reservations.filter((r) => r.status === 'ARRIVED').length,
    pending: reservations.filter((r) => r.status === 'PENDING').length,
  };

  const handleRetry = () => {
    window.location.reload();
  };

  if (isLoading) {
    return <LoadingState message="Loading reservations..." />;
  }

  if (error) {
    return <ErrorState title="Failed to load reservations" message={error} onRetry={handleRetry} />;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' } }}>
        Reservations
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Reservations
              </Typography>
              <Typography variant="h4">{stats.total}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Confirmed
              </Typography>
              <Typography variant="h4" color="success.main">
                {stats.confirmed}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Arrived
              </Typography>
              <Typography variant="h4" color="info.main">
                {stats.arrived}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Pending
              </Typography>
              <Typography variant="h4" color="warning.main">
                {stats.pending}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Search */}
      <Paper sx={{ p: { xs: 2, sm: 2 }, mb: 3 }}>
        <Stack spacing={2}>
          <TextField
            placeholder="Search by name, code, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              sx={{ flex: { xs: 1, sm: 0 }, minWidth: { xs: 0, sm: 200 } }}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={(e) => setFilterAnchorEl(e.currentTarget)}
              sx={{ flex: { xs: 1, sm: 0 } }}
            >
              Status: {statusFilter}
            </Button>
          </Box>
        </Stack>
          <Menu
            anchorEl={filterAnchorEl}
            open={Boolean(filterAnchorEl)}
            onClose={() => setFilterAnchorEl(null)}
          >
            <MenuItem onClick={() => { setStatusFilter('ALL'); setFilterAnchorEl(null); }}>
              All Statuses
            </MenuItem>
            <MenuItem onClick={() => { setStatusFilter('PENDING'); setFilterAnchorEl(null); }}>
              Pending
            </MenuItem>
            <MenuItem onClick={() => { setStatusFilter('CONFIRMED'); setFilterAnchorEl(null); }}>
              Confirmed
            </MenuItem>
            <MenuItem onClick={() => { setStatusFilter('ARRIVED'); setFilterAnchorEl(null); }}>
              Arrived
            </MenuItem>
            <MenuItem onClick={() => { setStatusFilter('COMPLETED'); setFilterAnchorEl(null); }}>
              Completed
            </MenuItem>
            <MenuItem onClick={() => { setStatusFilter('CANCELLED'); setFilterAnchorEl(null); }}>
              Cancelled
            </MenuItem>
          </Menu>
      </Paper>

      {/* Reservations List/Table */}
      {isMobile ? (
        // Mobile Card View
        <Box>
          {filteredReservations.map((reservation) => (
            <ReservationCard
              key={reservation.id}
              reservation={reservation}
              onViewDetails={handleViewDetails}
            />
          ))}
        </Box>
      ) : (
        // Desktop Table View
        <TableContainer component={Paper}>
          <Table>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Party Size</TableCell>
              <TableCell>Table</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReservations.map((reservation) => (
              <TableRow key={reservation.id} hover>
                <TableCell>{reservation.reservationCode}</TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2">{reservation.customerName}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {reservation.customerPhone}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2">
                      {format(new Date(reservation.reservationDateTime), 'MMM dd, yyyy')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {format(new Date(reservation.reservationDateTime), 'h:mm a')}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{reservation.partySize} guests</TableCell>
                <TableCell>{reservation.tableNumber}</TableCell>
                <TableCell>
                  <Chip
                    label={reservation.status}
                    color={getStatusColor(reservation.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="View Details">
                    <IconButton
                      size="small"
                      onClick={() => handleViewDetails(reservation)}
                    >
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton size="small">
                      <Edit />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Reservation Details Modal */}
      <Dialog open={detailsModalOpen} onClose={() => setDetailsModalOpen(false)} maxWidth="sm" fullWidth>
        {selectedReservation && (
          <>
            <DialogTitle>
              Reservation Details - {selectedReservation.reservationCode}
            </DialogTitle>
            <DialogContent>
              <Box sx={{ pt: 2 }}>
                <Grid container spacing={2}>
                  <Grid size={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Person sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="h6">{selectedReservation.customerName}</Typography>
                    </Box>
                  </Grid>
                  
                  <Grid size={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Phone sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                      <Typography variant="body2">{selectedReservation.customerPhone}</Typography>
                    </Box>
                  </Grid>
                  
                  <Grid size={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Email sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                      <Typography variant="body2">{selectedReservation.customerEmail}</Typography>
                    </Box>
                  </Grid>
                  
                  <Grid size={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CalendarToday sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                      <Typography variant="body2">
                        {format(new Date(selectedReservation.reservationDateTime), 'MMM dd, yyyy')}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid size={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AccessTime sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                      <Typography variant="body2">
                        {format(new Date(selectedReservation.reservationDateTime), 'h:mm a')}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid size={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Group sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                      <Typography variant="body2">{selectedReservation.partySize} guests</Typography>
                    </Box>
                  </Grid>
                  
                  <Grid size={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Restaurant sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                      <Typography variant="body2">{selectedReservation.tableNumber}</Typography>
                    </Box>
                  </Grid>
                  
                  {selectedReservation.specialRequests && (
                    <Grid size={12}>
                      <Typography variant="subtitle2" gutterBottom>
                        Special Requests
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedReservation.specialRequests}
                      </Typography>
                    </Grid>
                  )}
                  
                  {selectedReservation.occasionType && (
                    <Grid size={12}>
                      <Typography variant="subtitle2" gutterBottom>
                        Occasion
                      </Typography>
                      <Chip label={selectedReservation.occasionType} size="small" />
                    </Grid>
                  )}
                  
                  <Grid size={12}>
                    <Typography variant="subtitle2" gutterBottom>
                      Current Status
                    </Typography>
                    <Chip
                      label={selectedReservation.status}
                      color={getStatusColor(selectedReservation.status) as any}
                    />
                  </Grid>
                </Grid>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailsModalOpen(false)}>Close</Button>
              {selectedReservation.status === 'PENDING' && (
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<CheckCircle />}
                  onClick={() => handleStatusUpdate(selectedReservation.id, 'CONFIRMED')}
                >
                  Confirm
                </Button>
              )}
              {selectedReservation.status === 'CONFIRMED' && (
                <Button
                  variant="contained"
                  color="info"
                  startIcon={<CheckCircle />}
                  onClick={() => handleStatusUpdate(selectedReservation.id, 'ARRIVED')}
                >
                  Mark Arrived
                </Button>
              )}
              {selectedReservation.status === 'ARRIVED' && (
                <Button
                  variant="contained"
                  startIcon={<CheckCircle />}
                  onClick={() => handleStatusUpdate(selectedReservation.id, 'COMPLETED')}
                >
                  Complete
                </Button>
              )}
              {['PENDING', 'CONFIRMED'].includes(selectedReservation.status) && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Cancel />}
                  onClick={() => handleStatusUpdate(selectedReservation.id, 'CANCELLED')}
                >
                  Cancel
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default ReservationsPage;