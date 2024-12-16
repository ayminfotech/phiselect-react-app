// src/components/roles/AddCandidate.jsx

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { createCandidate } from '../services/candidateService'; // Implement this service
import { getInterviewers } from '../services/interviewerService'; // Implement this service

const AddCandidate = ({ open, handleClose, jobId, positionId }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    currentCompany: '',
    previousCompanies: '',
    skillSet: '',
    appliedJobIds: [jobId],
    jobRefIds: [], // You can populate this based on job data
    tenantId: '',
    panCardNumber: '',
    resume: null,
    interviewerId: '',
  });
  const [interviewers, setInterviewers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch interviewers when the dialog opens
  useEffect(() => {
    if (open) {
      fetchInterviewers();
    }
  }, [open]);

  const fetchInterviewers = async () => {
    try {
      const response = await getInterviewers();
      setInterviewers(response.data);
    } catch (err) {
      console.error('Failed to fetch interviewers:', err);
      setError('Failed to load interviewers');
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (file) => {
    setFormData((prev) => ({
      ...prev,
      resume: file,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phoneNumber', 'interviewerId', 'resume'];
    for (let field of requiredFields) {
      if (!formData[field]) {
        setError(`Please fill out the ${field} field.`);
        setLoading(false);
        return;
      }
    }

    // Prepare form data for multipart request
    const data = new FormData();
    data.append('firstName', formData.firstName);
    data.append('lastName', formData.lastName);
    data.append('email', formData.email);
    data.append('phoneNumber', formData.phoneNumber);
    data.append('currentCompany', formData.currentCompany);
    data.append('previousCompanies', formData.previousCompanies);
    data.append('skillSet', formData.skillSet);
    data.append('appliedJobIds', JSON.stringify(formData.appliedJobIds));
    data.append('jobRefIds', JSON.stringify(formData.jobRefIds));
    data.append('tenantId', formData.tenantId);
    data.append('panCardNumber', formData.panCardNumber);
    data.append('interviewerId', formData.interviewerId);
    data.append('resume', formData.resume);

    try {
      const response = await createCandidate(data);
      handleClose(response.data); // Pass the created candidate back to parent
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        currentCompany: '',
        previousCompanies: '',
        skillSet: '',
        appliedJobIds: [jobId],
        jobRefIds: [],
        tenantId: '',
        panCardNumber: '',
        resume: null,
        interviewerId: '',
      });
    } catch (err) {
      console.error('Failed to create candidate:', err);
      setError(err.response?.data?.message || 'Failed to create candidate');
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    setError(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      currentCompany: '',
      previousCompanies: '',
      skillSet: '',
      appliedJobIds: [jobId],
      jobRefIds: [],
      tenantId: '',
      panCardNumber: '',
      resume: null,
      interviewerId: '',
    });
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleDialogClose} maxWidth="md" fullWidth>
      <DialogTitle>Add New Candidate</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Grid container spacing={2}>
          {/* First Name */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="First Name"
              variant="outlined"
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              required
              fullWidth
            />
          </Grid>
          {/* Last Name */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Name"
              variant="outlined"
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              required
              fullWidth
            />
          </Grid>
          {/* Email */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              variant="outlined"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
              fullWidth
            />
          </Grid>
          {/* Phone Number */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Phone Number"
              variant="outlined"
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => handleChange('phoneNumber', e.target.value)}
              required
              fullWidth
            />
          </Grid>
          {/* Current Company */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Current Company"
              variant="outlined"
              value={formData.currentCompany}
              onChange={(e) => handleChange('currentCompany', e.target.value)}
              fullWidth
            />
          </Grid>
          {/* Previous Companies */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Previous Companies"
              variant="outlined"
              value={formData.previousCompanies}
              onChange={(e) => handleChange('previousCompanies', e.target.value)}
              fullWidth
            />
          </Grid>
          {/* Skill Set */}
          <Grid item xs={12}>
            <TextField
              label="Skill Set"
              variant="outlined"
              value={formData.skillSet}
              onChange={(e) => handleChange('skillSet', e.target.value)}
              fullWidth
            />
          </Grid>
          {/* Tenant ID */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Tenant ID"
              variant="outlined"
              value={formData.tenantId}
              onChange={(e) => handleChange('tenantId', e.target.value)}
              fullWidth
            />
          </Grid>
          {/* PAN Card Number */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="PAN Card Number"
              variant="outlined"
              value={formData.panCardNumber}
              onChange={(e) => handleChange('panCardNumber', e.target.value)}
              fullWidth
            />
          </Grid>
          {/* Assign Interviewer */}
          <Grid item xs={12} sm={6}>
            <FormControl variant="outlined" fullWidth required>
              <InputLabel id="interviewer-label">Assign Interviewer</InputLabel>
              <Select
                labelId="interviewer-label"
                label="Assign Interviewer"
                value={formData.interviewerId}
                onChange={(e) => handleChange('interviewerId', e.target.value)}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {interviewers.map((interviewer) => (
                  <MenuItem key={interviewer.id} value={interviewer.id}>
                    {interviewer.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {/* Resume Upload */}
          <Grid item xs={12} sm={6}>
            <Button variant="contained" component="label" fullWidth>
              Upload Resume
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                hidden
                onChange={(e) => {
                  if (e.target.files.length > 0) {
                    handleFileChange(e.target.files[0]);
                  }
                }}
                required
              />
            </Button>
            {formData.resume && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                {formData.resume.name}
              </Typography>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Add Candidate'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

AddCandidate.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  jobId: PropTypes.string.isRequired,
  positionId: PropTypes.string.isRequired,
};

export default AddCandidate;