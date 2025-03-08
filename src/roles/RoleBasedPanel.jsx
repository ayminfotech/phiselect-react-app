// src/components/roles/RoleBasedPanel.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Divider } from '@mui/material';
import InterviewerPanel from './InterviewerPanel'; // Ensure correct path
import RecruiterPanel from './RecruiterPanel';   // Ensure correct path
import ManagerPanel from './ManagerPanel';       // Your existing Manager panel
import AdminPanel from './AdminPanel';           // If AdminPanel is also used here

const RoleBasedPanel = ({ roles, jobPosts, setJobPosts, users }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
        Role-Based Actions
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {/* Render panels based on role */}
      {roles.includes('INTERVIEWER') && (
        <Box sx={{ mb: 4 }}>
          <InterviewerPanel
            // `InterviewerPanel` has defaultProps for `feedback` so no need to pass if you want dummy data
            submitFeedback={(id, fb) => console.log(`Feedback submitted for ID ${id}: ${fb}`)}
          />
        </Box>
      )}

      {roles.includes('RECRUITER') && (
        <Box sx={{ mb: 4 }}>
          <RecruiterPanel
            // `RecruiterPanel` also has defaultProps for dummy data
            // Implement `sourceCandidates` for demonstration.
            sourceCandidates={(jobId, candidateName) => 
              console.log(`Candidate ${candidateName} sourced for Job ${jobId}`)
            }
          />
        </Box>
      )}

      {roles.includes('MANAGER') && (
        <Box sx={{ mb: 4 }}>
          {/* If you have a ManagerPanel, render it here */}
          <ManagerPanel jobPosts={jobPosts} setJobPosts={setJobPosts} users={users} />
        </Box>
      )}

      {roles.includes('ADMIN') && (
        <Box sx={{ mb: 4 }}>
          {/* AdminPanel if needed, though you've included it in TenantDashboard */}
          {/* <AdminPanel ...props /> */}
        </Box>
      )}
    </Box>
  );
};

RoleBasedPanel.propTypes = {
  roles: PropTypes.array.isRequired,
  jobPosts: PropTypes.array,
  setJobPosts: PropTypes.func,
  users: PropTypes.array,
};

RoleBasedPanel.defaultProps = {
  jobPosts: [],
  setJobPosts: () => {},
  users: [],
};

export default RoleBasedPanel;