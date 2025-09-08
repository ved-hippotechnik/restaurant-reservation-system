import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#C41E3A', // Darker red for better contrast (WCAG AA compliant)
      light: '#DA3743',
      dark: '#8B0020',
    },
    secondary: {
      main: '#1976D2', // Darker blue for better contrast
      light: '#247F9E',
      dark: '#115293',
    },
    error: {
      main: '#D32F2F',
    },
    text: {
      primary: '#212121',
      secondary: '#616161',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
  },
});

export default theme;
