import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  Divider,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Restaurant,
  AccountCircle,
  Menu as MenuIcon,
  Close,
  RestaurantMenu,
  Login,
  Business,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ResponsiveNavbar: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Browse Restaurants', path: '/search', icon: <RestaurantMenu /> },
    { text: 'Sign In', path: '/signin', icon: <Login /> },
    { text: 'For Restaurants', path: '/for-restaurants', icon: <Business />, variant: 'contained' as const },
  ];

  const drawer = (
    <Box sx={{ width: 280, height: '100%', bgcolor: 'background.paper' }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Restaurant sx={{ mr: 1, color: '#C41E3A' }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            TableReserve
          </Typography>
        </Box>
        <IconButton
          onClick={handleDrawerToggle}
          aria-label="Close menu"
          sx={{ color: 'text.secondary' }}
        >
          <Close />
        </IconButton>
      </Box>
      <Divider />
      <List sx={{ px: 2, py: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => {
                navigate(item.path);
                handleDrawerToggle();
              }}
              sx={{
                borderRadius: 1,
                py: 1.5,
                bgcolor: item.variant === 'contained' ? 'primary.main' : 'transparent',
                color: item.variant === 'contained' ? 'white' : 'text.primary',
                '&:hover': {
                  bgcolor: item.variant === 'contained' ? 'primary.dark' : 'action.hover',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {item.icon}
                <ListItemText primary={item.text} />
              </Box>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" sx={{ bgcolor: 'white', color: 'text.primary' }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            {/* Logo */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexGrow: 1,
                cursor: 'pointer',
              }}
              onClick={() => navigate('/')}
              role="button"
              tabIndex={0}
              aria-label="Go to homepage"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate('/');
                }
              }}
            >
              <Restaurant sx={{ mr: 2, color: '#C41E3A' }} />
              <Typography
                variant="h6"
                sx={{
                  textDecoration: 'none',
                  color: 'inherit',
                  fontWeight: 700,
                }}
              >
                TableReserve
              </Typography>
            </Box>

            {/* Desktop Menu */}
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  color="inherit"
                  onClick={() => navigate('/search')}
                  aria-label="Browse restaurants"
                >
                  Browse Restaurants
                </Button>
                <Button
                  color="inherit"
                  startIcon={<AccountCircle />}
                  onClick={() => navigate('/signin')}
                  aria-label="Sign in to your account"
                >
                  Sign In
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate('/for-restaurants')}
                  aria-label="Restaurant owner portal"
                >
                  For Restaurants
                </Button>
              </Box>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="Open navigation menu"
                edge="end"
                onClick={handleDrawerToggle}
                sx={{ ml: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default ResponsiveNavbar;