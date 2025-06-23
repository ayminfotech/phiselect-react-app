import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Alert,
  CircularProgress,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Tooltip,
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  Delete,
  AddCircleOutline,
  Visibility,
  Schedule,
} from '@mui/icons-material';
import AddCandidate from './AddCandidate';
import ScheduleInterviewModal from './ScheduleInterviewModal';
import commonStyles from '../../styles/commonStyles';

const PositionCard = ({ jobId, position, totalPositions }) => {
  const [openCandidates, setOpenCandidates] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [openAddCandidate, setOpenAddCandidate] = useState(false);
  const [openViewCandidates, setOpenViewCandidates] = useState(false);
  const [openScheduleInterview, setOpenScheduleInterview] = useState(false);

  const handleToggleCandidates = () => setOpenCandidates(!openCandidates);

  const handleAddCandidatesClose = (newCandidates) => {
    setOpenAddCandidate(false);
    if (newCandidates && newCandidates.length > 0) {
      setCandidates((prev) => [...prev, ...newCandidates]);
      setSuccessMessage(`${newCandidates.length} candidate(s) added successfully!`);
    }
  };

  const handleDeleteCandidate = (candidateId) => {
    setCandidates((prev) => prev.filter((candidate) => candidate.id !== candidateId));
    setSuccessMessage('Candidate removed successfully!');
  };

  const handleViewCandidatesClose = () => {
    setOpenViewCandidates(false);
  };

  const handleScheduleInterviewClose = () => {
    setOpenScheduleInterview(false);
  };

  return (
    <Box sx={{ ...commonStyles.card, p: 2, mb: 2 }}>
      {/* Position Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ width: '100%' }}>
        <Typography sx={{ ...commonStyles.header }}>
          {position.positionCode}
        </Typography>
        <IconButton onClick={handleToggleCandidates}>
          {openCandidates ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>
      <Typography sx={commonStyles.subtitle} mb={1}>
        Status: {position.status}
      </Typography>
      
      {/* Display Total Positions */}
      <Typography sx={{ fontSize: '14px', color: '#8e8e8e' }}>
        Total Positions: {totalPositions}
      </Typography>
      
      <Divider />

      {/* Success Message */}
      {successMessage && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {successMessage}
        </Alert>
      )}

      {/* Button Group for Add, View, Schedule */}
      <Grid container spacing={2} sx={{ mt: 2, textAlign: 'center' }}>
        <Grid item xs={12} sm={4}>
          <Tooltip title="Add Candidates">
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => setOpenAddCandidate(true)}
              startIcon={<AddCircleOutline />}
              sx={{ textTransform: 'none' }}
            >
              Add
            </Button>
          </Tooltip>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Tooltip title="View Candidates">
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              onClick={() => setOpenViewCandidates(true)}
              startIcon={<Visibility />}
              sx={{ textTransform: 'none' }}
            >
              View
            </Button>
          </Tooltip>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Tooltip title="Schedule Interview">
            <Button
              variant="contained"
              color="success"
              fullWidth
              onClick={() => setOpenScheduleInterview(true)}
              startIcon={<Schedule />}
              sx={{ textTransform: 'none' }}
            >
              Schedule
            </Button>
          </Tooltip>
        </Grid>
      </Grid>

      {/* Candidates Section (Collapse) */}
      <Collapse in={openCandidates} timeout="auto" unmountOnExit>
        <Box mt={2}>
          <Typography sx={commonStyles.sectionTitle}>Sourced Candidates</Typography>
          {loading ? (
            <CircularProgress size={24} sx={{ mt: 2 }} />
          ) : candidates.length > 0 ? (
            <List>
              {candidates.map((candidate) => (
                <ListItem key={candidate.id} divider>
                  <ListItemText
                    primary={candidate.firstName || candidate.name}
                    secondary={`Email: ${candidate.email}`}
                  />
                  <IconButton edge="end" color="error" onClick={() => handleDeleteCandidate(candidate.id)}>
                    <Delete />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography sx={commonStyles.subtitle}>No candidates sourced yet.</Typography>
          )}
        </Box>
      </Collapse>

      {/* Add Candidate Modal */}
      <AddCandidate
        open={openAddCandidate}
        handleClose={handleAddCandidatesClose}
        jobId={jobId}
        positionId={position.positionId}
      />

      {/* View Candidates Modal */}
      <Dialog open={openViewCandidates} onClose={handleViewCandidatesClose}>
        <DialogTitle>View Candidates</DialogTitle>
        <DialogContent>
          {candidates.length > 0 ? (
            <List>
              {candidates.map((candidate) => (
                <ListItem key={candidate.id}>
                  <ListItemText
                    primary={`${candidate.firstName} ${candidate.lastName}`}
                    secondary={`Email: ${candidate.email} | Phone: ${candidate.phoneNumber}`}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No candidates available for this position.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleViewCandidatesClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Schedule Interview Modal */}
      <ScheduleInterviewModal
        open={openScheduleInterview}
        onClose={handleScheduleInterviewClose}
        candidate={candidates[0]} // Pass full candidate object instead of just ID
        onInterviewScheduled={(data) => {
          setSuccessMessage('Interview scheduled successfully!');
          handleScheduleInterviewClose();
        }}// In real app you’d select which candidate
        positionId={position.positionId}
      />
    </Box>
  );
};

export default PositionCard;