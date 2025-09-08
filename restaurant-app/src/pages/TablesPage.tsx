import React, { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, Grid, Box, Chip } from '@mui/material';
import { TableRestaurant } from '@mui/icons-material';
import LoadingState from '../components/LoadingState';

const TablesPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const tables = [
    { id: 1, number: 1, capacity: 2, status: 'available' },
    { id: 2, number: 2, capacity: 4, status: 'occupied' },
    { id: 3, number: 3, capacity: 4, status: 'available' },
    { id: 4, number: 4, capacity: 6, status: 'reserved' },
    { id: 5, number: 5, capacity: 2, status: 'occupied' },
    { id: 6, number: 6, capacity: 8, status: 'available' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'success';
      case 'occupied': return 'error';
      case 'reserved': return 'warning';
      default: return 'default';
    }
  };

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Table Management
        </Typography>
        <LoadingState type="card" />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Table Management
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {tables.map((table) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={table.id}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                '&:hover': { boxShadow: 6 },
                borderTop: 4,
                borderColor: `${getStatusColor(table.status)}.main`,
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h5">
                    Table {table.number}
                  </Typography>
                  <TableRestaurant color="action" />
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Capacity: {table.capacity} guests
                </Typography>
                <Chip 
                  label={table.status.toUpperCase()} 
                  color={getStatusColor(table.status) as any}
                  size="small"
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default TablesPage;