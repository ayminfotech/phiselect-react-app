// src/components/Dashboard/TenantDashboard.jsx

import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../auth/AuthContext';
import { getOrganizationsByTenantId } from '../../services/TenantService';
import {
  Box,
  Typography,
  Grid,
  Container,
  Paper,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';

import StatCard from '../../roles/StatCard';
import Loader from '../../roles/Loader';
import Error from '../../roles/Error';
import RoleBasedPanel from '../../roles/RoleBasedPanel'; // Importing the HOC
import Notifications from '../../roles/Notifications';
import UpcomingEvents from '../../roles/UpcomingEvents';
import PerformanceMetrics from '../../roles/PerformanceMetrics';
import ActivityLogs from '../../roles/ActivityLogs';

// Import Icons
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import MailIcon from '@mui/icons-material/Mail';
import ExploreIcon from '@mui/icons-material/Explore';
import ScheduleIcon from '@mui/icons-material/Schedule';

const TenantDashboard = () => {
  const { auth } = useContext(AuthContext);
  const { tenantId, roles } = auth || {};
  const [tenantData, setTenantData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Additional state variables
  const [sourcedCandidates, setSourcedCandidates] = useState([]);
  const [users, setUsers] = useState([]);
  const [reportsData, setReportsData] = useState([]);
  const [analyticsData, setAnalyticsData] = useState({});
  const [jobPosts, setJobPosts] = useState([]);
  const [feedback, setFeedback] = useState([]);

  // Theme and Responsiveness
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchTenantData = async () => {
      setLoading(true);
      try {
        if (tenantId) {
          const data = await getOrganizationsByTenantId(tenantId);
          console.log('Fetched Tenant Data:', data); // Debugging line
          setTenantData(Array.isArray(data) ? data[0] : data);

          // Initialize additional states if applicable.
          // Ensure that your data has these fields. Adjust as necessary.
          setUsers(data.users || []);
          setReportsData(data.reportsData || []);
          setAnalyticsData(data.analyticsData || {});
          setJobPosts(data.jobPosts || []);
          setFeedback([
            { id: 1, candidate: 'Alice Johnson', interviewDate: '2024-04-10', feedback: null },
            { id: 2, candidate: 'Bob Williams', interviewDate: '2024-04-12', feedback: null },
          ]);
        } else {
          setError('No tenant ID found.');
        }
      } catch (err) {
        console.error('Error fetching tenant data:', err); // Debugging line
        setError('Failed to fetch tenant data.');
      } finally {
        setLoading(false);
      }
    };

    fetchTenantData();
  }, [tenantId]);

  // Log state updates for debugging
  useEffect(() => {
    console.log('Current Tenant Data:', tenantData);
    console.log('Users:', users);
    console.log('Job Posts:', jobPosts);
    // Add more logs as needed
  }, [tenantData, users, jobPosts]);

  // Manager Panel Functions
  const createJobPost = (title) => {
    const newJob = {
      id: jobPosts.length + 1,
      jobTitle: title,
      status: 'Open',
      assignedToName: null,
    };
    setJobPosts([...jobPosts, newJob]);
  };

  const deleteJobPost = (jobId) => {
    setJobPosts(jobPosts.filter((job) => job.id !== jobId));
  };

  const assignJob = (jobId, recruiterId) => {
    const recruiter = users.find((user) => user.id === recruiterId);
    setJobPosts(
      jobPosts.map((job) =>
        job.id === jobId
          ? { ...job, assignedToName: recruiter ? recruiter.name : 'Unassigned' }
          : job
      )
    );
  };

  // Recruiter Panel Functions
  const sourceCandidates = (jobId, candidateName) => {
    const job = jobPosts.find((j) => j.id === jobId);
    if (job) {
      setSourcedCandidates([
        ...sourcedCandidates,
        { name: candidateName, jobTitle: job.jobTitle },
      ]);
    }
  };

  // Admin Panel Functions
  const createUser = (name, role) => {
    const newUser = {
      id: users.length + 1,
      name,
      role,
      status: 'Active',
    };
    setUsers([...users, newUser]);
  };

  const toggleUserStatus = (userId) => {
    setUsers(
      users.map((user) =>
        user.id === userId
          ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' }
          : user
      )
    );
  };

  // Interviewer Panel Functions
  const submitFeedback = (feedbackId, feedbackText) => {
    setFeedback(
      feedback.map((fb) =>
        fb.id === feedbackId ? { ...fb, feedback: feedbackText } : fb
      )
    );
  };

  if (loading) return <Loader />;
  if (error) return <Error message={error} />;

  // Destructure tenantData for easier access
  const {
    name,
    tenantId: tId,
    activeJobs = 0,
    applications = 0,
    hires = 0,
    interviews = 0,
    activityLogs = [],
    industryType,
    contactDetails,
    address,
    registrationNumber,
    website,
    dateEstablished,
    notifications = [],
    upcomingEvents = [],
    performanceMetrics = {},
  } = tenantData || {};

  return (
    <Container maxWidth="xl" sx={{ paddingY: 4 }}>
      {/* Header Section */}
      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h3" gutterBottom>
          Welcome, {name || 'Admin'}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Tenant ID: <strong>{tId || 'N/A'}</strong>
        </Typography>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ marginBottom: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Users"
            value={users.filter((user) => user.status === 'Active').length}
            icon={<AssignmentIndIcon fontSize="large" color="primary" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={users.length}
            icon={<MailIcon fontSize="large" color="secondary" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Reports Generated"
            value={reportsData.length}
            icon={<ExploreIcon fontSize="large" color="action" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Performance Metrics"
            value={performanceMetrics.overall || 'N/A'}
            icon={<ScheduleIcon fontSize="large" color="warning" />}
          />
        </Grid>
      </Grid>

      {/* Role-Specific Data */}
      <RoleBasedPanel
        roles={roles}
        jobPosts={jobPosts}
        createJobPost={createJobPost}
        deleteJobPost={deleteJobPost}
        assignJob={assignJob}
        recruiters={users.filter((user) => user.role === 'RECRUITER')}
        sourcedCandidates={sourcedCandidates}
        sourceCandidates={sourceCandidates}
        users={users}
        createUser={createUser}
        toggleUserStatus={toggleUserStatus}
        reportsData={reportsData}
        analyticsData={analyticsData}
        feedback={feedback}
        submitFeedback={submitFeedback}
      />

      {/* Additional Modules */}
      <Grid container spacing={4} sx={{ marginBottom: 4 }}>
        <Grid item xs={12} md={6}>
          <Notifications notifications={notifications} />
        </Grid>
        <Grid item xs={12} md={6}>
          <UpcomingEvents events={upcomingEvents} />
        </Grid>
      </Grid>

      <Grid container spacing={4} sx={{ marginBottom: 4 }}>
        <Grid item xs={12}>
          <PerformanceMetrics metrics={performanceMetrics} />
        </Grid>
      </Grid>

      {/* Tenant Information */}
      <Grid container spacing={4} sx={{ marginBottom: 4 }}>
        <Grid item xs={12}>
          <Paper
            elevation={3}
            sx={{
              padding: 3,
              backgroundColor: theme.palette.background.paper,
              borderRadius: 2,
            }}
          >
            <Typography variant="h5" gutterBottom>
              Tenant Information
            </Typography>
            <Divider sx={{ marginY: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>Name:</strong> {name}
                </Typography>
                <Typography>
                  <strong>Industry:</strong> {industryType}
                </Typography>
                <Typography>
                  <strong>Registration Number:</strong> {registrationNumber}
                </Typography>
                <Typography>
                  <strong>Date Established:</strong> {dateEstablished}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>Contact Email:</strong> {contactDetails?.email}
                </Typography>
                <Typography>
                  <strong>Phone:</strong> {contactDetails?.phone}
                </Typography>
                <Typography>
                  <strong>Address:</strong> {address?.street}, {address?.city}, {address?.state}, {address?.country}, {address?.zipCode}
                </Typography>
                <Typography>
                  <strong>Website:</strong> {website ? (
                    <a href={website} target="_blank" rel="noopener noreferrer">
                      {website}
                    </a>
                  ) : 'N/A'}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Activity Logs */}
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <ActivityLogs activityLogs={activityLogs} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default TenantDashboard;