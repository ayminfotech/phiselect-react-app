import React, { useEffect, useState, useMemo } from 'react';
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

// Import your services
import {
  createJob,
  updateJob,
  deleteJob,
  getAllJobs,
  assignRecruiterToPosition
} from '../services/jobService';
import { getUsersByTenantIdAndRoles } from '../services/UserService';

const ManagerPanel = () => {
  const { enqueueSnackbar } = useSnackbar();

  // ====== JOBS STATE ======
  const [jobPosts, setJobPosts] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadError, setLoadError] = useState(null);

  // ====== CREATE/EDIT JOB DIALOG ======
  const [isJobDialogOpen, setIsJobDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [jobForm, setJobForm] = useState({});
  const [saving, setSaving] = useState(false);

  // ====== DELETE JOB ======
  const [deletingJobId, setDeletingJobId] = useState(null);

  // ====== POSITIONS DIALOG ======
  const [isPositionsDialogOpen, setIsPositionsDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [assigning, setAssigning] = useState(false);

  // ====== RECRUITERS ======
  const [recruiters, setRecruiters] = useState([]);
  const [loadingRecruiters, setLoadingRecruiters] = useState(false);

  // ====== POSITION FILTERING & BULK ASSIGN ======
  const [positionSearch, setPositionSearch] = useState('');
  const [positionFilter, setPositionFilter] = useState('ALL'); // or "UNASSIGNED"
  const [selectedPositionIds, setSelectedPositionIds] = useState([]);
  const [bulkAssignRecruiterId, setBulkAssignRecruiterId] = useState('');

  // ====== ASSIGN RECRUITER DIALOG (Dedicated) ======
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [selectedRecruiterId, setSelectedRecruiterId] = useState('');

  //----------------------------------------------------------------------
  // 1) Fetch all jobs on component mount
  //----------------------------------------------------------------------
  useEffect(() => {
    const fetchJobs = async () => {
      setLoadingJobs(true);
      setLoadError(null);

      try {
        const jobs = await getAllJobs();
        setJobPosts(jobs);
      } catch (error) {
        console.error('Failed to load jobs:', error);
        setLoadError(error?.message || 'Failed to load jobs.');
      } finally {
        setLoadingJobs(false);
      }
    };

    fetchJobs();
  }, []);

  //----------------------------------------------------------------------
  // 2) Fetch recruiters when Positions dialog opens
  //----------------------------------------------------------------------
  useEffect(() => {
    const fetchRecruiters = async () => {
      setLoadingRecruiters(true);
      try {
        const fetchedRecruiters = await getUsersByTenantIdAndRoles(['RECRUITER']);
        setRecruiters(fetchedRecruiters);
      } catch (error) {
        enqueueSnackbar('Failed to load recruiters.', { variant: 'error' });
        console.error(error);
      } finally {
        setLoadingRecruiters(false);
      }
    };

    if (isPositionsDialogOpen) {
      fetchRecruiters();
    }
  }, [isPositionsDialogOpen, enqueueSnackbar]);

  //----------------------------------------------------------------------
  // 3) Create/Edit Job
  //----------------------------------------------------------------------
  const openJobDialog = (job = null) => {
    setIsEditing(Boolean(job));
    setJobForm(
      job || {
        jobTitle: '',
        jobDescription: '',
        jobLocation: '',
        jobType: '',
        department: '',
        salaryRange: '',
        postingDate: '',
        closingDate: '',
        requiredSkills: '',
        experienceLevel: '',
        positions: 1  // Adding default positions count
      }
    );
    setIsJobDialogOpen(true);
  };

  const closeJobDialog = () => {
    setIsJobDialogOpen(false);
    setSaving(false);
  };

  const handleJobFormChange = (field, value) => {
    setJobForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveJob = async () => {
    setSaving(true);
    try {
      if (isEditing && jobForm.id) {
        // Update existing job
        const updatedJob = await updateJob(jobForm.id, jobForm);
        setJobPosts((prev) => prev.map((j) => (j.id === updatedJob.id ? updatedJob : j)));
        enqueueSnackbar('Job updated successfully!', { variant: 'success' });
      } else {
        // Create new job
        const newJob = await createJob(jobForm);
        setJobPosts((prev) => [...prev, newJob]);
        enqueueSnackbar('Job created successfully!', { variant: 'success' });
      }
      closeJobDialog();
    } catch (error) {
      console.error('Error saving job:', error);
      enqueueSnackbar('Failed to save job. Please try again.', { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  //----------------------------------------------------------------------
  // 4) Delete Job
  //----------------------------------------------------------------------
  const confirmDeleteJob = (jobId) => {
    setDeletingJobId(jobId);
  };

  const handleDeleteJob = async () => {
    if (!deletingJobId) return;
    try {
      await deleteJob(deletingJobId);
      setJobPosts((prev) => prev.filter((j) => j.id !== deletingJobId));
      enqueueSnackbar('Job deleted successfully!', { variant: 'success' });
    } catch (error) {
      console.error('Error deleting job:', error);
      enqueueSnackbar('Failed to delete job. Please try again.', { variant: 'error' });
    }
    setDeletingJobId(null);
  };

  //----------------------------------------------------------------------
  // 5) Manage Positions
  //----------------------------------------------------------------------
  const openPositionsDialog = (job) => {
    setSelectedJob(job);
    setPositionSearch('');
    setPositionFilter('ALL');
    setSelectedPositionIds([]);
    setIsPositionsDialogOpen(true);
  };

  const closePositionsDialog = () => {
    setIsPositionsDialogOpen(false);
    setSelectedJob(null);
  };

  //----------------------------------------------------------------------
  // 6) Bulk Assign Recruiter
  //----------------------------------------------------------------------
  const handleBulkAssign = async () => {
    if (!bulkAssignRecruiterId || selectedPositionIds.length === 0) {
      enqueueSnackbar('Select a recruiter and at least one position before bulk assign.', {
        variant: 'warning'
      });
      return;
    }
    if (!selectedJob) return;

    setAssigning(true);
    try {
      let updatedJob = { ...selectedJob };
      for (const positionId of selectedPositionIds) {
        const position = updatedJob.positions.find((p) => p.positionId === positionId);
        if (position && position.positionCode) {
          updatedJob = await assignRecruiterToPosition(
            updatedJob.id,
            position.positionCode,
            bulkAssignRecruiterId
          );
        }
      }
      // Update local state
      setJobPosts((prev) => prev.map((job) => (job.id === updatedJob.id ? updatedJob : job)));
      setSelectedJob(updatedJob);

      // Reset selection
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

  //----------------------------------------------------------------------
  // 7) Dedicated "Assign Recruiter" dialog
  //----------------------------------------------------------------------
  const openAssignDialog = (position) => {
    setSelectedPosition(position);
    setSelectedRecruiterId(position.recruiterRefId || '');
    setIsAssignDialogOpen(true);
  };

  const closeAssignDialog = () => {
    setIsAssignDialogOpen(false);
    setSelectedPosition(null);
    setSelectedRecruiterId('');
  };

  const handleAssignSave = async () => {
    if (!selectedPosition || !selectedJob) return;

    setAssigning(true);
    try {
      const updatedJob = await assignRecruiterToPosition(
        selectedJob.id,
        selectedPosition.positionCode,
        selectedRecruiterId
      );

      setJobPosts((prev) =>
        prev.map((job) => (job.id === updatedJob.id ? updatedJob : job))
      );
      setSelectedJob(updatedJob);

      enqueueSnackbar('Position assigned successfully!', { variant: 'success' });
    } catch (error) {
      console.error('Error assigning recruiter:', error);
      enqueueSnackbar('Failed to assign recruiter. Please try again.', { variant: 'error' });
    } finally {
      setAssigning(false);
      closeAssignDialog();
    }
  };

  //----------------------------------------------------------------------
  // 8) Filtered Positions
  //----------------------------------------------------------------------
  const filteredPositions = useMemo(() => {
    if (!selectedJob?.positions) return [];
    return selectedJob.positions.filter((pos) => {
      const matchesSearch = pos.positionCode
        ?.toLowerCase()
        .includes(positionSearch.toLowerCase());
      const isUnassigned = !pos.recruiterRefId || pos.recruiterRefId === '';
      const matchesFilter = positionFilter === 'ALL' ? true : isUnassigned;
      return matchesSearch && matchesFilter;
    });
  }, [selectedJob, positionSearch, positionFilter]);

  //----------------------------------------------------------------------
  // 9) Columns
  //----------------------------------------------------------------------
  // Jobs Table
  const jobColumns = [
    { field: 'jobRefId', headerName: 'Job Ref ID', width: 140 },
    { field: 'jobTitle', headerName: 'Title', width: 180 },
    { field: 'department', headerName: 'Department', width: 140 },
    { field: 'jobType', headerName: 'Type', width: 110 },
    { field: 'jobLocation', headerName: 'Location', width: 140 },
    {
      field: 'positionsCount',
      headerName: 'No. of Positions',
      width: 180,
      renderCell: (params) => (
        <Typography>{params.row.positions ? params.row.positions.length : 0}</Typography>
      ),
    },
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
            <IconButton color="error" onClick={() => confirmDeleteJob(params.row.id)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  // Positions Table
  const positionColumns = [
    {
      field: 'positionCode',
      headerName: 'Position Code',
      flex: 1
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1
    },
    {
      field: 'recruiterRefId',
      headerName: 'Recruiter',
      flex: 1,
      renderCell: (params) => {
        const recruiterRefId = params?.row?.recruiterRefId;
        if (!recruiterRefId) return 'Unassigned';

        const recruiter = recruiters.find((r) => r.userId === recruiterRefId);
        return recruiter ? `${recruiter.firstName} ${recruiter.lastName}` : 'Unknown Recruiter';
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const position = params.row;
        return (
          <Tooltip title="Assign Recruiter">
            <IconButton color="primary" onClick={() => openAssignDialog(position)}>
              <AssignmentIndIcon />
            </IconButton>
          </Tooltip>
        );
      }
    }
  ];

  //----------------------------------------------------------------------
  // 10) Render
  //----------------------------------------------------------------------
  return (
    <Card elevation={3} sx={{ borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
          Manager Panel
        </Typography>
        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
          Create, update, and delete jobs. Manage positions and bulk-assign recruiters.
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {/* Loading */}
        {loadingJobs && (
          <Box display="flex" justifyContent="center" alignItems="center" height={100}>
            <CircularProgress />
          </Box>
        )}

        {/* Error */}
        {loadError && (
          <Box mb={2}>
            <Alert severity="error">{loadError.toString()}</Alert>
          </Box>
        )}

        {/* Jobs List */}
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
                    backgroundColor: '#f9f9f9'
                  }
                }}
              />
            </Paper>
          </>
        )}

        {/* CREATE/EDIT JOB DIALOG */}
        <Dialog open={isJobDialogOpen} onClose={closeJobDialog} fullWidth maxWidth="md">
          <DialogTitle>{isEditing ? 'Edit Job' : 'Create Job'}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  label="Job Title"
                  fullWidth
                  value={jobForm.jobTitle || ''}
                  onChange={(e) => handleJobFormChange('jobTitle', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Job Description"
                  fullWidth
                  multiline
                  rows={3}
                  value={jobForm.jobDescription || ''}
                  onChange={(e) => handleJobFormChange('jobDescription', e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Job Location"
                  fullWidth
                  value={jobForm.jobLocation || ''}
                  onChange={(e) => handleJobFormChange('jobLocation', e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Department"
                  fullWidth
                  value={jobForm.department || ''}
                  onChange={(e) => handleJobFormChange('department', e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Job Type"
                  fullWidth
                  value={jobForm.jobType || ''}
                  onChange={(e) => handleJobFormChange('jobType', e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Salary Range"
                  fullWidth
                  value={jobForm.salaryRange || ''}
                  onChange={(e) => handleJobFormChange('salaryRange', e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Posting Date"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={jobForm.postingDate || ''}
                  onChange={(e) => handleJobFormChange('postingDate', e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Closing Date"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={jobForm.closingDate || ''}
                  onChange={(e) => handleJobFormChange('closingDate', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Required Skills"
                  fullWidth
                  value={jobForm.requiredSkills || ''}
                  onChange={(e) => handleJobFormChange('requiredSkills', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Experience Level"
                  fullWidth
                  value={jobForm.experienceLevel || ''}
                  onChange={(e) => handleJobFormChange('experienceLevel', e.target.value)}
                />
              </Grid>
              {/* Added field for Number of Positions */}
              <Grid item xs={12}>
                <TextField
                  label="Number of Positions"
                  fullWidth
                  type="number"
                  value={jobForm.positionsCount || ''}
                  onChange={(e) => handleJobFormChange('positionsCount', e.target.value)}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeJobDialog}>Cancel</Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveJob}
              disabled={saving}
            >
              {saving ? <CircularProgress size={24} /> : isEditing ? 'Update Job' : 'Create Job'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* DELETE CONFIRMATION DIALOG */}
        <Dialog open={Boolean(deletingJobId)} onClose={() => setDeletingJobId(null)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this job? This action cannot be undone.
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeletingJobId(null)}>Cancel</Button>
            <Button variant="contained" color="error" onClick={handleDeleteJob}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* POSITIONS DIALOG */}
        <Dialog open={isPositionsDialogOpen} onClose={closePositionsDialog} fullWidth maxWidth="md">
          <DialogTitle>Manage Positions</DialogTitle>
          <DialogContent>
            {/* SEARCH & FILTER */}
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

            {/* BULK ASSIGN CONTROLS */}
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
                disabled={assigning || selectedPositionIds.length === 0}
                onClick={handleBulkAssign}
              >
                {assigning ? <CircularProgress size={20} /> : 'Bulk Assign'}
              </Button>
            </Box>

            {/* POSITIONS TABLE */}
            {selectedJob && Array.isArray(selectedJob.positions) && selectedJob.positions.length > 0 ? (
              <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                  rows={filteredPositions}
                  columns={positionColumns}
                  getRowId={(row) => row.positionId}
                  checkboxSelection
                  onSelectionModelChange={(newSelection) => setSelectedPositionIds(newSelection)}
                  selectionModel={selectedPositionIds}
                  pageSize={5}
                  rowsPerPageOptions={[5, 10]}
                  sx={{
                    '& .MuiDataGrid-row:hover': {
                      backgroundColor: '#f9f9f9'
                    }
                  }}
                />
              </div>
            ) : (
              <Typography variant="body2" color="text.secondary" mt={2}>
                No positions found for this job.
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={closePositionsDialog}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* ASSIGN RECRUITER DIALOG */}
        <Dialog open={isAssignDialogOpen} onClose={closeAssignDialog} fullWidth maxWidth="sm">
          <DialogTitle>Assign Recruiter</DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Select Recruiter</InputLabel>
              <Select
                label="Select Recruiter"
                value={selectedRecruiterId}
                onChange={(e) => setSelectedRecruiterId(e.target.value)}
              >
                <MenuItem value="">
                  <em>Unassigned</em>
                </MenuItem>
                {recruiters.map((rec) => (
                  <MenuItem key={rec.userId} value={rec.userId}>
                    {`${rec.firstName} ${rec.lastName}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeAssignDialog}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={handleAssignSave}>
              {assigning ? <CircularProgress size={20} /> : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

ManagerPanel.propTypes = {
  tenantId: PropTypes.string
};

export default ManagerPanel;