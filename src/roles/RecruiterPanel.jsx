// src/components/RecruiterPanel.js
import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Divider,
  CircularProgress,
  Alert,
  Button,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { DataGrid } from '@mui/x-data-grid';
import { useSnackbar } from 'notistack';

// Services
import {
  getAssignedJobsByRecruiter,
  // Possibly other job services
} from '../services/jobService';
import {
  getCandidates,
} from '../services/candidateService';

// Child modals
import AddCandidate from './AddCandidate';
import ScheduleInterviewModal from './ScheduleInterviewModal';
import BatchScheduleInterviewModal from './BatchScheduleInterviewModal';

const RecruiterPanel = () => {
  const { enqueueSnackbar } = useSnackbar();

  // "views": 'jobs' | 'positions' | 'candidateScreen'
  const [currentView, setCurrentView] = useState('jobs');
  // Loading & error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Data arrays
  const [jobs, setJobs] = useState([]);
  const [positions, setPositions] = useState([]);
  const [candidates, setCandidates] = useState([]);

  // Selected job & position
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);

  // Modals (open/close states)
  const [openAddCandidate, setOpenAddCandidate] = useState(false);
  const [openScheduleModal, setOpenScheduleModal] = useState(false);
  const [openBatchScheduleModal, setOpenBatchScheduleModal] = useState(false);

  // Single-candidate interview
  const [candidateForInterview, setCandidateForInterview] = useState(null);

  // Multiple candidates for batch scheduling
  const [selectedCandidateIds, setSelectedCandidateIds] = useState([]);

  //------------------------------------------------------------
  // 1) On mount, fetch assigned Jobs
  //------------------------------------------------------------
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        const assignedJobs = await getAssignedJobsByRecruiter();
        setJobs(assignedJobs);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError(err.message || 'Failed to fetch jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  //------------------------------------------------------------
  // Handle Job Click
  //------------------------------------------------------------
  const handleJobClick = (job) => {
    console.log('Job clicked:', job); // Debugging
    setSelectedJob(job);
    setPositions(job.positions || []);
    setError(null);
    setCurrentView('positions');
  };

  //------------------------------------------------------------
  // Job Columns Configuration
  //------------------------------------------------------------
  const jobColumns = [
    { field: 'jobRefId', headerName: 'Job Ref', width: 120 },
    { field: 'jobTitle', headerName: 'Job Title', width: 200 },
    { field: 'department', headerName: 'Department', width: 140 },
    { field: 'jobLocation', headerName: 'Location', width: 140 },
    {
      field: 'positionsCount',
      headerName: 'No. of Positions',
      width: 180,
      renderCell: (params) => (
        <Typography>{(params.row.positions || []).length}</Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          onClick={() => handleJobClick(params.row)}
          sx={{ textTransform: 'none' }}
        >
          View
        </Button>
      ),
    },
  ];

  //------------------------------------------------------------
  // Render Jobs View
  //------------------------------------------------------------
  const renderJobsView = () => (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
        Your Assigned Jobs
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {jobs.length === 0 ? (
        <Typography>No jobs assigned yet.</Typography>
      ) : (
        <Box sx={{ height: 400 }}>
          <DataGrid
            rows={jobs}
            columns={jobColumns}
            getRowId={(row) => row.jobRefId}
            pageSize={5}
            rowsPerPageOptions={[5, 10]}
            disableSelectionOnClick
            sx={{
              '& .MuiDataGrid-row:hover': { backgroundColor: '#f9f9f9' },
            }}
          />
        </Box>
      )}
    </Box>
  );

  //------------------------------------------------------------
  // Handle Position Click
  //------------------------------------------------------------
  const handlePositionClick = async (position) => {
    console.log('Position clicked:', position); // Debugging
    setSelectedPosition(position);
    setLoading(true);
    setError(null);

    try {
      const positionCandidates = await getCandidates(position.positionId, '');
      console.log('Fetched candidates:', positionCandidates); // Debugging
      setCandidates(positionCandidates);
      setCurrentView('candidateScreen');
    } catch (err) {
      console.error('Error loading candidates:', err);
      enqueueSnackbar('Failed to load candidates', { variant: 'error' });
      setError('Failed to load candidates.');
    } finally {
      setLoading(false);
    }
  };

  //------------------------------------------------------------
  // Position Columns Configuration
  //------------------------------------------------------------
  const positionColumns = [
    { field: 'positionCode', headerName: 'Position Code', flex: 1 },
    { field: 'status', headerName: 'Status', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          onClick={() => handlePositionClick(params.row)}
          sx={{ textTransform: 'none' }}
        >
          Candidates
        </Button>
      ),
    },
  ];

  //------------------------------------------------------------
  // Render Positions View
  //------------------------------------------------------------
  const renderPositionsView = () => (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <IconButton
          onClick={() => {
            console.log('Navigating back to Jobs view'); // Debugging
            setCurrentView('jobs');
            setPositions([]);
            setSelectedJob(null);
            setSelectedCandidateIds([]); // Reset selection
          }}
          aria-label="back to jobs"
        >
          <ArrowBackIcon />
        </IconButton>

        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Positions for {selectedJob?.jobTitle}
        </Typography>
        <Box />
      </Box>

      <Divider sx={{ mb: 2 }} />

      {positions.length === 0 ? (
        <Typography>No positions found for this job.</Typography>
      ) : (
        <Box sx={{ height: 400 }}>
          <DataGrid
            rows={positions}
            columns={positionColumns}
            getRowId={(row) => row.positionId}
            pageSize={5}
            rowsPerPageOptions={[5, 10]}
            disableSelectionOnClick
            sx={{ '& .MuiDataGrid-row:hover': { backgroundColor: '#f9f9f9' } }}
          />
        </Box>
      )}
    </Box>
  );

  //------------------------------------------------------------
  // Handle Schedule Interview Click
  //------------------------------------------------------------
  const handleScheduleInterviewClick = (candidate) => {
    console.log('Schedule button clicked for candidate:', candidate); // Debugging
    setCandidateForInterview(candidate);
    setOpenScheduleModal(true);
  };

  //------------------------------------------------------------
  // Candidate Columns Configuration
  //------------------------------------------------------------
  const candidateColumns = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'firstName', headerName: 'First Name', flex: 1 },
    { field: 'lastName', headerName: 'Last Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 180,
      sortable: false,
      renderCell: (params) => (
        <>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleScheduleInterviewClick(params.row)}
            sx={{ mr: 1, textTransform: 'none' }}
          >
            Schedule Interview
          </Button>
        </>
      ),
    },
  ];

  //------------------------------------------------------------
  // Render Candidates View
  //------------------------------------------------------------
  const renderCandidateScreen = () => (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <IconButton
          onClick={() => {
            console.log('Navigating back to Positions view'); // Debugging
            setCurrentView('positions');
            setCandidates([]);
            setSelectedPosition(null);
            setSelectedCandidateIds([]);
          }}
          aria-label="back to positions"
        >
          <ArrowBackIcon />
        </IconButton>

        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Candidates for {selectedPosition?.positionCode}
        </Typography>

        <Button
          variant="contained"
          onClick={() => setOpenAddCandidate(true)}
          aria-label="add candidate"
        >
          Add Candidate
        </Button>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {candidates.length === 0 ? (
        <Typography>No candidates yet. You can add new candidates.</Typography>
      ) : (
        <Box sx={{ height: 500 }}>
          <DataGrid
            rows={candidates}
            columns={candidateColumns}
            getRowId={(row) => row.id}
            pageSize={10}
            rowsPerPageOptions={[10, 20]}
            checkboxSelection
            onSelectionModelChange={(selection) => setSelectedCandidateIds(selection)}
            selectionModel={selectedCandidateIds}
            disableSelectionOnClick
            sx={{ '& .MuiDataGrid-row:hover': { backgroundColor: '#f9f9f9' } }}
          />
        </Box>
      )}

      {/* Bulk Schedule Interviews Button */}
      {selectedCandidateIds.length > 0 && (
        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleBatchScheduleClick}
            sx={{ textTransform: 'none' }}
          >
            Schedule Interviews ({selectedCandidateIds.length})
          </Button>
        </Box>
      )}

      {/* Add Candidate Modal */}
      <AddCandidate
        open={openAddCandidate}
        handleClose={(newlyAdded) => {
          setOpenAddCandidate(false);
          if (newlyAdded && newlyAdded.length > 0) {
            setCandidates((prev) => [...prev, ...newlyAdded]);
            enqueueSnackbar(`${newlyAdded.length} candidate(s) added successfully!`, {
              variant: 'success',
            });
          }
        }}
        jobId={selectedJob?.jobId}
        positionId={selectedPosition?.positionId}
      />

      {/* Single-Candidate Interview Modal */}
      <ScheduleInterviewModal
        open={openScheduleModal}
        onClose={() => setOpenScheduleModal(false)}
        candidate={candidateForInterview}
        onInterviewScheduled={(updatedCandidate) => {
          console.log('Interview scheduled for candidate:', updatedCandidate); // Debugging
          // Update the candidate list with the scheduled interview info
          setCandidates((prev) =>
            prev.map((cand) =>
              cand.id === updatedCandidate.candidateId ? { ...cand, scheduledInterviews: [...(cand.scheduledInterviews || []), updatedCandidate] } : cand
            )
          );
          enqueueSnackbar('Interview scheduled successfully!', { variant: 'success' });
        }}
      />

      {/* Batch Schedule Interview Modal */}
      <BatchScheduleInterviewModal
        open={openBatchScheduleModal}
        onClose={() => setOpenBatchScheduleModal(false)}
        candidateIds={selectedCandidateIds}
        onBatchInterviewScheduled={(updatedCandidates) => {
          console.log('Batch interviews scheduled for candidates:', updatedCandidates); // Debugging
          // Update the candidate list with updated info
          setCandidates((prev) =>
            prev.map((cand) => {
              const updated = updatedCandidates.find((u) => u.id === cand.id);
              return updated ? { ...cand, scheduledInterviews: [...(cand.scheduledInterviews || []), ...updated.scheduledInterviews] } : cand;
            })
          );
          setSelectedCandidateIds([]);
          enqueueSnackbar('Interviews scheduled successfully!', { variant: 'success' });
        }}
      />
    </Box>
  );

  //------------------------------------------------------------
  // Handle Batch Schedule Interview Click
  //------------------------------------------------------------
  const handleBatchScheduleClick = () => {
    console.log('Batch schedule interviews clicked for candidates:', selectedCandidateIds); // Debugging
    // Opens the BatchScheduleInterviewModal
    setOpenBatchScheduleModal(true);
  };

  //------------------------------------------------------------
  // Render Component
  //------------------------------------------------------------
  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 2, backgroundColor: '#f9f9f9' }}>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
        Recruiter Panel
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          {currentView === 'jobs' && renderJobsView()}
          {currentView === 'positions' && renderPositionsView()}
          {currentView === 'candidateScreen' && renderCandidateScreen()}
        </Box>
      )}
    </Paper>
  );
};

export default RecruiterPanel;