// src/roles/StatCard.jsx

import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import PropTypes from 'prop-types';

const StatCard = ({ title, value, icon }) => {
  return (
    <Card
      elevation={3}
      sx={{
        display: 'flex',
        alignItems: 'center',
        padding: 2,
        backgroundColor: 'background.paper',
        borderRadius: 2,
        height: '100%',
      }}
    >
      <Box sx={{ marginRight: 2 }}>
        {icon}
      </Box>
      <CardContent sx={{ padding: 0 }}>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h5" color="textPrimary">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  icon: PropTypes.element.isRequired,
};

export default StatCard;