import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Tooltip,
  Divider,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Alert
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useSnackbar } from 'notistack';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';

import { createJob, updateJob, deleteJob, assignRecruiterToPosition, getAllJobs } from '../services/jobService';
import { getUsersByTenantIdAndRoles } from '../services/UserService'; // Import the UserService

const ManagerPanel = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [jobPosts, setJobPosts] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [isJobDialogOpen, setIsJobDialogOpen] = useState(false);
  const [isPositionsDialogOpen, setIsPositionsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [jobForm, setJobForm] = useState({});
  const [selectedJob, setSelectedJob] = useState(null);
  const [deletingJobId, setDeletingJobId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [assigning, setAssigning] = useState(false);

  const [recruiters, setRecruiters] = useState([]);
  const [loadingRecruiters, setLoadingRecruiters] = useState(false);

  // State for positions management
  const [positionSearch, setPositionSearch] = useState('');
  const [positionFilter, setPositionFilter] = useState('ALL'); // ALL or UNASSIGNED
  const [selectedPositionIds, setSelectedPositionIds] = useState([]);
  const [bulkAssignRecruiterId, setBulkAssignRecruiterId] = useState('');

  // Fetch all jobs on mount
  useEffect(() => {
    const fetchJobs = async () => {
      setLoadingJobs(true);
      setLoadError(null);
      try {
        const jobs = await getAllJobs();
        setJobPosts(jobs);
      } catch (error) {
        setLoadError(error || 'Failed to load jobs.');
      } finally {
        setLoadingJobs(false);
      }
    };

    fetchJobs();
  }, []);

  // Fetch recruiters dynamically based on roles when positions dialog is open
  useEffect(() => {
    const fetchRecruiters = async () => {
      setLoadingRecruiters(true);
      try {
        const roles = ['RECRUITER']; // Specify the roles you want to filter by
        const fetchedRecruiters = await getUsersByTenantIdAndRoles(roles);
        setRecruiters(fetchedRecruiters);
      } catch (error) {
        enqueueSnackbar('Failed to load recruiters.', { variant: 'error' });
      } finally {
        setLoadingRecruiters(false);
      }
    };

    if (isPositionsDialogOpen) {
      fetchRecruiters();
    }
  }, [isPositionsDialogOpen, enqueueSnackbar]);

  const openJobDialog = (job = null) => {
    setIsEditing(Boolean(job));
    setJobForm(
      job || {
        jobTitle: '',
        jobDescription: '',
        jobLocation: '',
        jobType: '',
        department: '',
        jobSummary: '',
        responsibilities: '',
        qualification: '',
        requiredSkills: '',
        experienceLevel: '',
        salaryRange: '',
        postingDate: '',
        closingDate: '',
        positions: '',
      }
    );
    setIsJobDialogOpen(true);
  };

  const openPositionsDialog = (job) => {
    setSelectedJob(job);
    setPositionSearch('');
    setPositionFilter('ALL');
    setSelectedPositionIds([]);
    setIsPositionsDialogOpen(true);
  };

  const handleJobFormChange = (field, value) => {
    setJobForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveJob = async () => {
    setSaving(true);
    try {
      if (isEditing && jobForm.id) {
        const updatedJob = await updateJob(jobForm.id, jobForm);
        setJobPosts((prev) => prev.map((j) => (j.id === updatedJob.id ? updatedJob : j)));
        enqueueSnackbar('Job updated successfully!', { variant: 'success' });
      } else {
        const newJob = await createJob(jobForm);
        setJobPosts((prev) => [...prev, newJob]);
        enqueueSnackbar('Job created successfully!', { variant: 'success' });
      }
      setIsJobDialogOpen(false);
    } catch (error) {
      console.error('Error saving job:', error);
      enqueueSnackbar('Failed to save job. Please try again.', { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteJob = async () => {
    try {
      await deleteJob(deletingJobId);
      setJobPosts((prev) => prev.filter((j) => j.id !== deletingJobId));
      enqueueSnackbar('Job deleted successfully!', { variant: 'success' });
      setDeletingJobId(null);
    } catch (error) {
      console.error('Error deleting job:', error);
      enqueueSnackbar('Failed to delete job. Please try again.', { variant: 'error' });
    }
  };

  const handleAssignRecruiter = async (jobId, positionCode, recruiterId) => {
    if (!jobId || !positionCode) return;
    setAssigning(true);
    try {
      const updatedJob = await assignRecruiterToPosition(jobId, positionCode, recruiterId);
      // Update local state with the returned updated job
      setJobPosts((prev) => prev.map((job) => (job.id === updatedJob.id ? updatedJob : job)));
      setSelectedJob(updatedJob);
      enqueueSnackbar('Position assigned successfully!', { variant: 'success' });
    } catch (error) {
      console.error('Error assigning recruiter:', error);
      enqueueSnackbar('Failed to assign recruiter. Please try again.', { variant: 'error' });
    } finally {
      setAssigning(false);
    }
  };

  const handleBulkAssign = async () => {
    if (!bulkAssignRecruiterId || selectedPositionIds.length === 0) {
      enqueueSnackbar('Select recruiter and positions before bulk assign.', { variant: 'warning' });
      return;
    }

    if (!selectedJob) return;
    setAssigning(true);
    try {
      let updatedJob = { ...selectedJob };
      for (const positionId of selectedPositionIds) {
        const position = updatedJob.positions.find((p) => p.positionId === positionId);
        if (position && position.positionCode) {
          updatedJob = await assignRecruiterToPosition(updatedJob.id, position.positionCode, bulkAssignRecruiterId);
        }
      }

      setJobPosts((prev) => prev.map((job) => (job.id === updatedJob.id ? updatedJob : job)));
      setSelectedJob(updatedJob);
      setSelectedPositionIds([]);
      setBulkAssignRecruiterId('');
      enqueueSnackbar('All selected positions assigned successfully!', { variant: 'success' });
    } catch (error) {
      console.error('Error in bulk assignment:', error);
      enqueueSnackbar('Bulk assignment failed. Please try again.', { variant: 'error' });
    } finally {
      setAssigning(false);
    }
  };

  const filteredPositions = useMemo(() => {
    if (!selectedJob?.positions) return [];
    return selectedJob.positions.filter((pos) => {
      const matchesSearch = pos.positionCode.toLowerCase().includes(positionSearch.toLowerCase());
      const isUnassigned = !pos.recruiterRefId || pos.recruiterRefId === '';
      const matchesFilter = positionFilter === 'ALL' ? true : isUnassigned;
      return matchesSearch && matchesFilter;
    });
  }, [selectedJob, positionSearch, positionFilter]);

  const positionColumns = [
    {
      field: 'positionCode',
      headerName: 'Position Code',
      flex: 1,
      renderCell: (params) => params?.row?.positionCode || ''
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params) => params?.row?.status || 'Unknown'
    },
    {
      field: 'recruiterRefId',
      headerName: 'Recruiter',
      flex: 1,
      renderCell: (params) => {
        const recruiterRefId = params?.row?.recruiterRefId;
        if (!recruiterRefId) return 'Unassigned';
        const rec = recruiters.find(r => r.userId === recruiterRefId);
        return rec ? `${rec.firstName} ${rec.lastName}` : 'Unknown Recruiter';
      }
    },
    {
      field: 'assign',
      headerName: 'Assign Recruiter',
      sortable: false,
      filterable: false,
      width: 200,
      renderCell: (params) => {
        const positionCode = params?.row?.positionCode;
        const recruiterId = params?.row?.recruiterRefId || '';
        if (!positionCode) {
          return <Typography variant="body2" color="textSecondary">No Position</Typography>;
        }
        return (
          <FormControl fullWidth size="small">
            <InputLabel>Recruiter</InputLabel>
            <Select
              value={recruiterId}
              label="Recruiter"
              onChange={(e) => {
                if (selectedJob?.id && positionCode) {
                  handleAssignRecruiter(selectedJob.id, positionCode, e.target.value);
                }
              }}
              disabled={assigning || loadingRecruiters}
            >
              <MenuItem value="">Unassigned</MenuItem>
              {recruiters.map((rec) => (
                <MenuItem key={rec.userId} value={rec.userId}>
                  {`${rec.firstName} ${rec.lastName}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      },
    },
  ];

  const jobColumns = [
    { field: 'jobRefId', headerName: 'Job Ref ID', width: 150 },
    { field: 'jobTitle', headerName: 'Title', width: 200 },
    { field: 'department', headerName: 'Department', width: 150 },
    { field: 'jobType', headerName: 'Type', width: 120 },
    { field: 'jobLocation', headerName: 'Location', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      sortable: false,
      filterable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <Tooltip title="Manage Positions">
            <IconButton color="secondary" onClick={() => openPositionsDialog(params.row)}>
              <AssignmentIndIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Job">
            <IconButton color="primary" onClick={() => openJobDialog(params.row)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Job">
            <IconButton color="error" onClick={() => setDeletingJobId(params.row.id)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Card elevation={3} sx={{ borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
          Manager Panel
        </Typography>
        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
          Create, update, delete jobs and manage positions effectively. Assign positions to recruiters easily.
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {loadingJobs && (
          <Box display="flex" justifyContent="center" alignItems="center" height={100}>
            <CircularProgress />
          </Box>
        )}

        {loadError && (
          <Box mb={2}>
            <Alert severity="error">
              {loadError.toString()}
            </Alert>
          </Box>
        )}

        {!loadingJobs && !loadError && jobPosts.length === 0 && (
          <Typography variant="body1" sx={{ mb: 2 }}>
            No jobs found. Please create a new job.
          </Typography>
        )}

        {!loadingJobs && !loadError && (
          <>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              sx={{ mb: 2, fontWeight: 'bold' }}
              onClick={() => openJobDialog()}
            >
              Create Job
            </Button>

            <Paper variant="outlined" sx={{ p: 1, borderRadius: 2 }}>
              <DataGrid
                rows={jobPosts}
                columns={jobColumns}
                autoHeight
                pageSize={5}
                rowsPerPageOptions={[5, 10]}
                getRowId={(row) => row.id}
                sx={{
                  '& .MuiDataGrid-row:hover': {
                    backgroundColor: '#f9f9f9',
                  },
                }}
              />
            </Paper>
          </>
        )}

        {/* Job Form Dialog */}
        <Dialog
          open={isJobDialogOpen}
          onClose={() => setIsJobDialogOpen(false)}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>{isEditing ? 'Edit Job' : 'Create Job'}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  label="Job Title"
                  fullWidth
                  value={jobForm.jobTitle}
                  onChange={(e) => handleJobFormChange('jobTitle', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Job Description"
                  fullWidth
                  multiline
                  rows={3}
                  value={jobForm.jobDescription}
                  onChange={(e) => handleJobFormChange('jobDescription', e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Job Location"
                  fullWidth
                  value={jobForm.jobLocation}
                  onChange={(e) => handleJobFormChange('jobLocation', e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Department"
                  fullWidth
                  value={jobForm.department}
                  onChange={(e) => handleJobFormChange('department', e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Job Type"
                  fullWidth
                  value={jobForm.jobType}
                  onChange={(e) => handleJobFormChange('jobType', e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Salary Range"
                  fullWidth
                  value={jobForm.salaryRange}
                  onChange={(e) => handleJobFormChange('salaryRange', e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Posting Date"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={jobForm.postingDate}
                  onChange={(e) => handleJobFormChange('postingDate', e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Closing Date"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={jobForm.closingDate}
                  onChange={(e) => handleJobFormChange('closingDate', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Required Skills"
                  fullWidth
                  value={jobForm.requiredSkills}
                  onChange={(e) => handleJobFormChange('requiredSkills', e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Experience Level"
                  fullWidth
                  value={jobForm.experienceLevel}
                  onChange={(e) => handleJobFormChange('experienceLevel', e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Number of Positions"
                  type="number"
                  fullWidth
                  value={jobForm.positions}
                  onChange={(e) => handleJobFormChange('positions', e.target.value)}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsJobDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={handleSaveJob} disabled={saving}>
              {saving ? <CircularProgress size={24} /> : (isEditing ? 'Update Job' : 'Create Job')}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={Boolean(deletingJobId)}
          onClose={() => setDeletingJobId(null)}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>Are you sure you want to delete this job?</DialogContent>
          <DialogActions>
            <Button onClick={() => setDeletingJobId(null)}>Cancel</Button>
            <Button variant="contained" color="error" onClick={handleDeleteJob}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Positions Management Dialog */}
        <Dialog
          open={isPositionsDialogOpen}
          onClose={() => setIsPositionsDialogOpen(false)}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>Manage Positions</DialogTitle>
          <DialogContent>
            {/* Search and Filter Controls */}
            <Box display="flex" gap={2} mb={2}>
              <TextField
                label="Search by Position Code"
                variant="outlined"
                size="small"
                value={positionSearch}
                onChange={(e) => setPositionSearch(e.target.value)}
                sx={{ flex: 1 }}
              />
              <FormControl size="small" sx={{ width: 200 }}>
                <InputLabel>Filter</InputLabel>
                <Select
                  value={positionFilter}
                  label="Filter"
                  onChange={(e) => setPositionFilter(e.target.value)}
                >
                  <MenuItem value="ALL">All Positions</MenuItem>
                  <MenuItem value="UNASSIGNED">Unassigned Only</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Bulk Assign Controls */}
            <Box display="flex" gap={2} mb={2}>
              <FormControl size="small" sx={{ width: 200 }}>
                <InputLabel>Bulk Assign Recruiter</InputLabel>
                <Select
                  value={bulkAssignRecruiterId}
                  label="Bulk Assign Recruiter"
                  onChange={(e) => setBulkAssignRecruiterId(e.target.value)}
                  disabled={assigning || loadingRecruiters}
                >
                  <MenuItem value="">Unassigned</MenuItem>
                  {recruiters.map((rec) => (
                    <MenuItem key={rec.userId} value={rec.userId}>
                      {`${rec.firstName} ${rec.lastName}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                color="primary"
                onClick={handleBulkAssign}
                disabled={assigning || selectedPositionIds.length === 0}
              >
                {assigning ? <CircularProgress size={20} /> : 'Bulk Assign'}
              </Button>
            </Box>

            {selectedJob && Array.isArray(selectedJob.positions) && selectedJob.positions.length > 0 && (
              <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                  rows={filteredPositions || []}
                  columns={positionColumns}
                  getRowId={(row) => row.positionId}
                  checkboxSelection
                  onSelectionModelChange={(newSelection) => {
                    setSelectedPositionIds(newSelection);
                  }}
                  selectionModel={selectedPositionIds}
                  pageSize={5}
                  rowsPerPageOptions={[5, 10, 20]}
                  sx={{
                    '& .MuiDataGrid-row:hover': {
                      backgroundColor: '#f9f9f9',
                    },
                  }}
                />
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsPositionsDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

ManagerPanel.propTypes = {
  tenantId: PropTypes.string.isRequired,
};

export default ManagerPanel;