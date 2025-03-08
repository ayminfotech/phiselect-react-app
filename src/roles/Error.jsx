// src/roles/Error.jsx

import React from 'react';
import { Box, Typography, Alert } from '@mui/material';
import PropTypes from 'prop-types';

const Error = ({ message }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh',
        paddingX: 2,
      }}
    >
      <Alert severity="error" sx={{ maxWidth: 600 }}>
        <Typography variant="h6">Error</Typography>
        <Typography variant="body1">{message}</Typography>
      </Alert>
    </Box>
  );
};

Error.propTypes = {
  message: PropTypes.string.isRequired,
};

export default Error;