import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Grid,
  Divider,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  InputAdornment,
  Card,
  CardContent,
} from '@mui/material';
import {
  Save as SaveIcon,
  Restaurant as RestaurantIcon,
  Schedule as ScheduleIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Payment as PaymentIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Language as LanguageIcon,
} from '@mui/icons-material';

interface BusinessHours {
  day: string;
  open: string;
  close: string;
  closed: boolean;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const SettingsPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [saved, setSaved] = useState(false);
  
  // Restaurant settings
  const [restaurantSettings, setRestaurantSettings] = useState({
    name: 'The Gourmet Kitchen',
    email: 'contact@gourmetkitchen.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street, New York, NY 10001',
    website: 'www.gourmetkitchen.com',
    description: 'Fine dining restaurant specializing in contemporary cuisine',
    timezone: 'America/New_York',
    currency: 'USD',
    language: 'en',
  });

  // Business hours
  const [businessHours, setBusinessHours] = useState<BusinessHours[]>([
    { day: 'Monday', open: '11:00', close: '22:00', closed: false },
    { day: 'Tuesday', open: '11:00', close: '22:00', closed: false },
    { day: 'Wednesday', open: '11:00', close: '22:00', closed: false },
    { day: 'Thursday', open: '11:00', close: '23:00', closed: false },
    { day: 'Friday', open: '11:00', close: '23:00', closed: false },
    { day: 'Saturday', open: '10:00', close: '23:00', closed: false },
    { day: 'Sunday', open: '10:00', close: '21:00', closed: false },
  ]);

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    newReservation: true,
    cancellation: true,
    modification: true,
    dailySummary: true,
    weeklyReport: false,
    notificationEmail: 'manager@gourmetkitchen.com',
    notificationPhone: '+1 (555) 123-4567',
  });

  // Reservation settings
  const [reservationSettings, setReservationSettings] = useState({
    minAdvanceTime: 2, // hours
    maxAdvanceTime: 30, // days
    defaultDuration: 90, // minutes
    maxPartySize: 12,
    requireDeposit: false,
    depositAmount: 50,
    autoConfirm: true,
    allowWaitlist: true,
    bufferTime: 15, // minutes between reservations
    cancellationWindow: 4, // hours
  });

  // Payment settings
  const [paymentSettings, setPaymentSettings] = useState({
    acceptCreditCards: true,
    acceptCash: true,
    acceptDigitalWallets: true,
    requirePrepayment: false,
    taxRate: 8.875,
    serviceCharge: 0,
    gratuityIncluded: false,
    gratuityPercentage: 18,
  });

  const handleSave = () => {
    // Save settings logic here
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleBusinessHoursChange = (index: number, field: string, value: any) => {
    const newHours = [...businessHours];
    newHours[index] = { ...newHours[index], [field]: value };
    setBusinessHours(newHours);
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Settings</Typography>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
        >
          Save Changes
        </Button>
      </Box>

      {saved && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Settings saved successfully!
        </Alert>
      )}

      <Paper sx={{ width: '100%' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="settings tabs">
          <Tab icon={<RestaurantIcon />} label="Restaurant" />
          <Tab icon={<ScheduleIcon />} label="Business Hours" />
          <Tab icon={<NotificationsIcon />} label="Notifications" />
          <Tab icon={<SecurityIcon />} label="Reservations" />
          <Tab icon={<PaymentIcon />} label="Payment" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Typography variant="h6" gutterBottom>
            Restaurant Information
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Restaurant Name"
                value={restaurantSettings.name}
                onChange={(e) => setRestaurantSettings({ ...restaurantSettings, name: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <RestaurantIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Website"
                value={restaurantSettings.website}
                onChange={(e) => setRestaurantSettings({ ...restaurantSettings, website: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LanguageIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={restaurantSettings.email}
                onChange={(e) => setRestaurantSettings({ ...restaurantSettings, email: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Phone"
                value={restaurantSettings.phone}
                onChange={(e) => setRestaurantSettings({ ...restaurantSettings, phone: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Address"
                value={restaurantSettings.address}
                onChange={(e) => setRestaurantSettings({ ...restaurantSettings, address: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={restaurantSettings.description}
                onChange={(e) => setRestaurantSettings({ ...restaurantSettings, description: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Timezone</InputLabel>
                <Select
                  value={restaurantSettings.timezone}
                  onChange={(e) => setRestaurantSettings({ ...restaurantSettings, timezone: e.target.value })}
                  label="Timezone"
                >
                  <MenuItem value="America/New_York">Eastern Time</MenuItem>
                  <MenuItem value="America/Chicago">Central Time</MenuItem>
                  <MenuItem value="America/Denver">Mountain Time</MenuItem>
                  <MenuItem value="America/Los_Angeles">Pacific Time</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Currency</InputLabel>
                <Select
                  value={restaurantSettings.currency}
                  onChange={(e) => setRestaurantSettings({ ...restaurantSettings, currency: e.target.value })}
                  label="Currency"
                >
                  <MenuItem value="USD">USD ($)</MenuItem>
                  <MenuItem value="EUR">EUR (€)</MenuItem>
                  <MenuItem value="GBP">GBP (£)</MenuItem>
                  <MenuItem value="JPY">JPY (¥)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Language</InputLabel>
                <Select
                  value={restaurantSettings.language}
                  onChange={(e) => setRestaurantSettings({ ...restaurantSettings, language: e.target.value })}
                  label="Language"
                >
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="es">Spanish</MenuItem>
                  <MenuItem value="fr">French</MenuItem>
                  <MenuItem value="de">German</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Business Hours
          </Typography>
          <List>
            {businessHours.map((hours, index) => (
              <ListItem key={hours.day}>
                <Grid container spacing={2} alignItems="center">
                  <Grid size={3}>
                    <Typography>{hours.day}</Typography>
                  </Grid>
                  <Grid size={3}>
                    <TextField
                      type="time"
                      value={hours.open}
                      onChange={(e) => handleBusinessHoursChange(index, 'open', e.target.value)}
                      disabled={hours.closed}
                      size="small"
                    />
                  </Grid>
                  <Grid size={3}>
                    <TextField
                      type="time"
                      value={hours.close}
                      onChange={(e) => handleBusinessHoursChange(index, 'close', e.target.value)}
                      disabled={hours.closed}
                      size="small"
                    />
                  </Grid>
                  <Grid size={3}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={hours.closed}
                          onChange={(e) => handleBusinessHoursChange(index, 'closed', e.target.checked)}
                        />
                      }
                      label="Closed"
                    />
                  </Grid>
                </Grid>
              </ListItem>
            ))}
          </List>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom>
            Special Dates
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            Configure special hours for holidays and events
          </Alert>
          <Button startIcon={<AddIcon />} variant="outlined">
            Add Special Date
          </Button>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Notification Preferences
          </Typography>
          <Grid container spacing={3}>
            <Grid size={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, emailNotifications: e.target.checked })}
                  />
                }
                label="Email Notifications"
              />
            </Grid>
            <Grid size={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={notificationSettings.smsNotifications}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, smsNotifications: e.target.checked })}
                  />
                }
                label="SMS Notifications"
              />
            </Grid>
            
            <Grid size={12}>
              <Divider />
            </Grid>
            
            <Grid size={12}>
              <Typography variant="subtitle1" gutterBottom>
                Notification Types
              </Typography>
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={notificationSettings.newReservation}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, newReservation: e.target.checked })}
                  />
                }
                label="New Reservation"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={notificationSettings.cancellation}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, cancellation: e.target.checked })}
                  />
                }
                label="Cancellation"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={notificationSettings.modification}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, modification: e.target.checked })}
                  />
                }
                label="Modification"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={notificationSettings.dailySummary}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, dailySummary: e.target.checked })}
                  />
                }
                label="Daily Summary"
              />
            </Grid>
            
            <Grid size={12}>
              <Divider />
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Notification Email"
                type="email"
                value={notificationSettings.notificationEmail}
                onChange={(e) => setNotificationSettings({ ...notificationSettings, notificationEmail: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Notification Phone"
                value={notificationSettings.notificationPhone}
                onChange={(e) => setNotificationSettings({ ...notificationSettings, notificationPhone: e.target.value })}
              />
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>
            Reservation Settings
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Minimum Advance Booking (hours)"
                value={reservationSettings.minAdvanceTime}
                onChange={(e) => setReservationSettings({ ...reservationSettings, minAdvanceTime: parseInt(e.target.value) })}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Maximum Advance Booking (days)"
                value={reservationSettings.maxAdvanceTime}
                onChange={(e) => setReservationSettings({ ...reservationSettings, maxAdvanceTime: parseInt(e.target.value) })}
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Default Reservation Duration (minutes)"
                value={reservationSettings.defaultDuration}
                onChange={(e) => setReservationSettings({ ...reservationSettings, defaultDuration: parseInt(e.target.value) })}
                InputProps={{ inputProps: { min: 30, step: 15 } }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Maximum Party Size"
                value={reservationSettings.maxPartySize}
                onChange={(e) => setReservationSettings({ ...reservationSettings, maxPartySize: parseInt(e.target.value) })}
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Buffer Time Between Reservations (minutes)"
                value={reservationSettings.bufferTime}
                onChange={(e) => setReservationSettings({ ...reservationSettings, bufferTime: parseInt(e.target.value) })}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Cancellation Window (hours)"
                value={reservationSettings.cancellationWindow}
                onChange={(e) => setReservationSettings({ ...reservationSettings, cancellationWindow: parseInt(e.target.value) })}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
            
            <Grid size={12}>
              <Divider />
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={reservationSettings.autoConfirm}
                    onChange={(e) => setReservationSettings({ ...reservationSettings, autoConfirm: e.target.checked })}
                  />
                }
                label="Auto-confirm Reservations"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={reservationSettings.allowWaitlist}
                    onChange={(e) => setReservationSettings({ ...reservationSettings, allowWaitlist: e.target.checked })}
                  />
                }
                label="Allow Waitlist"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={reservationSettings.requireDeposit}
                    onChange={(e) => setReservationSettings({ ...reservationSettings, requireDeposit: e.target.checked })}
                  />
                }
                label="Require Deposit"
              />
            </Grid>
            {reservationSettings.requireDeposit && (
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Deposit Amount ($)"
                  value={reservationSettings.depositAmount}
                  onChange={(e) => setReservationSettings({ ...reservationSettings, depositAmount: parseInt(e.target.value) })}
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>
            )}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={4}>
          <Typography variant="h6" gutterBottom>
            Payment Settings
          </Typography>
          <Grid container spacing={3}>
            <Grid size={12}>
              <Typography variant="subtitle1" gutterBottom>
                Accepted Payment Methods
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={paymentSettings.acceptCreditCards}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, acceptCreditCards: e.target.checked })}
                  />
                }
                label="Credit Cards"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={paymentSettings.acceptCash}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, acceptCash: e.target.checked })}
                  />
                }
                label="Cash"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={paymentSettings.acceptDigitalWallets}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, acceptDigitalWallets: e.target.checked })}
                  />
                }
                label="Digital Wallets"
              />
            </Grid>
            
            <Grid size={12}>
              <Divider />
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Tax Rate (%)"
                value={paymentSettings.taxRate}
                onChange={(e) => setPaymentSettings({ ...paymentSettings, taxRate: parseFloat(e.target.value) })}
                InputProps={{ inputProps: { min: 0, step: 0.01 } }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Service Charge (%)"
                value={paymentSettings.serviceCharge}
                onChange={(e) => setPaymentSettings({ ...paymentSettings, serviceCharge: parseFloat(e.target.value) })}
                InputProps={{ inputProps: { min: 0, step: 0.01 } }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={paymentSettings.gratuityIncluded}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, gratuityIncluded: e.target.checked })}
                  />
                }
                label="Gratuity Included"
              />
            </Grid>
            {paymentSettings.gratuityIncluded && (
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Gratuity Percentage (%)"
                  value={paymentSettings.gratuityPercentage}
                  onChange={(e) => setPaymentSettings({ ...paymentSettings, gratuityPercentage: parseFloat(e.target.value) })}
                  InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                />
              </Grid>
            )}
            <Grid size={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={paymentSettings.requirePrepayment}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, requirePrepayment: e.target.checked })}
                  />
                }
                label="Require Prepayment for Reservations"
              />
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default SettingsPage;