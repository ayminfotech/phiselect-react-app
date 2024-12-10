// src/components/roles/InterviewerPanel.jsx

import React from 'react';
import { Box, Typography, Button, Grid, Paper, TextField } from '@mui/material';
import PropTypes from 'prop-types';

const InterviewerPanel = ({ feedback, submitFeedback }) => {
  const [feedbackInputs, setFeedbackInputs] = React.useState({});

  const handleChange = (id, value) => {
    setFeedbackInputs((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = (id) => {
    if (feedbackInputs[id]) {
      submitFeedback(id, feedbackInputs[id]);
      setFeedbackInputs((prev) => ({
        ...prev,
        [id]: '',
      }));
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: 3 }}>
      <Typography variant="h5" gutterBottom>
        Interviewer Panel
      </Typography>

      {/* Feedback List */}
      <Grid container spacing={2}>
        {feedback.map((fb) => (
          <Grid item xs={12} sm={6} md={4} key={fb.id}>
            <Paper sx={{ padding: 2, border: '1px solid #ccc' }}>
              <Typography variant="subtitle1">{fb.candidate}</Typography>
              <Typography variant="body2">Interview Date: {fb.interviewDate}</Typography>
              <TextField
                label="Feedback"
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                value={feedbackInputs[fb.id] || ''}
                onChange={(e) => handleChange(fb.id, e.target.value)}
                sx={{ marginTop: 2 }}
              />
              <Button
                variant="contained"
                color="primary"
                sx={{ marginTop: 1 }}
                onClick={() => handleSubmit(fb.id)}
              >
                Submit Feedback
              </Button>
              {fb.feedback && (
                <Typography variant="body2" sx={{ marginTop: 1 }}>
                  <strong>Submitted Feedback:</strong> {fb.feedback}
                </Typography>
              )}
            </Paper>
          </Grid>
        ))}
        {feedback.length === 0 && (
          <Typography variant="body1" sx={{ marginTop: 2 }}>
            No interviews scheduled.
          </Typography>
        )}
      </Grid>
    </Paper>
  );
};

InterviewerPanel.propTypes = {
  feedback: PropTypes.array.isRequired,
  submitFeedback: PropTypes.func.isRequired,
};

export default InterviewerPanel;