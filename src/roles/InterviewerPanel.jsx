import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  TextField,
  Button,
  IconButton,
  Tooltip,
  Grid,
  Avatar,
  InputAdornment,
  CircularProgress,
  MenuItem,
  Chip,
  Alert,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { DataGrid } from '@mui/x-data-grid';
import { useSnackbar } from 'notistack';

// Services
import { getInterviewsByInterviewer, provideInterviewFeedback } from '../services/interviewerService';
import { InterviewStatus } from '../utils/constants'; // e.g., { SCHEDULED: 'SCHEDULED', COMPLETED: 'COMPLETED', CANCELLED: 'CANCELLED' }

// Child components/modals
import InterviewFeedbackModal from './InterviewFeedbackModal';

const InterviewerPanel = ({ interviewerRefId }) => {
  const { enqueueSnackbar } = useSnackbar();

  // Interview state
  const [interviews, setInterviews] = useState([]);
  const [filteredInterviews, setFilteredInterviews] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modal state
  const [openFeedbackModal, setOpenFeedbackModal] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);

  //------------------------------------------------------------
  // Fetch Interviews on Mount
  //------------------------------------------------------------
  useEffect(() => {
    const fetchAssignedInterviews = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getInterviewsByInterviewer(interviewerRefId);
        setInterviews(data);
        setFilteredInterviews(data);
      } catch (err) {
        console.error('Error fetching interviews:', err);
        enqueueSnackbar('Failed to fetch interviews.', { variant: 'error' });
        setError('Failed to fetch interviews.');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedInterviews();
  }, [interviewerRefId, enqueueSnackbar]);

  //------------------------------------------------------------
  // Filtering
  //------------------------------------------------------------
  useEffect(() => {
    if (!searchQuery) {
      setFilteredInterviews(interviews);
    } else {
      const q = searchQuery.toLowerCase();
      const filtered = interviews.filter(
        (iv) =>
          iv.candidateId.toLowerCase().includes(q) ||
          (iv.positionId && iv.positionId.toLowerCase().includes(q))
      );
      setFilteredInterviews(filtered);
    }
  }, [searchQuery, interviews]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  //------------------------------------------------------------
  // Handle Feedback Modal
  //------------------------------------------------------------
  const handleOpenFeedback = (interview) => {
    setSelectedInterview(interview);
    setOpenFeedbackModal(true);
  };

  const handleCloseFeedback = () => {
    setOpenFeedbackModal(false);
    setSelectedInterview(null);
  };

  //------------------------------------------------------------
  // On Feedback Submitted
  //------------------------------------------------------------
  const handleFeedbackSubmitted = (updatedInterview) => {
    // Update the interviews list
    setInterviews((prev) =>
      prev.map((iv) => (iv.interviewRefId === updatedInterview.interviewRefId ? updatedInterview : iv))
    );
    setFilteredInterviews((prev) =>
      prev.map((iv) => (iv.interviewRefId === updatedInterview.interviewRefId ? updatedInterview : iv))
    );
    enqueueSnackbar('Feedback submitted successfully!', { variant: 'success' });
  };

  //------------------------------------------------------------
  // Columns
  //------------------------------------------------------------
  const columns = [
    { field: 'interviewRefId', headerName: 'Interview ID', width: 220 },
    { field: 'candidateId', headerName: 'Candidate ID', width: 200 },
    { field: 'positionId', headerName: 'Position ID', width: 200 },
    {
      field: 'scheduledDateTime',
      headerName: 'Scheduled Date & Time',
      width: 220,
      valueFormatter: (params) => new Date(params.value).toLocaleString(),
    },
    { field: 'roundNumber', headerName: 'Round', width: 120 },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => getStatusChip(params.value),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params) => {
        const interview = params.row;
        return (
          <Button
            variant="outlined"
            size="small"
            disabled={interview.status !== InterviewStatus.SCHEDULED}
            onClick={() => handleOpenFeedback(interview)}
            sx={{ textTransform: 'none' }}
          >
            Provide Feedback
          </Button>
        );
      },
    },
  ];

  const getStatusChip = (status) => {
    switch (status) {
      case 'SCHEDULED':
        return <Chip label="Scheduled" color="primary" size="small" />;
      case 'COMPLETED':
        return <Chip label="Completed" color="success" size="small" />;
      case 'CANCELLED':
        return <Chip label="Cancelled" color="error" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  //------------------------------------------------------------
  // Render
  //------------------------------------------------------------
  return (
    <Paper elevation={3} sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
        Interviewer Panel
      </Typography>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 3 }}>
        Manage the interviews assigned to you and provide feedback.
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Search Box */}
      <Box sx={{ display: 'flex', mb: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search by Candidate ID or Position ID"
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" sx={{ mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : filteredInterviews.length === 0 ? (
        <Typography>No interviews found.</Typography>
      ) : (
        <Box sx={{ height: 500 }}>
          <DataGrid
            rows={filteredInterviews}
            columns={columns}
            getRowId={(row) => row.interviewRefId}
            pageSize={10}
            rowsPerPageOptions={[10, 20]}
            disableSelectionOnClick
            sx={{ '& .MuiDataGrid-row:hover': { backgroundColor: '#f9f9f9' } }}
          />
        </Box>
      )}

      {/* Feedback Modal */}
      <InterviewFeedbackModal
        open={openFeedbackModal}
        onClose={handleCloseFeedback}
        interview={selectedInterview}
        onFeedbackSubmitted={handleFeedbackSubmitted}
      />
    </Paper>
  );
};

export default InterviewerPanel;