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
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  Tooltip,
  Fab,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  TableBar as TableIcon,
  People as PeopleIcon,
  CheckCircle as AvailableIcon,
  Cancel as OccupiedIcon,
} from '@mui/icons-material';

interface RestaurantTable {
  id: string;
  number: string;
  capacity: number;
  location: 'main' | 'patio' | 'private' | 'bar';
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  currentReservation?: {
    customerName: string;
    time: string;
    partySize: number;
  };
}

const TablesPage: React.FC = () => {
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTable, setEditingTable] = useState<RestaurantTable | null>(null);
  const [formData, setFormData] = useState<{
    number: string;
    capacity: number;
    location: 'main' | 'patio' | 'private' | 'bar';
    status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  }>({
    number: '',
    capacity: 2,
    location: 'main',
    status: 'available',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8081/api/v1/tables');
      if (response.ok) {
        const data = await response.json();
        setTables(data);
      } else {
        // Mock data if API fails
        setTables([
          {
            id: '1',
            number: 'T01',
            capacity: 4,
            location: 'main',
            status: 'available',
          },
          {
            id: '2',
            number: 'T02',
            capacity: 2,
            location: 'main',
            status: 'occupied',
            currentReservation: {
              customerName: 'John Doe',
              time: '7:00 PM',
              partySize: 2,
            },
          },
          {
            id: '3',
            number: 'T03',
            capacity: 6,
            location: 'patio',
            status: 'reserved',
            currentReservation: {
              customerName: 'Jane Smith',
              time: '8:00 PM',
              partySize: 5,
            },
          },
          {
            id: '4',
            number: 'B01',
            capacity: 4,
            location: 'bar',
            status: 'available',
          },
          {
            id: '5',
            number: 'P01',
            capacity: 8,
            location: 'private',
            status: 'available',
          },
        ]);
      }
    } catch (err) {
      setError('Failed to load tables');
      // Use mock data on error
      setTables([
        {
          id: '1',
          number: 'T01',
          capacity: 4,
          location: 'main',
          status: 'available',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (table?: RestaurantTable) => {
    if (table) {
      setEditingTable(table);
      setFormData({
        number: table.number,
        capacity: table.capacity,
        location: table.location,
        status: table.status,
      });
    } else {
      setEditingTable(null);
      setFormData({
        number: '',
        capacity: 2,
        location: 'main',
        status: 'available',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTable(null);
    setFormData({
      number: '',
      capacity: 2,
      location: 'main',
      status: 'available',
    });
  };

  const handleSaveTable = async () => {
    try {
      if (editingTable) {
        // Update existing table
        const updatedTable = { ...editingTable, ...formData };
        setTables(tables.map(t => t.id === editingTable.id ? updatedTable : t));
      } else {
        // Add new table
        const newTable: RestaurantTable = {
          id: Date.now().toString(),
          ...formData,
        };
        setTables([...tables, newTable]);
      }
      handleCloseDialog();
    } catch (err) {
      setError('Failed to save table');
    }
  };

  const handleDeleteTable = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this table?')) {
      setTables(tables.filter(t => t.id !== id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'success';
      case 'occupied':
        return 'error';
      case 'reserved':
        return 'warning';
      case 'maintenance':
        return 'default';
      default:
        return 'default';
    }
  };

  const getLocationIcon = (location: string) => {
    switch (location) {
      case 'bar':
        return '🍸';
      case 'patio':
        return '☀️';
      case 'private':
        return '🎭';
      default:
        return '🍽️';
    }
  };

  const getStatistics = () => {
    const total = tables.length;
    const available = tables.filter(t => t.status === 'available').length;
    const occupied = tables.filter(t => t.status === 'occupied').length;
    const reserved = tables.filter(t => t.status === 'reserved').length;
    const totalCapacity = tables.reduce((sum, t) => sum + t.capacity, 0);

    return { total, available, occupied, reserved, totalCapacity };
  };

  const stats = getStatistics();

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Tables Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Table
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <TableIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="h6">{stats.total}</Typography>
            <Typography variant="body2" color="text.secondary">
              Total Tables
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <AvailableIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
            <Typography variant="h6">{stats.available}</Typography>
            <Typography variant="body2" color="text.secondary">
              Available
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <OccupiedIcon sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
            <Typography variant="h6">{stats.occupied}</Typography>
            <Typography variant="body2" color="text.secondary">
              Occupied
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <PeopleIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
            <Typography variant="h6">{stats.totalCapacity}</Typography>
            <Typography variant="body2" color="text.secondary">
              Total Capacity
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Tables List */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Table Number</TableCell>
              <TableCell>Location</TableCell>
              <TableCell align="center">Capacity</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Current Reservation</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tables.map((table) => (
              <TableRow key={table.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TableIcon />
                    <Typography variant="body1" fontWeight="medium">
                      {table.number}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>{getLocationIcon(table.location)}</span>
                    <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                      {table.location}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Chip
                    icon={<PeopleIcon />}
                    label={table.capacity}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={table.status}
                    color={getStatusColor(table.status) as any}
                    size="small"
                    sx={{ textTransform: 'capitalize' }}
                  />
                </TableCell>
                <TableCell>
                  {table.currentReservation ? (
                    <Box>
                      <Typography variant="body2">
                        {table.currentReservation.customerName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {table.currentReservation.time} • {table.currentReservation.partySize} guests
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      —
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Edit">
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(table)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteTable(table.id)}
                      color="error"
                      disabled={table.status === 'occupied'}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingTable ? 'Edit Table' : 'Add New Table'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Table Number"
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Capacity"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                inputProps={{ min: 1, max: 20 }}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Location</InputLabel>
                <Select
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value as any })}
                  label="Location"
                >
                  <MenuItem value="main">Main Dining</MenuItem>
                  <MenuItem value="patio">Patio</MenuItem>
                  <MenuItem value="private">Private Room</MenuItem>
                  <MenuItem value="bar">Bar Area</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  label="Status"
                >
                  <MenuItem value="available">Available</MenuItem>
                  <MenuItem value="reserved">Reserved</MenuItem>
                  <MenuItem value="occupied">Occupied</MenuItem>
                  <MenuItem value="maintenance">Maintenance</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveTable} variant="contained">
            {editingTable ? 'Update' : 'Add'} Table
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TablesPage;