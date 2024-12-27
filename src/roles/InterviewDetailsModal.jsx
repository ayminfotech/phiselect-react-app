// src/components/InterviewDetailsModal.jsx

import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  Divider,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useSnackbar } from 'notistack'; // Import useSnackbar

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  maxHeight: '80vh',
  overflowY: 'auto',
};

const InterviewDetailsModal = ({
  open,
  onClose,
  interviews,
  candidateId,
  onCancelInterview,
  onUpdateInterview,
}) => {
  const { enqueueSnackbar } = useSnackbar(); // Initialize enqueueSnackbar
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedInterviewToCancel, setSelectedInterviewToCancel] = useState(null);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [selectedInterviewToUpdate, setSelectedInterviewToUpdate] = useState(null);
  const [newDateTime, setNewDateTime] = useState('');
  const [actionLoading, setActionLoading] = useState(false); // Loading state

  useEffect(() => {
    console.log('InterviewDetailsModal Open:', open);
    console.log('Interviews Received:', interviews);
  }, [open, interviews]);

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
          <Typography
            id="interview-details-title"
            variant="h6"
            component="h2"
            gutterBottom
          >
            Interview Details
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {interviews && interviews.length > 0 ? (
            interviews.map((interview) => (
              <Accordion key={interview.interviewRefId} sx={{ mb: 1 }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`${interview.interviewRefId}-content`}
                  id={`${interview.interviewRefId}-header`}
                >
                  <Typography>
                    {new Date(interview.scheduledDateTime).toLocaleString()} - Round{' '}
                    {interview.roundNumber}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="body2">
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
                    {interview.rating && (
                      <Grid item xs={12}>
                        <Typography variant="body2">
                          <strong>Rating:</strong> {interview.rating}
                        </Typography>
                      </Grid>
                    )}
                    {/* Action Buttons */}
                    {interview.status?.toUpperCase() !== 'CANCELLED' && (
                      <>
                        {console.log(`Rendering buttons for interviewRefId: ${interview.interviewRefId}`)}
                        <Grid item xs={12} sx={{ display: 'flex', gap: 2 }}>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => handleOpenConfirm(interview)}
                            sx={{ textTransform: 'none' }}
                            disabled={actionLoading}
                          >
                            {actionLoading && selectedInterviewToCancel?.interviewRefId === interview.interviewRefId
                              ? 'Cancelling...'
                              : 'Cancel Interview'}
                          </Button>
                          <Button
                            variant="contained"
                            color="secondary"
                            size="small"
                            onClick={() => handleOpenUpdate(interview)}
                            sx={{ textTransform: 'none' }}
                            disabled={actionLoading}
                          >
                            Update Interview
                          </Button>
                        </Grid>
                      </>
                    )}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            ))
          ) : (
            <Typography variant="body2">No interviews scheduled.</Typography>
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
            Are you sure you want to cancel this interview?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm} disabled={actionLoading}>
            No
          </Button>
          <Button
            onClick={handleConfirmCancel}
            color="error"
            autoFocus
            disabled={actionLoading}
          >
            {actionLoading ? 'Cancelling...' : 'Yes, Cancel'}
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
          <Button onClick={handleCloseUpdate} disabled={actionLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmUpdate}
            variant="contained"
            color="primary"
            disabled={actionLoading || !newDateTime}
          >
            {actionLoading ? 'Updating...' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default InterviewDetailsModal;