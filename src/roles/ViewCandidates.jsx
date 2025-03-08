import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getCandidatesByPosition } from '../services/candidateService'; // Assuming this is your service
import { Box, Typography, Grid, Button, Alert } from '@mui/material';

const ViewCandidates = ({ jobId, positionId }) => {
  const [candidates, setCandidates] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch candidates when the component mounts or when jobId or positionId change
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        const data = await getCandidatesByPosition(jobId, positionId);
        setCandidates(data);
        setErrorMessage(null); // Clear any previous errors
      } catch (error) {
        setErrorMessage('Failed to fetch candidates. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [jobId, positionId]);

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" component="h2" sx={{ marginBottom: 2 }}>
        Candidates for Job ID: {jobId} and Position ID: {positionId}
      </Typography>

      {/* Show error message if any */}
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

      {/* Loading Spinner */}
      {loading ? (
        <Typography variant="h6" component="h6">
          Loading candidates...
        </Typography>
      ) : (
        // Display candidates
        <Grid container spacing={3}>
          {candidates.length > 0 ? (
            candidates.map((candidate) => (
              <Grid item xs={12} sm={6} md={4} key={candidate.id}>
                <Box sx={{ border: '1px solid #eee', padding: 2, borderRadius: 2 }}>
                  <Typography variant="h6">{candidate.firstName} {candidate.lastName}</Typography>
                  <Typography variant="body1">Email: {candidate.email}</Typography>
                  <Typography variant="body1">Phone: {candidate.phoneNumber}</Typography>
                  <Typography variant="body1">Current Company: {candidate.currentCompany}</Typography>
                  <Typography variant="body1">Skill Set: {candidate.skillSet}</Typography>
                  <Typography variant="body1">PAN Card: {candidate.panCardNumber}</Typography>
                  <Button variant="outlined" color="primary" href={candidate.resumeUrl} target="_blank" sx={{ mt: 2 }}>
                    View Resume
                  </Button>
                </Box>
              </Grid>
            ))
          ) : (
            <Typography variant="h6" component="h6" color="textSecondary">
              No candidates available for the selected job and position.
            </Typography>
          )}
        </Grid>
      )}
    </Box>
  );
};

ViewCandidates.propTypes = {
  jobId: PropTypes.string.isRequired,
  positionId: PropTypes.string.isRequired,
};

export default ViewCandidates;