// src/components/roles/ManagerPanel.jsx

import React from 'react';
import { Box, Typography, Button, Grid, Paper, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import PropTypes from 'prop-types';

const ManagerPanel = ({ jobPosts, createJobPost, deleteJobPost, assignJob, recruiters }) => {
  const [newJobTitle, setNewJobTitle] = React.useState('');
  const [selectedRecruiter, setSelectedRecruiter] = React.useState('');

  const handleCreateJob = () => {
    if (newJobTitle) {
      createJobPost(newJobTitle);
      setNewJobTitle('');
    }
  };

  const handleAssignJob = (jobId) => {
    if (selectedRecruiter) {
      assignJob(jobId, selectedRecruiter);
      setSelectedRecruiter('');
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: 3 }}>
      <Typography variant="h5" gutterBottom>
        Manager Panel
      </Typography>

      {/* Create Job Post Section */}
      <Box sx={{ marginBottom: 3 }}>
        <Typography variant="h6">Create New Job Post</Typography>
        <Box sx={{ display: 'flex', gap: 2, marginTop: 2 }}>
          <TextField
            label="Job Title"
            variant="outlined"
            value={newJobTitle}
            onChange={(e) => setNewJobTitle(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={handleCreateJob}>
            Create
          </Button>
        </Box>
      </Box>

      {/* Job Posts List */}
      <Box sx={{ marginBottom: 3 }}>
        <Typography variant="h6">Job Posts</Typography>
        <Grid container spacing={2} sx={{ marginTop: 1 }}>
          {jobPosts.map((job) => (
            <Grid item xs={12} sm={6} md={4} key={job.id}>
              <Paper sx={{ padding: 2, border: '1px solid #ccc' }}>
                <Typography variant="subtitle1">{job.jobTitle}</Typography>
                <Typography variant="body2">Status: {job.status}</Typography>
                <Typography variant="body2">
                  Assigned To: {job.assignedToName || 'Unassigned'}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, marginTop: 1 }}>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => deleteJobPost(job.id)}
                  >
                    Delete
                  </Button>
                  <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                    <InputLabel id={`assign-recruiter-label-${job.id}`}>Recruiter</InputLabel>
                    <Select
                      labelId={`assign-recruiter-label-${job.id}`}
                      value={selectedRecruiter}
                      onChange={(e) => setSelectedRecruiter(e.target.value)}
                      label="Recruiter"
                    >
                      {recruiters.map((recruiter) => (
                        <MenuItem key={recruiter.id} value={recruiter.id}>
                          {recruiter.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleAssignJob(job.id)}
                    disabled={!selectedRecruiter}
                  >
                    Assign
                  </Button>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Paper>
  );
};

ManagerPanel.propTypes = {
  jobPosts: PropTypes.array.isRequired,
  createJobPost: PropTypes.func.isRequired,
  deleteJobPost: PropTypes.func.isRequired,
  assignJob: PropTypes.func.isRequired,
  recruiters: PropTypes.array.isRequired,
};

export default ManagerPanel;