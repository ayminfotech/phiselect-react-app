// src/components/BatchScheduleInterviewModal.js
import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, CircularProgress, Alert, MenuItem } from '@mui/material';
import { assignMultipleCandidatesToInterviewer } from '../services/candidateService';
import { useSnackbar } from 'notistack';

const BatchScheduleInterviewModal = ({ open, onClose, candidateIds, onBatchInterviewScheduled }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [interviewDateTime, setInterviewDateTime] = useState('');
  const [interviewRound, setInterviewRound] = useState('ROUND_1'); // Default round
  const [interviewerRefId, setInterviewerRefId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [positionId, setPositionId] = useState(''); // Assuming all candidates are for the same position

  // Reset state when the modal opens or closes
  useEffect(() => {
    if (open) {
      setInterviewDateTime('');
      setInterviewRound('ROUND_1');
      setInterviewerRefId('');
      setPositionId('');
      setError(null);
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!interviewDateTime || !interviewerRefId || !positionId) {
      setError('Please select an interview date, position, and enter the interviewer reference ID.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const assignmentData = {
        positionId,
        interviewerRefId,
        scheduledDateTime: new Date(interviewDateTime).toISOString(),
        roundNumber: interviewRound,
        candidateIds, // Array of UUIDs
      };
      const updatedCandidates = await assignMultipleCandidatesToInterviewer(assignmentData);
      enqueueSnackbar('Batch interviews scheduled successfully!', { variant: 'success' });
      onBatchInterviewScheduled(updatedCandidates);
      onClose();
    } catch (err) {
      console.error('Error scheduling batch interviews:', err);
      setError(err.message || 'Failed to schedule batch interviews.');
      enqueueSnackbar('Failed to schedule batch interviews.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (candidateIds.length === 0) {
    return null;
  }

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
          Batch Schedule Interviews
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Position ID Selection */}
        <TextField
          label="Position ID"
          type="text"
          fullWidth
          value={positionId}
          onChange={(e) => setPositionId(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          label="Interview Date & Time"
          type="datetime-local"
          fullWidth
          value={interviewDateTime}
          onChange={(e) => setInterviewDateTime(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          sx={{ mb: 2 }}
        />

        <TextField
          label="Interview Round"
          select
          fullWidth
          value={interviewRound}
          onChange={(e) => setInterviewRound(e.target.value)}
          sx={{ mb: 2 }}
        >
          <MenuItem value="ROUND_1">Round 1</MenuItem>
          <MenuItem value="ROUND_2">Round 2</MenuItem>
          <MenuItem value="ROUND_3">Round 3</MenuItem>
          {/* Add more rounds as needed */}
        </TextField>

        <TextField
          label="Interviewer Reference ID"
          type="text"
          fullWidth
          value={interviewerRefId}
          onChange={(e) => setInterviewerRefId(e.target.value)}
          sx={{ mb: 3 }}
        />

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

export default BatchScheduleInterviewModal;