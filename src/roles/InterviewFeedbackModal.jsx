import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  MenuItem,
  Rating,
} from '@mui/material';
import { provideInterviewFeedback } from '../services/interviewerService'; // Your actual service call

/**
 * interview: { interviewRefId, candidateId, ... }
 * onFeedbackSubmitted: callback to update the parent state after feedback is submitted
 */
const InterviewFeedbackModal = ({ open, onClose, interview, onFeedbackSubmitted }) => {
  const [feedback, setFeedback] = useState('');
  const [notes, setNotes] = useState('');
  const [selectionStatus, setSelectionStatus] = useState('PENDING'); // or 'SELECTED' / 'REJECTED'
  const [rating, setRating] = useState(0);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (!interview) return null;

  const handleSubmit = async () => {
    // Validate
    if (!feedback.trim()) {
      setError('Feedback is required.');
      return;
    }
    if (!rating) {
      setError('Please provide a rating.');
      return;
    }
    setError(null);
    setSubmitting(true);

    try {
      const payload = {
        feedback,
        rating,
        notes,
        selectionStatus,
      };
      // Provide feedback using your service
      const updatedInterview = await provideInterviewFeedback(interview.interviewerRefId, interview.interviewRefId, payload);
      onFeedbackSubmitted(updatedInterview);
      onClose();
    } catch (err) {
      console.error('Error providing feedback:', err);
      setError(err?.message || 'Failed to provide feedback.');
    } finally {
      setSubmitting(false);
    }
  };

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
          Provide Feedback for Interview: {interview.interviewRefId}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Feedback"
          multiline
          rows={3}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Additional Notes (Optional)"
          multiline
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          select
          fullWidth
          label="Selection Status"
          value={selectionStatus}
          onChange={(e) => setSelectionStatus(e.target.value)}
          sx={{ mb: 2 }}
        >
          <MenuItem value="PENDING">Pending</MenuItem>
          <MenuItem value="SELECTED">Selected</MenuItem>
          <MenuItem value="REJECTED">Rejected</MenuItem>
        </TextField>

        <Box sx={{ mb: 2 }}>
          <Typography sx={{ mb: 1 }}>Rating:</Typography>
          <Rating
            name="candidate-rating"
            value={rating}
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
          />
        </Box>

        <Box display="flex" justifyContent="flex-end" mt={3}>
          <Button onClick={onClose} variant="outlined" sx={{ mr: 2, textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={submitting}
            sx={{ textTransform: 'none' }}
          >
            {submitting ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default InterviewFeedbackModal;