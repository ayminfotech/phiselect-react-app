// src/components/AssignInterviewModal.jsx

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import { assignInterview } from '../services/candidateService';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const AssignInterviewModal = ({ open, handleClose, candidateId }) => {
  const [interviewData, setInterviewData] = useState({
    interviewDate: '',
    interviewTime: '',
    interviewerName: '',
    mode: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setInterviewData({
      ...interviewData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        interviewDate: `${interviewData.interviewDate}T${interviewData.interviewTime}:00`,
        interviewerName: interviewData.interviewerName,
        mode: interviewData.mode,
      };
      await assignInterview(candidateId, payload);
      handleClose(true); // Indicate success
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign interview');
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setInterviewData({
      interviewDate: '',
      interviewTime: '',
      interviewerName: '',
      mode: '',
    });
    setError(null);
    handleClose(false);
  };

  return (
    <Modal
      open={open}
      onClose={handleModalClose}
      aria-labelledby="assign-interview-modal-title"
      aria-describedby="assign-interview-modal-description"
    >
      <Box sx={modalStyle}>
        <Typography id="assign-interview-modal-title" variant="h6" component="h2" gutterBottom>
          Assign Interview
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Interview Date"
            type="date"
            name="interviewDate"
            value={interviewData.interviewDate}
            onChange={handleChange}
            fullWidth
            required
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Interview Time"
            type="time"
            name="interviewTime"
            value={interviewData.interviewTime}
            onChange={handleChange}
            fullWidth
            required
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 300, // 5 min
            }}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Interviewer Name"
            name="interviewerName"
            value={interviewData.interviewerName}
            onChange={handleChange}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Mode"
            name="mode"
            value={interviewData.mode}
            onChange={handleChange}
            select
            fullWidth
            required
            sx={{ mb: 2 }}
          >
            <MenuItem value="Online">Online</MenuItem>
            <MenuItem value="In-person">In-person</MenuItem>
            <MenuItem value="Phone">Phone</MenuItem>
          </TextField>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleModalClose} sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Assign'}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

AssignInterviewModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  candidateId: PropTypes.string.isRequired,
};

export default AssignInterviewModal;