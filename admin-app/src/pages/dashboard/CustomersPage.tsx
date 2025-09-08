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
  TablePagination,
  Button,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
  Tab,
  Tabs,
  Rating,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  Star as StarIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  LocalDining as DiningIcon,
  TrendingUp as TrendingIcon,
} from '@mui/icons-material';

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  joinDate: string;
  totalReservations: number;
  loyaltyPoints: number;
  status: 'active' | 'inactive' | 'vip';
  lastVisit?: string;
  favoriteRestaurant?: string;
  averageRating?: number;
  reservationHistory?: {
    id: string;
    date: string;
    restaurant: string;
    partySize: number;
    status: 'completed' | 'cancelled' | 'no-show';
  }[];
}

const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8081/api/v1/customers');
      if (response.ok) {
        const data = await response.json();
        setCustomers(data);
      } else {
        // Mock data if API fails
        setCustomers([
          {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@email.com',
            phone: '+1 (555) 123-4567',
            joinDate: '2023-01-15',
            totalReservations: 24,
            loyaltyPoints: 480,
            status: 'vip',
            lastVisit: '2024-01-10',
            favoriteRestaurant: 'The Italian Kitchen',
            averageRating: 4.8,
            reservationHistory: [
              {
                id: 'r1',
                date: '2024-01-10',
                restaurant: 'The Italian Kitchen',
                partySize: 4,
                status: 'completed',
              },
              {
                id: 'r2',
                date: '2023-12-25',
                restaurant: 'Sushi Palace',
                partySize: 2,
                status: 'completed',
              },
            ],
          },
          {
            id: '2',
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@email.com',
            phone: '+1 (555) 987-6543',
            joinDate: '2023-03-20',
            totalReservations: 12,
            loyaltyPoints: 240,
            status: 'active',
            lastVisit: '2024-01-08',
            favoriteRestaurant: 'Garden Bistro',
            averageRating: 4.5,
          },
          {
            id: '3',
            firstName: 'Michael',
            lastName: 'Johnson',
            email: 'michael.j@email.com',
            phone: '+1 (555) 246-8135',
            joinDate: '2023-06-10',
            totalReservations: 8,
            loyaltyPoints: 160,
            status: 'active',
            lastVisit: '2023-12-20',
            averageRating: 4.2,
          },
          {
            id: '4',
            firstName: 'Emily',
            lastName: 'Brown',
            email: 'emily.brown@email.com',
            phone: '+1 (555) 369-2580',
            joinDate: '2022-11-05',
            totalReservations: 45,
            loyaltyPoints: 900,
            status: 'vip',
            lastVisit: '2024-01-12',
            favoriteRestaurant: 'Ocean View Restaurant',
            averageRating: 4.9,
          },
          {
            id: '5',
            firstName: 'David',
            lastName: 'Wilson',
            email: 'david.w@email.com',
            phone: '+1 (555) 147-2589',
            joinDate: '2023-09-01',
            totalReservations: 3,
            loyaltyPoints: 60,
            status: 'inactive',
            lastVisit: '2023-10-15',
            averageRating: 3.8,
          },
        ]);
      }
    } catch (err) {
      // Use mock data on error
      setCustomers([
        {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@email.com',
          phone: '+1 (555) 123-4567',
          joinDate: '2023-01-15',
          totalReservations: 24,
          loyaltyPoints: 480,
          status: 'vip',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCustomer(null);
    setTabValue(0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'vip':
        return 'warning';
      case 'active':
        return 'success';
      case 'inactive':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'vip':
        return '👑';
      case 'active':
        return '✓';
      case 'inactive':
        return '—';
      default:
        return '';
    }
  };

  const filteredCustomers = customers.filter(customer =>
    `${customer.firstName} ${customer.lastName} ${customer.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const getStatistics = () => {
    const total = customers.length;
    const vip = customers.filter(c => c.status === 'vip').length;
    const active = customers.filter(c => c.status === 'active').length;
    const totalLoyaltyPoints = customers.reduce((sum, c) => sum + c.loyaltyPoints, 0);

    return { total, vip, active, totalLoyaltyPoints };
  };

  const stats = getStatistics();

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Customer Management</Typography>
        <TextField
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: 300 }}
        />
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <PersonIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="h6">{stats.total}</Typography>
            <Typography variant="body2" color="text.secondary">
              Total Customers
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <StarIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
            <Typography variant="h6">{stats.vip}</Typography>
            <Typography variant="body2" color="text.secondary">
              VIP Members
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <TrendingIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
            <Typography variant="h6">{stats.active}</Typography>
            <Typography variant="body2" color="text.secondary">
              Active Customers
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <DiningIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
            <Typography variant="h6">{stats.totalLoyaltyPoints}</Typography>
            <Typography variant="body2" color="text.secondary">
              Total Loyalty Points
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Customers Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Customer</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell align="center">Reservations</TableCell>
              <TableCell align="center">Loyalty Points</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Last Visit</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCustomers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {customer.firstName[0]}{customer.lastName[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          {customer.firstName} {customer.lastName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Member since {new Date(customer.joinDate).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EmailIcon fontSize="small" color="action" />
                        <Typography variant="body2">{customer.email}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <PhoneIcon fontSize="small" color="action" />
                        <Typography variant="body2">{customer.phone}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body1" fontWeight="medium">
                      {customer.totalReservations}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={customer.loyaltyPoints}
                      color="primary"
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={<span>{getStatusIcon(customer.status)}</span>}
                      label={customer.status.toUpperCase()}
                      color={getStatusColor(customer.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {customer.lastVisit ? (
                      <Typography variant="body2">
                        {new Date(customer.lastVisit).toLocaleDateString()}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Never
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => handleViewCustomer(customer)}
                        color="primary"
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton size="small" color="primary">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredCustomers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </TableContainer>

      {/* Customer Details Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        {selectedCustomer && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                  {selectedCustomer.firstName[0]}{selectedCustomer.lastName[0]}
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {selectedCustomer.firstName} {selectedCustomer.lastName}
                  </Typography>
                  <Chip
                    icon={<span>{getStatusIcon(selectedCustomer.status)}</span>}
                    label={selectedCustomer.status.toUpperCase()}
                    color={getStatusColor(selectedCustomer.status) as any}
                    size="small"
                  />
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
                <Tab label="Overview" />
                <Tab label="Reservation History" />
                <Tab label="Preferences" />
              </Tabs>

              {tabValue === 0 && (
                <Box sx={{ mt: 3 }}>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Contact Information
                        </Typography>
                        <List dense>
                          <ListItem>
                            <EmailIcon sx={{ mr: 2 }} color="action" />
                            <ListItemText primary={selectedCustomer.email} />
                          </ListItem>
                          <ListItem>
                            <PhoneIcon sx={{ mr: 2 }} color="action" />
                            <ListItemText primary={selectedCustomer.phone} />
                          </ListItem>
                          <ListItem>
                            <CalendarIcon sx={{ mr: 2 }} color="action" />
                            <ListItemText 
                              primary="Member Since"
                              secondary={new Date(selectedCustomer.joinDate).toLocaleDateString()}
                            />
                          </ListItem>
                        </List>
                      </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Statistics
                        </Typography>
                        <List dense>
                          <ListItem>
                            <ListItemText 
                              primary="Total Reservations"
                              secondary={selectedCustomer.totalReservations}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemText 
                              primary="Loyalty Points"
                              secondary={selectedCustomer.loyaltyPoints}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemText 
                              primary="Average Rating"
                              secondary={
                                <Rating 
                                  value={selectedCustomer.averageRating || 0} 
                                  readOnly 
                                  size="small"
                                />
                              }
                            />
                          </ListItem>
                        </List>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {tabValue === 1 && (
                <Box sx={{ mt: 3 }}>
                  {selectedCustomer.reservationHistory && selectedCustomer.reservationHistory.length > 0 ? (
                    <List>
                      {selectedCustomer.reservationHistory.map((reservation, index) => (
                        <React.Fragment key={reservation.id}>
                          <ListItem>
                            <ListItemText
                              primary={reservation.restaurant}
                              secondary={`${new Date(reservation.date).toLocaleDateString()} • ${reservation.partySize} guests • ${reservation.status}`}
                            />
                            <Chip
                              label={reservation.status}
                              color={reservation.status === 'completed' ? 'success' : 'default'}
                              size="small"
                            />
                          </ListItem>
                          {index < selectedCustomer.reservationHistory!.length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  ) : (
                    <Typography color="text.secondary">No reservation history available</Typography>
                  )}
                </Box>
              )}

              {tabValue === 2 && (
                <Box sx={{ mt: 3 }}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Dining Preferences
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText 
                          primary="Favorite Restaurant"
                          secondary={selectedCustomer.favoriteRestaurant || 'Not specified'}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Last Visit"
                          secondary={selectedCustomer.lastVisit ? new Date(selectedCustomer.lastVisit).toLocaleDateString() : 'Never'}
                        />
                      </ListItem>
                    </List>
                  </Paper>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
              <Button variant="contained" startIcon={<EmailIcon />}>
                Send Email
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default CustomersPage;