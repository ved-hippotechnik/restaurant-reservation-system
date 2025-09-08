import React, { Component, ErrorInfo, ReactNode } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Container, 
  Alert,
  Stack
} from '@mui/material';
import { 
  ErrorOutline, 
  Refresh, 
  BugReport,
  Home,
  RestaurantMenu
} from '@mui/icons-material';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    errorId: '',
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { 
      hasError: true, 
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });
    
    // Log error with detailed information
    this.logError(error, errorInfo);
    
    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  private logError = (error: Error, errorInfo: ErrorInfo) => {
    const errorData = {
      errorId: this.state.errorId,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: this.getCurrentUserId(),
      appType: 'customer-app',
    };

    // In production, send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      this.sendErrorToBackend(errorData);
    }
  };

  private getCurrentUserId = (): string | null => {
    try {
      const token = localStorage.getItem('authToken');
      return token ? 'user_id_placeholder' : null;
    } catch {
      return null;
    }
  };

  private sendErrorToBackend = async (errorData: any) => {
    try {
      await fetch('/api/v1/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('authToken') && {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          })
        },
        body: JSON.stringify(errorData),
      });
    } catch {
      // Silently fail
    }
  };

  private handleReportBug = () => {
    const subject = `Customer App Bug Report - Error ID: ${this.state.errorId}`;
    const body = encodeURIComponent(
      `Error ID: ${this.state.errorId}\n` +
      `Error Message: ${this.state.error?.message}\n` +
      `URL: ${window.location.href}\n` +
      `Timestamp: ${new Date().toISOString()}\n\n` +
      `Please describe what you were doing when this error occurred:\n`
    );
    
    window.open(`mailto:support@restaurant.com?subject=${subject}&body=${body}`);
  };

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
    });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return <>{this.props.fallback}</>;
      }

      return (
        <Container maxWidth="sm">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '50vh',
              textAlign: 'center',
              py: 4,
            }}
          >
            <Paper
              elevation={3}
              sx={{
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <ErrorOutline sx={{ fontSize: 64, color: 'error.main' }} />
              
              <Typography variant="h5" component="h1" gutterBottom>
                Oops! Something went wrong
              </Typography>
              
              <Typography variant="body1" color="text.secondary" paragraph>
                We're sorry for the inconvenience. An unexpected error has occurred while browsing restaurants.
              </Typography>

              <Alert severity="info" sx={{ mt: 2, mb: 2 }}>
                Error ID: {this.state.errorId}
              </Alert>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    bgcolor: 'grey.100',
                    borderRadius: 1,
                    width: '100%',
                    textAlign: 'left',
                    maxWidth: '400px',
                    overflow: 'auto',
                  }}
                >
                  <Typography variant="caption" component="pre" sx={{ 
                    fontFamily: 'monospace',
                    fontSize: '0.75rem',
                    whiteSpace: 'pre-wrap',
                  }}>
                    {this.state.error.toString()}
                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                  </Typography>
                </Box>
              )}

              <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<Refresh />}
                  onClick={this.handleReset}
                  color="primary"
                >
                  Try Again
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<RestaurantMenu />}
                  onClick={() => window.location.href = '/'}
                >
                  Browse Restaurants
                </Button>
              </Stack>

              <Button
                variant="text"
                size="small"
                startIcon={<BugReport />}
                onClick={this.handleReportBug}
                sx={{ mt: 1 }}
              >
                Report Bug
              </Button>
            </Paper>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;