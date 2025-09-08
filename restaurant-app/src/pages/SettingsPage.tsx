import React from 'react';
import { 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Grid,
  Box,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { Save } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Restaurant Settings
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Restaurant Information
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Restaurant Name"
                  defaultValue={user?.restaurant.name}
                />
                <TextField
                  fullWidth
                  label="Address"
                  defaultValue={user?.restaurant.address}
                />
                <TextField
                  fullWidth
                  label="Phone"
                  defaultValue={user?.restaurant.phone}
                />
                <TextField
                  fullWidth
                  label="Email"
                  defaultValue={user?.restaurant.email}
                />
                <Button variant="contained" startIcon={<Save />}>
                  Save Changes
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Reservation Settings
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Accept online reservations"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Accept Google reservations"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Send email confirmations"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Send SMS reminders"
                />
                <TextField
                  fullWidth
                  type="number"
                  label="Max party size"
                  defaultValue="10"
                />
                <TextField
                  fullWidth
                  type="number"
                  label="Advance booking days"
                  defaultValue="30"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SettingsPage;