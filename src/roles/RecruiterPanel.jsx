// src/components/roles/RecruiterPanel.jsx

import React from 'react';
import { Box, Typography, Button, Grid, Paper, TextField } from '@mui/material';
import PropTypes from 'prop-types';

const RecruiterPanel = ({ jobPosts, sourceCandidates, sourcedCandidates }) => {
  const [candidateName, setCandidateName] = React.useState('');
  const [selectedJobId, setSelectedJobId] = React.useState('');

  const handleSourceCandidate = () => {
    if (candidateName && selectedJobId) {
      sourceCandidates(selectedJobId, candidateName);
      setCandidateName('');
      setSelectedJobId('');
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: 3 }}>
      <Typography variant="h5" gutterBottom>
        Recruiter Panel
      </Typography>

      {/* Source Candidate Section */}
      <Box sx={{ marginBottom: 3 }}>
        <Typography variant="h6">Source New Candidate</Typography>
        <Box sx={{ display: 'flex', gap: 2, marginTop: 2 }}>
          <TextField
            label="Candidate Name"
            variant="outlined"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
          />
          <TextField
            select
            label="Job Post"
            variant="outlined"
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            sx={{ minWidth: 200 }}
          >
            {jobPosts.map((job) => (
              <option key={job.id} value={job.id}>
                {job.jobTitle}
              </option>
            ))}
          </TextField>
          <Button variant="contained" color="primary" onClick={handleSourceCandidate}>
            Source
          </Button>
        </Box>
      </Box>

      {/* Sourced Candidates List */}
      <Box>
        <Typography variant="h6">Sourced Candidates</Typography>
        <Grid container spacing={2} sx={{ marginTop: 1 }}>
          {sourcedCandidates.map((candidate, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper sx={{ padding: 2, border: '1px solid #ccc' }}>
                <Typography variant="subtitle1">{candidate.name}</Typography>
                <Typography variant="body2">Job: {candidate.jobTitle}</Typography>
              </Paper>
            </Grid>
          ))}
          {sourcedCandidates.length === 0 && (
            <Typography variant="body1" sx={{ marginTop: 2 }}>
              No candidates sourced yet.
            </Typography>
          )}
        </Grid>
      </Box>
    </Paper>
  );
};

RecruiterPanel.propTypes = {
  jobPosts: PropTypes.array.isRequired,
  sourceCandidates: PropTypes.func.isRequired,
  sourcedCandidates: PropTypes.array.isRequired,
};

export default RecruiterPanel;