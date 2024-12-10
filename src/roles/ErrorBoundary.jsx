// src/components/common/ErrorBoundary.jsx

import React from 'react';
import { Typography, Box } from '@mui/material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state to render fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <Box sx={{ padding: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="error" gutterBottom>
            Something went wrong.
          </Typography>
          <Typography variant="body1">
            Please try refreshing the page or contact support if the issue persists.
          </Typography>
        </Box>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;