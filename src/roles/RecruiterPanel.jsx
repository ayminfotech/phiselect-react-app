// src/components/roles/RecruiterPanel.jsx

import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Divider, 
  CircularProgress,
  Alert,
} from '@mui/material';
import { getAssignedJobsByRecruiter } from '../services/jobService';
import JobCard from './JobCard'; // Ensure the correct import path
import BulkUploadCandidates from './BulkUploadCandidates';

const RecruiterPanel = () => {
  const [jobPosts, setJobPosts] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [error, setError] = useState(null);

  // Fetch assigned jobs on component mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobs = await getAssignedJobsByRecruiter();
        console.log('Fetched Jobs:', jobs); // Debugging line
        setJobPosts(jobs);
      } catch (err) {
        setError(err.message || 'Failed to fetch jobs');
      } finally {
        setLoadingJobs(false);
      }
    };

    fetchJobs();
  }, []);

  const handleBulkUploadSuccess = (createdCandidates) => {
    // Optionally, update state or provide feedback
    console.log('Bulk upload successful:', createdCandidates);
    // Refresh jobs or specific PositionCards if necessary
    // Example: setJobPosts([...jobPosts]); // Trigger re-render
  };

  if (loadingJobs) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 2,
        backgroundColor: (theme) => theme.palette.background.paper,
      }}
    >
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
        Recruiter Panel
      </Typography>
      <Typography variant="subtitle2" color="textSecondary" gutterBottom>
        Quickly source candidates and assign them to open roles.
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
          Your Assigned Jobs
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          Review your assigned jobs and source candidates for each open position.
        </Typography>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {jobPosts.length > 0 ? (
            jobPosts.map((job) => (
              <Grid item xs={12} key={job.id}>
                <JobCard job={job} />
              </Grid>
            ))
          ) : (
            <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary', width: '100%' }}>
              No jobs assigned yet.
            </Typography>
          )}
        </Grid>
      </Box>

      {/* Bulk Upload Section */}
      <Box sx={{ mb: 4 }}>
        <BulkUploadCandidates onSuccess={handleBulkUploadSuccess} />
      </Box>
    </Paper>
  );
};

export default RecruiterPanel;