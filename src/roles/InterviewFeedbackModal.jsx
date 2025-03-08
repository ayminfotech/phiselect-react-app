// src/components/InterviewFeedbackModal.jsx

import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  MenuItem,
  Rating,
  Grid,
} from '@mui/material';
import { provideInterviewFeedback } from '../services/interviewerService'; // Ensure this service is correctly implemented

/**
 * Props:
 * - open: Boolean indicating if the modal is open
 * - onClose: Function to close the modal
 * - interview: Object containing interview details (includes candidateName and positionName)
 * - onFeedbackSubmitted: Callback to update parent state after feedback is submitted
 */
const InterviewFeedbackModal = ({ open, onClose, interview, onFeedbackSubmitted }) => {
  const [feedback, setFeedback] = useState('');
  const [notes, setNotes] = useState('');
  const [selectionStatus, setSelectionStatus] = useState('PENDING'); // Options: 'PENDING', 'SELECTED', 'REJECTED'
  const [rating, setRating] = useState(0);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Reset form when modal is opened or closed
  useEffect(() => {
    if (open) {
      setFeedback('');
      setNotes('');
      setSelectionStatus('PENDING');
      setRating(0);
      setError(null);
    }
  }, [open]);

  if (!interview) return null;

  const handleSubmit = async () => {
    // Validate required fields
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
      const updatedInterview = await provideInterviewFeedback(
        interview.interviewerRefId,
        interview.interviewRefId,
        payload
      );
      onFeedbackSubmitted(updatedInterview);
      onClose();
    } catch (err) {
      console.error('Error providing feedback:', err);
      setError(err?.response?.data?.message || 'Failed to provide feedback.');
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
          maxWidth: 600,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          borderRadius: 2,
          boxShadow: 24,
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* Modal Header */}
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          Provide Feedback
        </Typography>

        {/* Candidate and Position Information */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
              Candidate Name:
            </Typography>
            <Typography variant="body1">{interview.candidateName}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
              Position Name:
            </Typography>
            <Typography variant="body1">{interview.positionName}</Typography>
          </Grid>
        </Grid>

        {/* Display Error if Any */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Feedback Form */}
        <TextField
          fullWidth
          label="Feedback"
          multiline
          rows={4}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          sx={{ mb: 2 }}
          variant="outlined"
          placeholder="Enter your feedback here..."
        />

        <TextField
          fullWidth
          label="Additional Notes (Optional)"
          multiline
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          sx={{ mb: 2 }}
          variant="outlined"
          placeholder="Enter any additional notes..."
        />

        <TextField
          select
          fullWidth
          label="Selection Status"
          value={selectionStatus}
          onChange={(e) => setSelectionStatus(e.target.value)}
          sx={{ mb: 2 }}
          variant="outlined"
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

        {/* Action Buttons */}
        <Box display="flex" justifyContent="flex-end" mt={3}>
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{ mr: 2, textTransform: 'none' }}
            disabled={submitting}
          >
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