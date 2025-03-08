// src/components/InterviewDetailPanel.jsx

import React from 'react';
import {
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  Button,
} from '@mui/material';

const InterviewDetailPanel = ({ row, onViewDetails }) => {
  const { scheduledInterviews } = row;

  if (!scheduledInterviews || scheduledInterviews.length === 0) {
    return (
      <Box p={2}>
        <Typography variant="body1">No interviews scheduled for this candidate.</Typography>
      </Box>
    );
  }

  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>
        Scheduled Interviews
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <List>
        {scheduledInterviews.map((interview) => (
          <ListItem
            key={interview.interviewRefId}
            alignItems="flex-start"
            secondaryAction={
              <Button
                variant="outlined"
                size="small"
                onClick={() => onViewDetails(interview)}
                sx={{ textTransform: 'none' }}
              >
                View Details
              </Button>
            }
          >
            <ListItemText
              primary={`Interview Ref ID: ${interview.interviewRefId}`}
              secondary={
                <>
                  <Typography component="span" variant="body2" color="text.primary">
                    Interviewer ID: {interview.interviewerRefId}
                  </Typography>
                  <br />
                  Position ID: {interview.positionId}
                  <br />
                  Scheduled Date & Time: {new Date(interview.scheduledDateTime).toLocaleString()}
                  <br />
                  Round: {interview.roundNumber}
                  <br />
                  Status: <Chip label={interview.status} color="primary" size="small" />
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default InterviewDetailPanel;