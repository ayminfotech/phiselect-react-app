import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { getActiveJobs } from '../services/jobService'; // Updated import
import PropTypes from 'prop-types';

const ActiveJobsPanel = () => {
  const [activeJobs, setActiveJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActiveJobs = async () => {
      setLoading(true);
      try {
        const data = await getActiveJobs();
        setActiveJobs(data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch active jobs.');
      } finally {
        setLoading(false);
      }
    };

    fetchActiveJobs();
  }, []);

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'jobTitle', headerName: 'Job Title', width: 200 },
    { field: 'department', headerName: 'Department', width: 150 },
    { field: 'location', headerName: 'Location', width: 150 },
    { field: 'postedDate', headerName: 'Posted Date', width: 150 },
    { field: 'status', headerName: 'Status', width: 100 },
  ];

  return (
    <Paper sx={{ padding: 4, backgroundColor: 'background.paper' }} elevation={3}>
      <Typography variant="h5" gutterBottom>
        Active Jobs
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', padding: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Box sx={{ height: 500, width: '100%' }}>
          <DataGrid
            rows={activeJobs}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 20, 50]}
            disableSelectionOnClick
            sx={{
              '& .MuiDataGrid-row:hover': {
                backgroundColor: '#f5f5f5',
              },
            }}
          />
        </Box>
      )}
    </Paper>
  );
};

ActiveJobsPanel.propTypes = {};

export default ActiveJobsPanel;