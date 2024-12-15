// src/components/roles/InterviewerPanel.jsx
import React from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  TextField,
  Divider,
  Rating,
  Tooltip,
} from '@mui/material';
import PropTypes from 'prop-types';
import PersonIcon from '@mui/icons-material/Person';
import StarIcon from '@mui/icons-material/Star';

const InterviewerPanel = ({ feedback, submitFeedback }) => {
  const [feedbackInputs, setFeedbackInputs] = React.useState({});
  const [ratings, setRatings] = React.useState({});

  const handleFeedbackChange = (id, value) => {
    setFeedbackInputs((prev) => ({ ...prev, [id]: value }));
  };

  const handleRatingChange = (id, value) => {
    setRatings((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (id) => {
    const currentFeedback = (feedbackInputs[id] || '').trim();
    const currentRating = ratings[id] || 0;
    if (currentFeedback !== '' || currentRating > 0) {
      const fullFeedback = `Rating: ${currentRating} star(s) - ${currentFeedback}`;
      submitFeedback(id, fullFeedback);
      setFeedbackInputs((prev) => ({ ...prev, [id]: '' }));
      setRatings((prev) => ({ ...prev, [id]: 0 }));
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        bgcolor: (theme) => theme.palette.background.paper,
        borderRadius: 2,
      }}
    >
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
        Interviewer Panel
      </Typography>
      <Typography variant="subtitle2" color="textSecondary" gutterBottom>
        Provide detailed feedback and a rating for each candidate’s interview performance.
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        {(feedback || []).map((fb) => (
          <Grid item xs={12} sm={6} md={4} key={fb.id}>
            <Paper
              sx={{
                p: 2,
                border: '1px solid #eee',
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: 4,
                  backgroundColor: '#fafafa',
                },
              }}
              elevation={1}
            >
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PersonIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {fb.candidate}
                  </Typography>
                </Box>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Interview Date: {fb.interviewDate}
                </Typography>

                <Tooltip title="Rate the candidate’s performance. 1 star = poor, 5 stars = excellent.">
                  <Rating
                    name={`rating-${fb.id}`}
                    value={ratings[fb.id] || 0}
                    onChange={(event, newValue) => handleRatingChange(fb.id, newValue)}
                    precision={1}
                    icon={<StarIcon fontSize="inherit" />}
                    emptyIcon={<StarIcon fontSize="inherit" style={{ opacity: 0.3 }} />}
                    sx={{ mb: 2 }}
                  />
                </Tooltip>

                <TextField
                  label="Your Feedback"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={3}
                  value={feedbackInputs[fb.id] || ''}
                  onChange={(e) => handleFeedbackChange(fb.id, e.target.value)}
                  placeholder="e.g., Great communication, strong problem-solving skills, needs improvement in time management."
                />
              </Box>
              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleSubmit(fb.id)}
                  fullWidth
                  sx={{ fontWeight: 'bold' }}
                >
                  Submit Feedback
                </Button>
                {fb.feedback && (
                  <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary', fontStyle: 'italic' }}>
                    <strong>Previously Submitted:</strong> {fb.feedback}
                  </Typography>
                )}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {(feedback || []).length === 0 && (
        <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
          No interviews scheduled. Please check back later.
        </Typography>
      )}
    </Paper>
  );
};

InterviewerPanel.propTypes = {
  feedback: PropTypes.array,
  submitFeedback: PropTypes.func.isRequired,
};

InterviewerPanel.defaultProps = {
  feedback: [
    {
      id: '1',
      candidate: 'Alice Johnson',
      interviewDate: '2024-12-20',
      feedback: 'Rating: 4 star(s) - Strong analytical thinking and proactive problem-solving.'
    },
    {
      id: '2',
      candidate: 'Bob Williams',
      interviewDate: '2024-12-22',
      feedback: ''
    },
    {
      id: '3',
      candidate: 'Catherine Smith',
      interviewDate: '2024-12-25',
      feedback: 'Rating: 5 star(s) - Excellent communication and cultural fit.'
    },
  ],
};

export default InterviewerPanel;