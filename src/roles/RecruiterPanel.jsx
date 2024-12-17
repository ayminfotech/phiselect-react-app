import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, Divider, CircularProgress, Alert, Avatar } from '@mui/material';
import { getAssignedJobsByRecruiter } from '../services/jobService';
import JobCard from './JobCard';
import commonStyles from '../styles/commonStyles';

const RecruiterPanel = () => {
  const [jobPosts, setJobPosts] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobs = await getAssignedJobsByRecruiter();
        setJobPosts(jobs);
      } catch (err) {
        setError(err.message || 'Failed to fetch jobs');
      } finally {
        setLoadingJobs(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 3, backgroundColor: '#f9f9f9' }}>
      {/* Header */}
      <Box display="flex" alignItems="center" mb={3}>
        <Avatar src="/static/images/recruiter-avatar.png" sx={{ width: 64, height: 64, mr: 2 }} />
        <Box>
          <Typography variant="h5" sx={commonStyles.header}>
            Recruiter Panel
          </Typography>
          <Typography sx={commonStyles.subtitle}>
            Manage your assigned jobs efficiently.
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ mb: 3 }} />

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={commonStyles.errorAlert}>
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loadingJobs ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        // Job Posts
        <Box>
          <Typography sx={commonStyles.sectionTitle}>Your Assigned Jobs</Typography>
          <Grid container spacing={3}>
            {jobPosts.length > 0 ? (
              jobPosts.map((job) => (
                <Grid item xs={12} sm={6} key={job.id}>
                  <JobCard job={job} />
                </Grid>
              ))
            ) : (
              <Typography sx={commonStyles.subtitle}>No jobs assigned yet.</Typography>
            )}
          </Grid>
        </Box>
      )}
    </Paper>
  );
};

export default RecruiterPanel;