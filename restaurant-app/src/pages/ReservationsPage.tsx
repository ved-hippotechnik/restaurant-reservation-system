import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Avatar,
  Tooltip,
  Grid,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import {
  Search,
  Add,
  Edit,
  Cancel,
  CheckCircle,
  Phone,
  Email,
  Message,
  TableRestaurant,
  FilterList,
  Download,
  Print,
  Google,
} from '@mui/icons-material';
import LoadingState from '../components/LoadingState';
import { useReservations, Reservation } from '../contexts/ReservationContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const ReservationsPage: React.FC = () => {
  const {
    reservations,
    todayReservations,
    upcomingReservations,
    loading,
    updateReservationStatus,
    assignTable,
    addNote,
    createReservation,
  } = useReservations();

  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openNewDialog, setOpenNewDialog] = useState(false);
  const [newReservation, setNewReservation] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    date: new Date().toISOString().split('T')[0],
    time: '19:00',
    partySize: 2,
    specialRequests: '',
    source: 'phone' as const,
  });

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

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'google': return <Google sx={{ fontSize: 16 }} />;
      case 'phone': return <Phone sx={{ fontSize: 16 }} />;
      case 'website': return '🌐';
      case 'walk-in': return '🚶';
      default: return null;
    }
  };

  const filterReservations = (reservationList: Reservation[]) => {
    let filtered = [...reservationList];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(res =>
        res.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.customerPhone.includes(searchQuery)
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(res => res.status === filterStatus);
    }

    return filtered;
  };

  const getDisplayReservations = () => {
    switch (tabValue) {
      case 0: return filterReservations(todayReservations);
      case 1: return filterReservations(upcomingReservations);
      case 2: return filterReservations(reservations);
      default: return [];
    }
  };

  const handleCreateReservation = () => {
    createReservation(newReservation);
    setOpenNewDialog(false);
    setNewReservation({
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      date: new Date().toISOString().split('T')[0],
      time: '19:00',
      partySize: 2,
      specialRequests: '',
      source: 'phone',
    });
  };

  const handleExport = () => {
    const data = getDisplayReservations();
    const csv = [
      ['Name', 'Email', 'Phone', 'Date', 'Time', 'Party Size', 'Status', 'Source'],
      ...data.map(r => [
        r.customerName,
        r.customerEmail,
        r.customerPhone,
        r.date,
        r.time,
        r.partySize,
        r.status,
        r.source,
      ]),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reservations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const displayReservations = getDisplayReservations();

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <LoadingState type="table" rows={8} columns={6} />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Reservations Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage all restaurant reservations and bookings
        </Typography>
      </Box>

      {/* Actions Bar */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ flex: 1, minWidth: 300 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
            
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                label="Status"
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="confirmed">Confirmed</MenuItem>
                <MenuItem value="seated">Seated</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
                <MenuItem value="no-show">No Show</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenNewDialog(true)}
            >
              New Reservation
            </Button>

            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={handleExport}
            >
              Export
            </Button>

            <IconButton onClick={() => window.print()}>
              <Print />
            </IconButton>
          </Box>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab label={`Today (${todayReservations.length})`} />
          <Tab label={`Upcoming (${upcomingReservations.length})`} />
          <Tab label={`All (${reservations.length})`} />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <ReservationTable 
            reservations={displayReservations}
            onStatusChange={updateReservationStatus}
            onAssignTable={assignTable}
            onViewDetails={setSelectedReservation}
            getStatusColor={getStatusColor}
            getSourceIcon={getSourceIcon}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <ReservationTable 
            reservations={displayReservations}
            onStatusChange={updateReservationStatus}
            onAssignTable={assignTable}
            onViewDetails={setSelectedReservation}
            getStatusColor={getStatusColor}
            getSourceIcon={getSourceIcon}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <ReservationTable 
            reservations={displayReservations}
            onStatusChange={updateReservationStatus}
            onAssignTable={assignTable}
            onViewDetails={setSelectedReservation}
            getStatusColor={getStatusColor}
            getSourceIcon={getSourceIcon}
          />
        </TabPanel>
      </Card>

      {/* New Reservation Dialog */}
      <Dialog open={openNewDialog} onClose={() => setOpenNewDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Reservation</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Customer Name"
                value={newReservation.customerName}
                onChange={(e) => setNewReservation({ ...newReservation, customerName: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={newReservation.customerEmail}
                onChange={(e) => setNewReservation({ ...newReservation, customerEmail: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={newReservation.customerPhone}
                onChange={(e) => setNewReservation({ ...newReservation, customerPhone: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Date"
                value={newReservation.date}
                onChange={(e) => setNewReservation({ ...newReservation, date: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="time"
                label="Time"
                value={newReservation.time}
                onChange={(e) => setNewReservation({ ...newReservation, time: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Party Size"
                value={newReservation.partySize}
                onChange={(e) => setNewReservation({ ...newReservation, partySize: parseInt(e.target.value) })}
                inputProps={{ min: 1, max: 20 }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Source</InputLabel>
                <Select
                  value={newReservation.source}
                  label="Source"
                  onChange={(e) => setNewReservation({ ...newReservation, source: e.target.value as any })}
                >
                  <MenuItem value="phone">Phone</MenuItem>
                  <MenuItem value="walk-in">Walk-in</MenuItem>
                  <MenuItem value="website">Website</MenuItem>
                  <MenuItem value="google">Google</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Special Requests"
                value={newReservation.specialRequests}
                onChange={(e) => setNewReservation({ ...newReservation, specialRequests: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateReservation}>
            Create Reservation
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

// Reservation Table Component
interface ReservationTableProps {
  reservations: Reservation[];
  onStatusChange: (id: number, status: Reservation['status']) => void;
  onAssignTable: (id: number, table: number) => void;
  onViewDetails: (reservation: Reservation) => void;
  getStatusColor: (status: string) => string;
  getSourceIcon: (source: string) => React.ReactNode;
}

const ReservationTable: React.FC<ReservationTableProps> = ({
  reservations,
  onStatusChange,
  onAssignTable,
  onViewDetails,
  getStatusColor,
  getSourceIcon,
}) => {
  return (
    <TableContainer component={Paper} elevation={0}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Customer</TableCell>
            <TableCell>Contact</TableCell>
            <TableCell>Date & Time</TableCell>
            <TableCell>Party</TableCell>
            <TableCell>Table</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Source</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reservations.map((reservation) => (
            <TableRow key={reservation.id} hover>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar sx={{ width: 32, height: 32 }}>
                    {reservation.customerName.charAt(0)}
                  </Avatar>
                  <Typography variant="body2">{reservation.customerName}</Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="body2">{reservation.customerEmail}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {reservation.customerPhone}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="body2">{reservation.date}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {reservation.time}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>{reservation.partySize}</TableCell>
              <TableCell>
                {reservation.tableNumber ? (
                  <Chip 
                    label={`Table ${reservation.tableNumber}`} 
                    size="small" 
                    icon={<TableRestaurant />}
                  />
                ) : (
                  <Button
                    size="small"
                    onClick={() => {
                      const table = prompt('Assign table number:');
                      if (table) onAssignTable(reservation.id, parseInt(table));
                    }}
                  >
                    Assign
                  </Button>
                )}
              </TableCell>
              <TableCell>
                <Chip 
                  label={reservation.status} 
                  size="small" 
                  color={getStatusColor(reservation.status) as any}
                />
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {getSourceIcon(reservation.source)}
                  <Typography variant="caption">{reservation.source}</Typography>
                </Box>
              </TableCell>
              <TableCell align="right">
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                  <Tooltip title="Contact">
                    <IconButton size="small" href={`tel:${reservation.customerPhone}`}>
                      <Phone fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Email">
                    <IconButton size="small" href={`mailto:${reservation.customerEmail}`}>
                      <Email fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  {reservation.status === 'pending' && (
                    <Tooltip title="Confirm">
                      <IconButton 
                        size="small" 
                        color="success"
                        onClick={() => onStatusChange(reservation.id, 'confirmed')}
                      >
                        <CheckCircle fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  {reservation.status !== 'cancelled' && (
                    <Tooltip title="Cancel">
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => onStatusChange(reservation.id, 'cancelled')}
                      >
                        <Cancel fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ReservationsPage;