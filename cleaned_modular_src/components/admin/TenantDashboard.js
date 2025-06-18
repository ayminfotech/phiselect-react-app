import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../auth/AuthContext';
import { getOrganizationsByTenantId } from '../../services/TenantService';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
  CssBaseline,
  Tooltip,
  Button,
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import NotificationsIcon from '@mui/icons-material/Notifications';
import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import WorkIcon from '@mui/icons-material/Work';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import MailIcon from '@mui/icons-material/Mail';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import BusinessIcon from '@mui/icons-material/Business';
import BarChartIcon from '@mui/icons-material/BarChart';
import LogoutIcon from '@mui/icons-material/Logout';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

import Loader from '../../roles/Loader';
import Error from '../../roles/Error';
import StatCard from '../../roles/StatCard';
import RoleBasedPanel from '../../roles/RoleBasedPanel';
import Notifications from '../../roles/Notifications';
import UpcomingEvents from '../../roles/UpcomingEvents';
import ActivityLogs from '../../roles/ActivityLogs';
import AdminPanel from '../../roles/AdminPanel';

const drawerWidth = 240;

const TenantDashboard = () => {
  const { auth, logout } = useContext(AuthContext);
  const { tenantId, roles, user } = auth || {};
  const [tenantData, setTenantData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [users, setUsers] = useState([]);
  const [jobPosts, setJobPosts] = useState([]);
  const [openJobsCount, setOpenJobsCount] = useState(0);
  const [closedJobsCount, setClosedJobsCount] = useState(0);

  const [mobileOpen, setMobileOpen] = useState(false);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // Fetch Tenant Data
  useEffect(() => {
    const fetchTenantData = async () => {
      setLoading(true);
      try {
        if (tenantId) {
          const data = await getOrganizationsByTenantId(tenantId);
          const org = Array.isArray(data) ? data[0] : data;
          setTenantData(org);

          const jobArray = org.jobPosts || [];
          setJobPosts(jobArray);

          const openJobs = jobArray.filter((job) => job.status === 'Open');
          const closedJobs = jobArray.filter((job) => job.status === 'Closed');
          setOpenJobsCount(openJobs.length);
          setClosedJobsCount(closedJobs.length);

          setUsers(org.users || []);
        } else {
          setError('No tenant ID found.');
        }
      } catch (err) {
        console.error('Error fetching tenant data:', err);
        setError('Failed to fetch tenant data.');
      } finally {
        setLoading(false);
      }
    };

    fetchTenantData();
  }, [tenantId]);

  if (loading) return <Loader />;
  if (error) return <Error message={error} />;

  const { name } = tenantData || {};

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
  };

  // Example chart data
  const applicationTrends = [
    { week: 'Week 1', applications: 20 },
    { week: 'Week 2', applications: 32 },
    { week: 'Week 3', applications: 25 },
    { week: 'Week 4', applications: 40 },
  ];

  const candidateDistribution = [
    { name: 'Applied', value: 40 },
    { name: 'Interviewed', value: 25 },
    { name: 'Offered', value: 10 },
    { name: 'Hired', value: 15 },
    { name: 'Rejected', value: 10 },
  ];
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#d0ed57', '#a4de6c'];

  // Dummy admin stats (example)
  const adminStats = {
    reportsGenerated: 15,
    activeOrganizations: 3,
  };

  // Sidebar Content
  const drawer = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        // Soft pastel gradient
        background: 'linear-gradient(to bottom right, #bfe9ff, #e0c8f2)',
      }}
    >
      <Toolbar
        sx={{
          justifyContent: 'center',
          py: 2,
          borderBottom: '1px solid rgba(255,255,255,0.2)',
          backgroundColor: 'transparent',
        }}
      >
        <Typography variant="h6" noWrap sx={{ fontWeight: 'bold', color: '#4a4a4a' }}>
          {name || 'Tenant Dashboard'}
        </Typography>
      </Toolbar>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />

      <List sx={{ color: '#4a4a4a', flexGrow: 1 }}>
        <ListItem
          button
          sx={{
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' },
          }}
        >
          <DashboardIcon sx={{ mr: 1 }} />
          <ListItemText primary="Dashboard Overview" />
        </ListItem>
        <ListItem
          button
          sx={{
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' },
          }}
        >
          <NotificationsIcon sx={{ mr: 1 }} />
          <ListItemText primary="Notifications" />
        </ListItem>
        <ListItem
          button
          sx={{
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' },
          }}
        >
          <EventIcon sx={{ mr: 1 }} />
          <ListItemText primary="Events" />
        </ListItem>
        <ListItem
          button
          sx={{
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' },
          }}
        >
          <PeopleIcon sx={{ mr: 1 }} />
          <ListItemText primary="Users" />
        </ListItem>
      </List>

      <Box sx={{ p: 2, textAlign: 'center', color: '#4a4a4a' }}>
        <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
          Tenant: {tenantId || 'N/A'}
        </Typography>
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{ borderColor: '#4a4a4a', color: '#4a4a4a' }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', backgroundColor: theme.palette.background.default }}>
      <CssBaseline />

      {/* TOP APP BAR */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: '#ffffffcc',
          backdropFilter: 'blur(6px)',
          color: theme.palette.text.primary,
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        }}
      >
        <Toolbar>
          {isSmallScreen && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" noWrap sx={{ fontWeight: 'bold' }}>
              Welcome, {user?.name || 'Admin'}
            </Typography>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
              Tenant: {tenantId || 'N/A'}
            </Typography>
          </Box>
          <Tooltip title="Logout">
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon sx={{ color: 'text.secondary' }} />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* SIDEBAR */}
      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
        }}
        aria-label="sidebar navigation"
      >
        {/* MOBILE Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
          }}
        >
          {drawer}
        </Drawer>

        {/* DESKTOP Drawer */}
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      {/* MAIN CONTENT */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: { xs: 2, sm: 3 },
          px: { xs: 2, sm: 3 },
          width: '100%',
          minHeight: '100vh',
        }}
      >
        <Toolbar />

        {/* Admin Stats (If ADMIN) */}
        {roles.includes('ADMIN') && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              Admin Stats
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Reports Generated"
                  value={adminStats.reportsGenerated}
                  icon={<BarChartIcon fontSize="large" color="primary" />}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Active Orgs"
                  value={adminStats.activeOrganizations}
                  icon={<BusinessIcon fontSize="large" color="secondary" />}
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Manager / General Stats */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            Quick Stats
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={3}>
            {roles.includes('MANAGER') && (
              <>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard
                    title="Total Jobs"
                    value={jobPosts.length}
                    icon={<WorkIcon fontSize="large" color="primary" />}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard
                    title="Open Jobs"
                    value={openJobsCount}
                    icon={<HourglassEmptyIcon fontSize="large" color="secondary" />}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard
                    title="Closed Jobs"
                    value={closedJobsCount}
                    icon={<DoneOutlineIcon fontSize="large" color="action" />}
                  />
                </Grid>
              </>
            )}
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Active Users"
                value={users.filter((u) => u.status === 'Active').length}
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
          </Grid>
        </Box>

        {/* Interviewer Stats (If INTERVIEWER) */}
        {roles.includes('INTERVIEWER') && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              Interviewer Stats
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Interviews Scheduled"
                  value={5}
                  icon={<EventIcon fontSize="large" color="primary" />}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Feedback Submitted"
                  value={3}
                  icon={<AssignmentIndIcon fontSize="large" color="action" />}
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Recruiter Stats (If RECRUITER) */}
        {roles.includes('RECRUITER') && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              Recruiter Stats
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Candidates Sourced"
                  value={10}
                  icon={<PeopleIcon fontSize="large" color="primary" />}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Positions Filled"
                  value={2}
                  icon={<DoneOutlineIcon fontSize="large" sx={{ color: theme.palette.success.main }} />}
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Charts & Metrics (If MANAGER) */}
        {roles.includes('MANAGER') && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              Applications Trend
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    background: 'linear-gradient(to right, #fdfcfb, #e2d1c3)',
                  }}
                >
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Weekly Applications
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={applicationTrends}>
                      <XAxis dataKey="week" />
                      <YAxis />
                      <ChartTooltip />
                      <Line
                        type="monotone"
                        dataKey="applications"
                        stroke={theme.palette.primary.main}
                        strokeWidth={2}
                        isAnimationActive={true}
                        animationDuration={1000}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    background: 'linear-gradient(to right, #fdfcfb, #e2d1c3)',
                  }}
                >
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Candidate Distribution
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={candidateDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        isAnimationActive={true}
                        animationDuration={1000}
                      >
                        {candidateDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Admin Panel (If ADMIN) */}
        {roles.includes('ADMIN') && (
          <Box sx={{ mb: 4 }}>
            <AdminPanel />
          </Box>
        )}

        {/* Role-Based Panels */}
        <Box sx={{ mb: 4 }}>
          <RoleBasedPanel roles={roles} jobPosts={jobPosts} setJobPosts={setJobPosts} users={users} />
        </Box>

        {/* Additional Modules */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Notifications notifications={tenantData?.notifications || []} />
            </Grid>
            <Grid item xs={12} md={6}>
              <UpcomingEvents events={tenantData?.upcomingEvents || []} />
            </Grid>
          </Grid>
        </Box>

        {/* Tenant Information (If ADMIN) */}
        {roles.includes('ADMIN') && (
          <Box sx={{ mb: 4 }}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                Tenant Information
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography><strong>Name:</strong> {name}</Typography>
                  <Typography><strong>Industry:</strong> {tenantData?.industryType || 'N/A'}</Typography>
                  <Typography><strong>Registration Number:</strong> {tenantData?.registrationNumber || 'N/A'}</Typography>
                  <Typography><strong>Date Established:</strong> {tenantData?.dateEstablished || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography><strong>Contact Email:</strong> {tenantData?.contactDetails?.email || 'N/A'}</Typography>
                  <Typography><strong>Phone:</strong> {tenantData?.contactDetails?.phone || 'N/A'}</Typography>
                  <Typography><strong>Address:</strong> {tenantData?.address
                    ? `${tenantData.address.street}, ${tenantData.address.city}, ${tenantData.address.state}, ${tenantData.address.country}, ${tenantData.address.zipCode}`
                    : 'N/A'}
                  </Typography>
                  <Typography>
                    <strong>Website:</strong>{' '}
                    {tenantData?.website ? (
                      <a
                        href={tenantData.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: theme.palette.primary.main }}
                      >
                        {tenantData.website}
                      </a>
                    ) : 'N/A'}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        )}

        {/* Activity Logs */}
        <Box sx={{ mb: 4 }}>
          <ActivityLogs activityLogs={tenantData?.activityLogs || []} />
        </Box>
      </Box>
    </Box>
  );
};

export default TenantDashboard;