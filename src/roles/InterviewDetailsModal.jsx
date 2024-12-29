// src/components/InterviewDetailsModal.jsx

import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  Divider,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 800,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  maxHeight: '85vh',
  overflowY: 'auto',
};

const InterviewDetailsModal = ({
  open,
  onClose,
  interviews,
  candidateId,
  onCancelInterview,
  onUpdateInterview,
  userRole, // Added prop to determine user role
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedInterviewToCancel, setSelectedInterviewToCancel] = useState(null);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [selectedInterviewToUpdate, setSelectedInterviewToUpdate] = useState(null);
  const [newDateTime, setNewDateTime] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    console.log('InterviewDetailsModal Open:', open);
    console.log('Interviews Received:', interviews);
  }, [open, interviews]);

  // Function to format date and time
  const formatDateTime = (dateTime) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateTime).toLocaleString(undefined, options);
  };

  // Handle opening confirmation dialog for cancellation
  const handleOpenConfirm = (interview) => {
    setSelectedInterviewToCancel(interview);
    setOpenConfirm(true);
  };

  // Handle closing confirmation dialog
  const handleCloseConfirm = () => {
    setOpenConfirm(false);
    setSelectedInterviewToCancel(null);
  };

  // Handle confirming cancellation
  const handleConfirmCancel = async () => {
    if (selectedInterviewToCancel) {
      setActionLoading(true);
      try {
        await onCancelInterview(selectedInterviewToCancel.interviewRefId, candidateId);
        enqueueSnackbar('Interview cancelled successfully!', { variant: 'success' });
      } catch (error) {
        enqueueSnackbar('Failed to cancel interview.', { variant: 'error' });
      }
      setActionLoading(false);
      handleCloseConfirm();
    }
  };

  // Handle opening update dialog
  const handleOpenUpdate = (interview) => {
    setSelectedInterviewToUpdate(interview);
    setNewDateTime(
      new Date(interview.scheduledDateTime).toISOString().slice(0, 16)
    ); // Format for datetime-local input
    setOpenUpdateDialog(true);
  };

  // Handle closing update dialog
  const handleCloseUpdate = () => {
    setOpenUpdateDialog(false);
    setSelectedInterviewToUpdate(null);
    setNewDateTime('');
  };

  // Handle confirming update
  const handleConfirmUpdate = async () => {
    if (selectedInterviewToUpdate && newDateTime) {
      setActionLoading(true);
      try {
        await onUpdateInterview(
          selectedInterviewToUpdate.interviewRefId,
          candidateId,
          newDateTime
        );
        enqueueSnackbar('Interview updated successfully!', { variant: 'success' });
      } catch (error) {
        enqueueSnackbar('Failed to update interview.', { variant: 'error' });
      }
      setActionLoading(false);
      handleCloseUpdate();
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="interview-details-title"
        aria-describedby="interview-details-description"
      >
        <Box sx={style}>
          {/* Header Section */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography id="interview-details-title" variant="h6" component="h2">
              Interview Details
            </Typography>
            <Button onClick={onClose} variant="outlined" startIcon={<ExpandMoreIcon />}>
              Close
            </Button>
          </Box>
          <Divider sx={{ mb: 2 }} />

          {/* Interviews List */}
          {interviews && interviews.length > 0 ? (
            interviews.map((interview) => (
              <Card
                key={interview.interviewRefId}
                sx={{
                  mb: 2,
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'scale(1.02)', boxShadow: 6 },
                }}
              >
                <CardContent>
                  <Grid container spacing={2}>
                    {/* Interview Header */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1">
                        <strong>Date & Time:</strong> {formatDateTime(interview.scheduledDateTime)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1">
                        <strong>Round:</strong> {interview.roundNumber}
                      </Typography>
                    </Grid>

                    {/* Interviewer Details */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1">
                        <strong>Interviewer:</strong> {interview.interviewerName || 'N/A'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1">
                        <strong>Status:</strong>{' '}
                        <Chip
                          label={interview.status}
                          color={
                            interview.status.toUpperCase() === 'CANCELLED'
                              ? 'error'
                              : interview.status.toUpperCase() === 'COMPLETED'
                              ? 'success'
                              : 'primary'
                          }
                          size="small"
                        />
                      </Typography>
                    </Grid>

                    {/* Additional Details */}
                    {interview.feedback && (
                      <Grid item xs={12}>
                        <Typography variant="body2">
                          <strong>Feedback:</strong> {interview.feedback}
                        </Typography>
                      </Grid>
                    )}
                    {interview.notes && (
                      <Grid item xs={12}>
                        <Typography variant="body2">
                          <strong>Notes:</strong> {interview.notes}
                        </Typography>
                      </Grid>
                    )}
                    {interview.selectionStatus && (
                      <Grid item xs={12}>
                        <Typography variant="body2">
                          <strong>Selection Status:</strong> {interview.selectionStatus}
                        </Typography>
                      </Grid>
                    )}
                    {interview.rating !== undefined && (
                      <Grid item xs={12}>
                        <Typography variant="body2">
                          <strong>Rating:</strong> {interview.rating}
                        </Typography>
                      </Grid>
                    )}

                    {/* Action Buttons */}
                    {(userRole === 'recruiter' || userRole === 'admin') &&
                      interview.status.toUpperCase() !== 'CANCELLED' && (
                        <Grid item xs={12} sx={{ mt: 2 }}>
                          <Tooltip title="Cancel this interview">
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              onClick={() => handleOpenConfirm(interview)}
                              sx={{ mr: 2, textTransform: 'none' }}
                              disabled={actionLoading}
                              startIcon={<DeleteIcon />}
                            >
                              {actionLoading && selectedInterviewToCancel?.interviewRefId === interview.interviewRefId
                                ? 'Cancelling...'
                                : 'Cancel Interview'}
                            </Button>
                          </Tooltip>
                          <Tooltip title="Update the interview schedule">
                            <Button
                              variant="contained"
                              color="secondary"
                              size="small"
                              onClick={() => handleOpenUpdate(interview)}
                              sx={{ textTransform: 'none' }}
                              disabled={actionLoading}
                              startIcon={<EditIcon />}
                            >
                              {actionLoading && selectedInterviewToUpdate?.interviewRefId === interview.interviewRefId
                                ? 'Updating...'
                                : 'Update Interview'}
                            </Button>
                          </Tooltip>
                        </Grid>
                      )}
                  </Grid>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography variant="body1">No interviews scheduled.</Typography>
          )}
        </Box>
      </Modal>

      {/* Confirmation Dialog for Cancellation */}
      <Dialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        aria-labelledby="confirm-cancel-title"
        aria-describedby="confirm-cancel-description"
      >
        <DialogTitle id="confirm-cancel-title">Confirm Cancellation</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-cancel-description">
            Are you sure you want to cancel this interview? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm} disabled={actionLoading} sx={{ textTransform: 'none' }}>
            No
          </Button>
          <Button
            onClick={handleConfirmCancel}
            color="error"
            variant="contained"
            disabled={actionLoading}
            sx={{ textTransform: 'none' }}
          >
            {actionLoading ? <CircularProgress size={24} color="inherit" /> : 'Yes, Cancel'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Interview Dialog */}
      <Dialog
        open={openUpdateDialog}
        onClose={handleCloseUpdate}
        aria-labelledby="update-interview-title"
        aria-describedby="update-interview-description"
      >
        <DialogTitle id="update-interview-title">Update Interview</DialogTitle>
        <DialogContent>
          <DialogContentText id="update-interview-description">
            Please select a new date and time for the interview.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="newDateTime"
            label="New Date & Time"
            type="datetime-local"
            fullWidth
            variant="outlined"
            value={newDateTime}
            onChange={(e) => setNewDateTime(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            disabled={actionLoading}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdate} disabled={actionLoading} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmUpdate}
            variant="contained"
            color="primary"
            disabled={actionLoading || !newDateTime}
            sx={{ textTransform: 'none' }}
          >
            {actionLoading ? <CircularProgress size={24} color="inherit" /> : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// PropTypes for type checking
InterviewDetailsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  interviews: PropTypes.arrayOf(
    PropTypes.shape({
      interviewRefId: PropTypes.string.isRequired,
      scheduledDateTime: PropTypes.string.isRequired,
      roundNumber: PropTypes.string.isRequired,
      interviewerName: PropTypes.string,
      status: PropTypes.string.isRequired,
      feedback: PropTypes.string,
      notes: PropTypes.string,
      selectionStatus: PropTypes.string,
      rating: PropTypes.number,
    })
  ).isRequired,
  candidateId: PropTypes.string.isRequired,
  onCancelInterview: PropTypes.func.isRequired,
  onUpdateInterview: PropTypes.func.isRequired,
  userRole: PropTypes.string.isRequired, // Added to handle role-based actions
};

export default InterviewDetailsModal;