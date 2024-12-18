import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Alert,
} from '@mui/material';
import PropTypes from 'prop-types';
import { assignInterview } from '../services/candidateService'; // Make sure assignInterview is correctly imported

const ScheduleInterviewModal = ({ open, onClose, candidateId, positionId }) => {
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewRound, setInterviewRound] = useState('');
  const [interviewerRefId, setInterviewerRefId] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Handle Interview Schedule Submission
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const interviewData = {
        candidateId,
        positionId,
        scheduledDateTime: interviewDate,
        roundNumber: interviewRound,
        interviewerRefId, // Assuming interviewer is available
      };
      const result = await assignInterview(candidateId, interviewData);
      setSuccessMessage('Interview scheduled successfully!');
      setErrorMessage('');
      onClose(result); // Close modal on success
    } catch (error) {
      setErrorMessage('Error scheduling interview. Please try again.');
      setSuccessMessage('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Schedule Interview for Candidate</DialogTitle>
      <DialogContent>
        {successMessage && <Alert severity="success">{successMessage}</Alert>}
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        
        {/* Interview Date */}
        <TextField
          label="Interview Date & Time"
          type="datetime-local"
          fullWidth
          variant="outlined"
          margin="normal"
          value={interviewDate}
          onChange={(e) => setInterviewDate(e.target.value)}
          required
          InputLabelProps={{
            shrink: true,
          }}
        />

        {/* Interview Round */}
        <TextField
          label="Interview Round"
          fullWidth
          variant="outlined"
          margin="normal"
          value={interviewRound}
          onChange={(e) => setInterviewRound(e.target.value)}
          required
        />

        {/* Interviewer ID */}
        <TextField
          label="Interviewer ID"
          fullWidth
          variant="outlined"
          margin="normal"
          value={interviewerRefId}
          onChange={(e) => setInterviewerRefId(e.target.value)}
          required
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          startIcon={loading && <CircularProgress size={20} />}
          disabled={loading}
        >
          {loading ? 'Scheduling...' : 'Schedule Interview'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ScheduleInterviewModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  candidateId: PropTypes.string.isRequired,
  positionId: PropTypes.string.isRequired,
};

export default ScheduleInterviewModal;