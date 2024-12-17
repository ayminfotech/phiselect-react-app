// src/components/roles/AddCandidate.jsx

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Grid,
  IconButton,
} from '@mui/material';
import { addCandidates } from '../services/candidateService'; // Updated service function
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '95%',
  maxWidth: 800,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  maxHeight: '90vh',
  overflowY: 'auto',
};

const initialCandidate = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  currentCompany: '',
  previousCompanies: '',
  skillSet: '',
  panCardNumber: '',
  resumeFile: null,
};

const AddCandidate = ({ open, handleClose, jobId, positionId }) => {
  const [candidates, setCandidates] = useState([{ ...initialCandidate }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Handle input changes for each candidate
  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const updatedCandidates = [...candidates];
    updatedCandidates[index][name] = value;
    setCandidates(updatedCandidates);
  };

  // Handle file changes for each candidate
  const handleFileChange = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      const updatedCandidates = [...candidates];
      updatedCandidates[index].resumeFile = file;
      setCandidates(updatedCandidates);
    }
  };

  // Add a new candidate form
  const handleAddCandidate = () => {
    setCandidates([...candidates, { ...initialCandidate }]);
  };

  // Remove a candidate form
  const handleRemoveCandidate = (index) => {
    const updatedCandidates = [...candidates];
    updatedCandidates.splice(index, 1);
    setCandidates(updatedCandidates);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage('');

    // Basic client-side validation
    for (let i = 0; i < candidates.length; i++) {
      const { firstName, lastName, email, phoneNumber, resumeFile } = candidates[i];
      if (!firstName || !lastName || !email || !phoneNumber || !resumeFile) {
        setError(`Please fill in all required fields for Candidate ${i + 1}.`);
        setLoading(false);
        return;
      }
      // Additional validations (e.g., email format) can be added here
    }

    try {
      // Prepare payloads for all candidates
      const payload = candidates.map((candidate) => ({
        ...candidate,
        appliedJobIds: [jobId],
        jobRefIds: [],
        tenantId: '', // Assign appropriately
      }));

      // Call the batch add service
      const createdCandidates = await addCandidates(payload);
      setSuccessMessage(`${createdCandidates.length} candidate(s) added successfully!`);
      handleClose(createdCandidates);
      // Reset form
      setCandidates([{ ...initialCandidate }]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add candidates.');
    } finally {
      setLoading(false);
    }
  };

  // Handle modal close
  const handleModalClose = () => {
    setCandidates([{ ...initialCandidate }]);
    setError(null);
    setSuccessMessage('');
    handleClose(null);
  };

  return (
    <Modal
      open={open}
      onClose={handleModalClose}
      aria-labelledby="add-candidate-modal-title"
      aria-describedby="add-candidate-modal-description"
    >
      <Box sx={modalStyle}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography id="add-candidate-modal-title" variant="h6" component="h2">
            Add New Candidate(s)
          </Typography>
          <IconButton onClick={handleModalClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Success Alert */}
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {candidates.map((candidate, index) => (
            <Box key={index} sx={{ mb: 4, p: 2, border: '1px solid #eee', borderRadius: 2 }}>
              <Grid container spacing={2} alignItems="center">
                {/* First Name */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="First Name"
                    name="firstName"
                    value={candidate.firstName}
                    onChange={(e) => handleInputChange(index, e)}
                    fullWidth
                    required
                    variant="outlined"
                  />
                </Grid>

                {/* Last Name */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Last Name"
                    name="lastName"
                    value={candidate.lastName}
                    onChange={(e) => handleInputChange(index, e)}
                    fullWidth
                    required
                    variant="outlined"
                  />
                </Grid>

                {/* Email */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={candidate.email}
                    onChange={(e) => handleInputChange(index, e)}
                    fullWidth
                    required
                    variant="outlined"
                  />
                </Grid>

                {/* Phone Number */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Phone Number"
                    name="phoneNumber"
                    type="tel"
                    value={candidate.phoneNumber}
                    onChange={(e) => handleInputChange(index, e)}
                    fullWidth
                    required
                    variant="outlined"
                  />
                </Grid>

                {/* Current Company */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Current Company"
                    name="currentCompany"
                    value={candidate.currentCompany}
                    onChange={(e) => handleInputChange(index, e)}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>

                {/* Previous Companies */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Previous Companies"
                    name="previousCompanies"
                    value={candidate.previousCompanies}
                    onChange={(e) => handleInputChange(index, e)}
                    fullWidth
                    variant="outlined"
                    helperText="Separate multiple companies with commas"
                  />
                </Grid>

                {/* Skill Set */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Skill Set"
                    name="skillSet"
                    value={candidate.skillSet}
                    onChange={(e) => handleInputChange(index, e)}
                    fullWidth
                    variant="outlined"
                    helperText="e.g., Java, Spring Boot"
                  />
                </Grid>

                {/* PAN Card Number */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="PAN Card Number"
                    name="panCardNumber"
                    value={candidate.panCardNumber}
                    onChange={(e) => handleInputChange(index, e)}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>

                {/* Resume Upload */}
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    component="label"
                    startIcon={<CloudUploadIcon />}
                    fullWidth
                    sx={{ textTransform: 'none' }}
                  >
                    {candidate.resumeFile ? 'Change Resume' : 'Upload Resume'}
                    <input
                      type="file"
                      hidden
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileChange(index, e)}
                    />
                  </Button>
                  {candidate.resumeFile && (
                    <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ flexGrow: 1 }}>
                        {candidate.resumeFile.name}
                      </Typography>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => {
                          const updatedCandidates = [...candidates];
                          updatedCandidates[index].resumeFile = null;
                          setCandidates(updatedCandidates);
                        }}
                        aria-label="remove resume"
                      >
                        <RemoveCircleOutlineIcon />
                      </IconButton>
                    </Box>
                  )}
                </Grid>

                {/* Remove Candidate Button */}
                {candidates.length > 1 && (
                  <Grid item xs={12}>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<RemoveCircleOutlineIcon />}
                      onClick={() => handleRemoveCandidate(index)}
                      sx={{ textTransform: 'none' }}
                    >
                      Remove Candidate
                    </Button>
                  </Grid>
                )}
              </Grid>
            </Box>
          ))}

          {/* Add More Candidates Button */}
          <Button
            variant="outlined"
            startIcon={<AddCircleOutlineIcon />}
            onClick={handleAddCandidate}
            sx={{ mb: 2, textTransform: 'none' }}
          >
            Add Another Candidate
          </Button>

          {/* Submit Button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button onClick={handleModalClose} sx={{ mr: 2, textTransform: 'none' }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
              sx={{ textTransform: 'none' }}
            >
              {loading ? 'Adding...' : 'Add Candidates'}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  ); // End of return statement

}; // End of AddCandidate function

AddCandidate.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  jobId: PropTypes.string.isRequired,
  positionId: PropTypes.string.isRequired,
};

export default AddCandidate;