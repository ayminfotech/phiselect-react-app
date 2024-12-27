// src/components/RecruiterPanel.jsx

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
  Chip,
  Tooltip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { DataGrid } from '@mui/x-data-grid';
import { useSnackbar } from 'notistack';

// Services
import { getAssignedJobsByRecruiter } from '../services/jobService';
import { getCandidates } from '../services/candidateService';
import {
  getScheduledInterviewsByCandidate,
  cancelInterview,
  updateInterview,
} from '../services/interviewerService'; // Ensure correct service file

// Child modals and components
import AddCandidate from './AddCandidate';
import ScheduleInterviewModal from './ScheduleInterviewModal';
import BatchScheduleInterviewModal from './BatchScheduleInterviewModal';
import InterviewDetailsModal from './InterviewDetailsModal';

// Helper functions
const getUserRole = () => {
  const authData = localStorage.getItem('auth');
  const auth = authData ? JSON.parse(authData) : null;
  return auth?.role || 'recruiter'; // Default to 'recruiter' if not set
};

const getUserId = () => {
  const authData = localStorage.getItem('auth');
  const auth = authData ? JSON.parse(authData) : null;
  return auth?.userRefId || null;
};

const RecruiterPanel = () => {
  const { enqueueSnackbar } = useSnackbar();

  // Views: 'jobs' | 'positions' | 'candidateScreen'
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
  const [openInterviewDetails, setOpenInterviewDetails] = useState(false);

  // Single-candidate interview
  const [candidateForInterview, setCandidateForInterview] = useState(null);

  // Multiple candidates for batch scheduling
  const [selectedCandidateIds, setSelectedCandidateIds] = useState([]);

  // State for Interview Details Modal
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [selectedInterviewCandidateId, setSelectedInterviewCandidateId] = useState(null);

  // User Info
  const userRole = getUserRole(); // 'recruiter' or 'interviewer'
  const userId = getUserId(); // Logged-in user's ID

  //------------------------------------------------------------
  // 1) On mount, fetch assigned Jobs
  //------------------------------------------------------------
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        const assignedJobs = await getAssignedJobsByRecruiter();
        console.log('Assigned Jobs:', assignedJobs); // Debugging
        setJobs(assignedJobs);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError(err.message || 'Failed to fetch jobs');
        enqueueSnackbar('Failed to fetch jobs.', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [enqueueSnackbar]);

  //------------------------------------------------------------
  // Handle Job Click
  //------------------------------------------------------------
  const handleJobClick = (job) => {
    console.log('Selected Job:', job); // Debugging
    setSelectedJob(job);
    setPositions(job.positions || []);
    setError(null);
    setCurrentView('positions');
  };

  //------------------------------------------------------------
  // Job Columns
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
    console.log('Selected Position:', position); // Debugging
    setSelectedPosition(position);
    setLoading(true);
    setError(null);

    try {
      const response = await getCandidates(position.positionId, '');
      console.log('GetCandidates Response:', response); // Debugging
      console.log('Type of response:', typeof response);
      console.log('Is Array:', Array.isArray(response));

      let positionCandidates = [];

      // Parse the response if it's a string
      if (typeof response === 'string') {
        try {
          positionCandidates = JSON.parse(response);
          console.log('Parsed Candidates:', positionCandidates); // Debugging
        } catch (parseError) {
          console.error('Error parsing candidates JSON:', parseError);
          throw new Error('Failed to parse candidates data.');
        }
      } else if (Array.isArray(response)) {
        positionCandidates = response;
      } else if (response && Array.isArray(response.data)) {
        positionCandidates = response.data;
      } else {
        throw new Error('Invalid data format for candidates.');
      }

      console.log('Fetched Candidates:', positionCandidates); // Debugging

      // Function to sanitize candidates and fetch their interviews
      const sanitizeCandidates = async (candidates) => {
        if (!Array.isArray(candidates)) return [];
        // For each candidate, fetch their scheduled interviews
        const sanitized = await Promise.all(
          candidates.map(async (candidate) => {
            let interviews = [];
            try {
              // Ensure correct property access
              const candidateId = candidate.id || candidate.candidateId;
              console.log('Fetching interviews for candidate ID:', candidateId); // Debugging

              if (!candidateId) {
                console.error('Candidate ID is undefined:', candidate);
                interviews = [];
              } else {
                interviews = await getScheduledInterviewsByCandidate(candidateId);
                console.log(`Fetched Interviews for Candidate ${candidateId}:`, interviews); // Debugging
              }
            } catch (error) {
              console.error(
                `Error fetching interviews for candidate ${
                  candidate.id || candidate.candidateId
                }:`,
                error
              );
              // Optionally, handle the error or set interviews to an empty array
              interviews = [];
            }
            return {
              ...candidate,
              id: candidate.id || candidate.candidateId, // Ensure unique id
              scheduledInterviews: Array.isArray(interviews) ? interviews : [],
            };
          })
        );
        return sanitized;
      };

      const sanitizedCandidates = await sanitizeCandidates(positionCandidates);
      console.log('Sanitized Candidates with Interviews:', sanitizedCandidates); // Debugging

      setCandidates(sanitizedCandidates);
      setCurrentView('candidateScreen');
    } catch (err) {
      console.error('Error loading candidates:', err);
      enqueueSnackbar('Failed to load candidates.', { variant: 'error' });
      setError('Failed to load candidates.');
    } finally {
      setLoading(false);
    }
  };

  //------------------------------------------------------------
  // Position Columns
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
            setCurrentView('jobs');
            setPositions([]);
            setSelectedJob(null);
            setSelectedCandidateIds([]);
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
            sx={{
              '& .MuiDataGrid-row:hover': { backgroundColor: '#f9f9f9' },
            }}
          />
        </Box>
      )}
    </Box>
  );

  //------------------------------------------------------------
  // Handle Schedule Interview Click
  //------------------------------------------------------------
  const handleScheduleInterviewClick = (candidate) => {
    console.log('Scheduling Interview for Candidate:', candidate); // Debugging
    setCandidateForInterview(candidate);
    setOpenScheduleModal(true);
  };

  //------------------------------------------------------------
  // Handle View Interviews Click
  //------------------------------------------------------------
  const handleViewInterviews = (candidate) => {
    console.log('Viewing Interviews for Candidate:', candidate); // Debugging
    console.log('Scheduled Interviews:', candidate.scheduledInterviews); // Debugging
    setSelectedInterview(candidate.scheduledInterviews);
    setSelectedInterviewCandidateId(candidate.id || candidate.candidateId);
    setOpenInterviewDetails(true);
  };

  //------------------------------------------------------------
  // Handle Cancel Interview
  //------------------------------------------------------------
  const handleCancelInterview = async (interviewRefId, candidateId) => {
    try {
      await cancelInterview(candidateId, interviewRefId);
      enqueueSnackbar('Interview cancelled successfully!', { variant: 'success' });

      // Refresh the candidate's interviews
      const updatedInterviews = await getScheduledInterviewsByCandidate(candidateId);
      setCandidates((prev) =>
        prev.map((cand) =>
          cand.id === candidateId
            ? { ...cand, scheduledInterviews: updatedInterviews }
            : cand
        )
      );

      // Also update the selectedInterview state if it's for the same candidate
      if (selectedInterviewCandidateId === candidateId) {
        setSelectedInterview(updatedInterviews);
      }

      // Optionally, close the modal after cancelling
      setOpenInterviewDetails(false);
    } catch (error) {
      console.error('Error cancelling interview:', error);
      enqueueSnackbar('Failed to cancel interview.', { variant: 'error' });
    }
  };

  //------------------------------------------------------------
  // Handle Update Interview Click
  //------------------------------------------------------------
  const handleUpdateInterview = async (interviewRefId, candidateId, newDateTime) => {
    try {
      await updateInterview(candidateId, interviewRefId, newDateTime);
      enqueueSnackbar('Interview updated successfully!', { variant: 'success' });

      // Refresh the candidate's interviews
      const updatedInterviews = await getScheduledInterviewsByCandidate(candidateId);
      setCandidates((prev) =>
        prev.map((cand) =>
          cand.id === candidateId
            ? { ...cand, scheduledInterviews: updatedInterviews }
            : cand
        )
      );

      // Also update the selectedInterview state if it's for the same candidate
      if (selectedInterviewCandidateId === candidateId) {
        setSelectedInterview(updatedInterviews);
      }
    } catch (error) {
      console.error('Error updating interview:', error);
      enqueueSnackbar('Failed to update interview.', { variant: 'error' });
    }
  };

  //------------------------------------------------------------
  // Candidate Columns
  //------------------------------------------------------------
  const candidateColumns = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'firstName', headerName: 'First Name', flex: 1 },
    { field: 'lastName', headerName: 'Last Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    {
      field: 'scheduledInterviews',
      headerName: 'Scheduled Interviews',
      width: 250,
      renderCell: (params) => {
        const interviews = params.value;
        const hasInterviews = Array.isArray(interviews) && interviews.length > 0;

        // Prepare tooltip content
        const tooltipContent = hasInterviews ? (
          interviews.map((interview) => (
            <Box key={interview.interviewRefId} sx={{ mb: 1 }}>
              <Typography variant="body2">
                <strong>Date & Time:</strong>{' '}
                {new Date(interview.scheduledDateTime).toLocaleString()}
              </Typography>
              <Typography variant="body2">
                <strong>Round:</strong> {interview.roundNumber}
              </Typography>
              <Typography variant="body2">
                <strong>Status:</strong>{' '}
                <Chip
                  label={interview.status}
                  color={
                    interview.status.toUpperCase() === 'CANCELLED'
                      ? 'error'
                      : interview.status.toUpperCase() === 'COMPLETED'
                      ? 'success'
                      : 'primary'
                  }
                  size="small"
                />
              </Typography>
              <Divider sx={{ my: 0.5 }} />
            </Box>
          ))
        ) : (
          'No Interviews Scheduled'
        );

        return (
          <Tooltip title={tooltipContent} arrow placement="top">
            <Chip
              label={hasInterviews ? interviews.length : '0'}
              color={hasInterviews ? 'primary' : 'default'}
              size="small"
            />
          </Tooltip>
        );
      },
      sortable: false,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 220,
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
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleViewInterviews(params.row)}
            sx={{ textTransform: 'none' }}
          >
            View Interviews
          </Button>
        </>
      ),
    },
  ];

  //------------------------------------------------------------
  // Handle Batch Schedule Interview Click
  //------------------------------------------------------------
  const handleBatchScheduleClick = () => {
    console.log('Batch Scheduling Interviews for Candidate IDs:', selectedCandidateIds); // Debugging
    setOpenBatchScheduleModal(true);
  };

  //------------------------------------------------------------
  // Render Candidates View
  //------------------------------------------------------------
  const renderCandidateScreen = () => (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <IconButton
          onClick={() => {
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
          console.log('Newly Added Candidates:', newlyAdded); // Debugging
          setOpenAddCandidate(false);
          if (newlyAdded && newlyAdded.length > 0) {
            const mappedNewCandidates = newlyAdded.map((candidate) => ({
              ...candidate,
              id: candidate.id || candidate.candidateId, // Ensure unique id
              scheduledInterviews: [],
            }));
            setCandidates((prev) => [...prev, ...mappedNewCandidates]);
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
        onInterviewScheduled={async (updatedInterview) => {
          console.log('Interview Scheduled:', updatedInterview); // Debugging
          // Fetch the latest interviews for the candidate
          try {
            const interviews = await getScheduledInterviewsByCandidate(candidateForInterview.id);
            setCandidates((prev) =>
              prev.map((cand) =>
                cand.id === candidateForInterview.id
                  ? { ...cand, scheduledInterviews: interviews }
                  : cand
              )
            );
            enqueueSnackbar('Interview scheduled successfully!', { variant: 'success' });
          } catch (error) {
            console.error('Error fetching updated interviews:', error);
            enqueueSnackbar('Failed to update scheduled interviews.', { variant: 'error' });
          }
        }}
      />

      {/* Batch Schedule Interview Modal */}
      <BatchScheduleInterviewModal
        open={openBatchScheduleModal}
        onClose={() => setOpenBatchScheduleModal(false)}
        candidateIds={selectedCandidateIds}
        onBatchInterviewScheduled={async (updatedCandidates) => {
          console.log('Batch Interviews Scheduled for Candidates:', updatedCandidates); // Debugging
          // Update the candidate list with updated interviews
          try {
            const updatedInterviewPromises = updatedCandidates.map((candidateId) =>
              getScheduledInterviewsByCandidate(candidateId)
            );
            const allUpdatedInterviews = await Promise.all(updatedInterviewPromises);

            setCandidates((prev) =>
              prev.map((cand) => {
                const index = updatedCandidates.indexOf(cand.id);
                if (index !== -1) {
                  return { ...cand, scheduledInterviews: allUpdatedInterviews[index] };
                }
                return cand;
              })
            );

            setSelectedCandidateIds([]);
            enqueueSnackbar('Interviews scheduled successfully!', { variant: 'success' });
          } catch (error) {
            console.error('Error fetching updated interviews:', error);
            enqueueSnackbar('Failed to update scheduled interviews.', { variant: 'error' });
          }
        }}
      />

      {/* Interview Details Modal */}
      <InterviewDetailsModal
        open={openInterviewDetails}
        onClose={() => setOpenInterviewDetails(false)}
        interviews={selectedInterview}
        candidateId={selectedInterviewCandidateId} // Pass candidateId
        onCancelInterview={handleCancelInterview} // Pass the cancel function
        onUpdateInterview={handleUpdateInterview} // Pass the update function
      />
    </Box>
  );

  //------------------------------------------------------------
  // Render
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