// src/components/Dashboard/PerformanceMetrics.jsx
import React from 'react';
import { Paper, Typography, Grid, LinearProgress, Box } from '@mui/material';

const PerformanceMetrics = ({ metrics }) => (
  <Paper
    elevation={3}
    sx={{ padding: 2, backgroundColor: '#e3f2fd', height: '100%' }}
  >
    <Typography variant="h6" gutterBottom>
      Performance Metrics
    </Typography>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4}>
        <Typography>Monthly Growth: {metrics.monthlyGrowth}%</Typography>
        <Box sx={{ width: '100%', mt: 1 }}>
          <LinearProgress variant="determinate" value={metrics.monthlyGrowth} />
        </Box>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Typography>Customer Satisfaction: {metrics.customerSatisfaction}%</Typography>
        <Box sx={{ width: '100%', mt: 1 }}>
          <LinearProgress variant="determinate" value={metrics.customerSatisfaction} />
        </Box>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Typography>Employee Engagement: {metrics.employeeEngagement}%</Typography>
        <Box sx={{ width: '100%', mt: 1 }}>
          <LinearProgress variant="determinate" value={metrics.employeeEngagement} />
        </Box>
      </Grid>
    </Grid>
  </Paper>
);

export default PerformanceMetrics;