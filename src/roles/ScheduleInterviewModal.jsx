import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import { assignInterview } from '../services/candidateService';
import { getUsersByTenantIdAndRoles } from '../services/UserService';
import { useSnackbar } from 'notistack';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const ScheduleInterviewModal = ({ open, onClose, candidate, onInterviewScheduled }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [interviewDateTime, setInterviewDateTime] = useState(null);
  const [interviewRound, setInterviewRound] = useState('ROUND_1');
  const [interviewerRefId, setInterviewerRefId] = useState('');
  const [interviewers, setInterviewers] = useState([]);
  const [loadingInterviewers, setLoadingInterviewers] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open) {
      setInterviewDateTime(null);
      setInterviewRound('ROUND_1');
      setInterviewerRefId('');
      setError(null);
      fetchInterviewers();
    }
  }, [open]);

  const fetchInterviewers = async () => {
    setLoadingInterviewers(true);
    try {
      const fetchedInterviewers = await getUsersByTenantIdAndRoles(['INTERVIEWER']);
      setInterviewers(fetchedInterviewers);
    } catch (error) {
      enqueueSnackbar('Failed to load interviewers.', { variant: 'error' });
      console.error(error);
      setError('Failed to load interviewers.');
    } finally {
      setLoadingInterviewers(false);
    }
  };

  const handleSubmit = async () => {
    if (!interviewDateTime || !interviewerRefId) {
      setError('Please select an interview date and an interviewer.');
      return;
    }

    const now = new Date();
    if (interviewDateTime <= now) {
      setError('Scheduled date and time must be in the future.');
      return;
    }

    // Handle appliedJobIds instead of appliedPositions
    if (!candidate.appliedJobIds || candidate.appliedJobIds.length === 0) {
      setError('Candidate has no applied job IDs.');
      return;
    }

    const firstAppliedJob = candidate.appliedJobIds[0];

    if (!firstAppliedJob?.positionId || !firstAppliedJob?.positionCode) {
      setError('Invalid job ID information for the candidate.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const selectedInterviewer = interviewers.find(
        (interviewer) => interviewer.userId === interviewerRefId
      );

      if (!selectedInterviewer) {
        setError('Selected interviewer not found.');
        return;
      }

      const interviewData = {
        candidateId: candidate.id,
        positionId: firstAppliedJob.positionId,
        positionCode: firstAppliedJob.positionCode,
        interviewerRefId,
        interviewerName: `${selectedInterviewer.firstName} ${selectedInterviewer.lastName}`,
        scheduledDateTime: interviewDateTime.toISOString(),
        roundNumber: interviewRound,
      };

      const scheduledInterview = await assignInterview(candidate.id, interviewData);
      enqueueSnackbar('Interview scheduled successfully!', { variant: 'success' });
      onInterviewScheduled(scheduledInterview);
      onClose();
    } catch (err) {
      console.error('Error scheduling interview:', err);
      setError(err.response?.data?.message || 'Failed to schedule interview.');
      enqueueSnackbar('Failed to schedule interview.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (!candidate) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          p: 4,
          backgroundColor: 'white',
          margin: 'auto',
          maxWidth: 500,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          borderRadius: 2,
          boxShadow: 24,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Schedule Interview for {candidate.firstName} {candidate.lastName}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            label="Interview Date & Time"
            value={interviewDateTime}
            onChange={(newValue) => setInterviewDateTime(newValue)}
            renderInput={(params) => <TextField {...params} fullWidth sx={{ mb: 2 }} />}
            disablePast
          />
        </LocalizationProvider>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="interviewer-label">Interviewer</InputLabel>
          <Select
            labelId="interviewer-label"
            label="Interviewer"
            value={interviewerRefId}
            onChange={(e) => setInterviewerRefId(e.target.value)}
            disabled={loadingInterviewers}
          >
            {loadingInterviewers ? (
              <MenuItem value="">
                <em>Loading...</em>
              </MenuItem>
            ) : interviewers.length > 0 ? (
              interviewers.map((interviewer) => (
                <MenuItem key={interviewer.userId} value={interviewer.userId}>
                  {interviewer.firstName} {interviewer.lastName} ({interviewer.email})
                </MenuItem>
              ))
            ) : (
              <MenuItem value="">
                <em>No interviewers available</em>
              </MenuItem>
            )}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="round-label">Interview Round</InputLabel>
          <Select
            labelId="round-label"
            label="Interview Round"
            value={interviewRound}
            onChange={(e) => setInterviewRound(e.target.value)}
          >
            <MenuItem value="ROUND_1">Round 1</MenuItem>
            <MenuItem value="ROUND_2">Round 2</MenuItem>
            <MenuItem value="ROUND_3">Round 3</MenuItem>
          </Select>
        </FormControl>

        <Box display="flex" justifyContent="flex-end">
          <Button onClick={onClose} sx={{ mr: 2 }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Schedule'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ScheduleInterviewModal;