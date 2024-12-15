// src/components/roles/RecruiterPanel.jsx
import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Paper, 
  TextField, 
  MenuItem, 
  Divider, 
  Tooltip 
} from '@mui/material';
import PropTypes from 'prop-types';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';

const RecruiterPanel = ({ jobPosts, sourceCandidates, sourcedCandidates }) => {
  const [candidateName, setCandidateName] = React.useState('');
  const [selectedJobId, setSelectedJobId] = React.useState('');

  const handleSourceCandidate = () => {
    if (candidateName.trim() && selectedJobId) {
      sourceCandidates(selectedJobId, candidateName.trim());
      setCandidateName('');
      setSelectedJobId('');
    }
  };

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

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
          Source New Candidate
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          Enter a candidate's name and select an open position to associate them with.
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            alignItems: 'flex-start',
            mt: 2,
          }}
        >
          <TextField
            label="Candidate Name"
            variant="outlined"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            fullWidth
            placeholder="e.g., Jane Doe"
            InputProps={{
              endAdornment: (
                <Tooltip title="Enter the candidate’s full name.">
                  <PersonAddIcon color="action" />
                </Tooltip>
              ),
            }}
          />
          <TextField
            select
            label="Select Job"
            variant="outlined"
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            sx={{ minWidth: 220 }}
            fullWidth
            placeholder="e.g., Frontend Engineer"
            InputProps={{
              endAdornment: (
                <Tooltip title="Select the job role to assign this candidate.">
                  <WorkOutlineIcon color="action" />
                </Tooltip>
              ),
            }}
          >
            {(jobPosts || []).map((job) => (
              <MenuItem key={job.id} value={job.id}>
                {job.jobTitle}
              </MenuItem>
            ))}
          </TextField>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSourceCandidate}
            sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}
          >
            Source Candidate
          </Button>
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Box>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
          Sourced Candidates
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          Review recently sourced candidates below.
        </Typography>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {(sourcedCandidates || []).map((candidate, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper
                sx={{
                  p: 2,
                  border: '1px solid #eee',
                  borderRadius: 2,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: 4,
                    backgroundColor: '#fafafa',
                  },
                }}
                elevation={1}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {candidate.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Job: {candidate.jobTitle}
                </Typography>
              </Paper>
            </Grid>
          ))}
          {(sourcedCandidates || []).length === 0 && (
            <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary', width: '100%' }}>
              No candidates sourced yet. Add a candidate to get started.
            </Typography>
          )}
        </Grid>
      </Box>
    </Paper>
  );
};

RecruiterPanel.propTypes = {
  jobPosts: PropTypes.array,
  sourceCandidates: PropTypes.func.isRequired,
  sourcedCandidates: PropTypes.array,
};

RecruiterPanel.defaultProps = {
  jobPosts: [
    // Dummy job posts for demonstration
    { id: 'job1', jobTitle: 'Senior Backend Developer' },
    { id: 'job2', jobTitle: 'Frontend Engineer' },
    { id: 'job3', jobTitle: 'UX Designer' },
  ],
  sourcedCandidates: [
    { name: 'Alice Johnson', jobTitle: 'Senior Backend Developer' },
    { name: 'Bob Williams', jobTitle: 'Frontend Engineer' },
  ],
};

export default RecruiterPanel;