import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Grid,
  IconButton,
  TextField,
} from '@mui/material';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';
import { addCandidates } from '../services/candidateService';
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

const CandidateSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phoneNumber: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits')
    .required('Phone number is required'),
  panCardNumber: Yup.string().required('PAN card number is required'),
  // Add other validations as needed
});

const AddCandidate = ({ open, handleClose, jobId, positionId }) => {
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null); // <-- Define the error state here
  const initialValues = {
    candidates: [
      {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        currentCompany: '',
        previousCompanies: '',
        skillSet: '',
        panCardNumber: '',
        recruiterRefId: 'RECRUITER_001', // Replace with actual recruiter ID
        appliedPositionIds: positionId, // Assuming single position
        resumeFile: null,
      },
    ],
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Prepare the payload from the form values
      const payload = values.candidates.map((candidate) => ({
        firstName: candidate.firstName,
        lastName: candidate.lastName,
        email: candidate.email,
        phoneNumber: candidate.phoneNumber,
        currentCompany: candidate.currentCompany,
        previousCompanies: candidate.previousCompanies,
        skillSet: candidate.skillSet,
        panCardNumber: candidate.panCardNumber,
        recruiterRefId: candidate.recruiterRefId,
        appliedPositionIds: candidate.appliedPositionIds,
      }));

      // Call the batch add service and pass success and error message setters
      const createdCandidates = await addCandidates(values.candidates, setSuccessMessage, setErrorMessage);

      // Check if the response is successful
      if (createdCandidates) {
        setSuccessMessage("Candidates added successfully!");
        setErrorMessage(null); // Reset any previous errors
        handleClose(createdCandidates); // Close the modal and pass data back to the parent
        resetForm(); // Reset the form after submission
      }
    } catch (err) {
      // Error handling
      console.error("Error adding candidates:", err);
      setErrorMessage(err.message || 'Failed to add candidates.');
      setSuccessMessage(null); // Reset any previous success messages
    } finally {
      setSubmitting(false);
    }
  };

  // Modal close handler
  const handleModalClose = () => {
    handleClose(null); // Close the modal and reset form
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
          <IconButton onClick={() => handleClose(null)} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Success Message */}
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}

        {/* Error Message */}
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}

        {/* Formik Form */}
        <Formik
          initialValues={initialValues}
          validationSchema={Yup.object({
            candidates: Yup.array().of(CandidateSchema),
          })}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, setFieldValue, isSubmitting }) => (
            <Form>
              <FieldArray name="candidates">
                {({ push, remove }) => (
                  <div>
                    {values.candidates.map((candidate, index) => (
                      <Box key={index} sx={{ mb: 4, p: 2, border: '1px solid #eee', borderRadius: 2 }}>
                        <Grid container spacing={2} alignItems="center">
                          {/* First Name */}
                          <Grid item xs={12} sm={6}>
                            <TextField
                              label="First Name"
                              name={`candidates[${index}].firstName`}
                              value={candidate.firstName}
                              onChange={handleChange}
                              fullWidth
                              required
                              variant="outlined"
                              error={
                                touched.candidates &&
                                touched.candidates[index] &&
                                touched.candidates[index].firstName &&
                                Boolean(errors.candidates && errors.candidates[index]?.firstName)
                              }
                              helperText={
                                touched.candidates &&
                                touched.candidates[index] &&
                                touched.candidates[index].firstName &&
                                errors.candidates &&
                                errors.candidates[index]?.firstName
                              }
                            />
                          </Grid>

                          {/* Last Name */}
                          <Grid item xs={12} sm={6}>
                            <TextField
                              label="Last Name"
                              name={`candidates[${index}].lastName`}
                              value={candidate.lastName}
                              onChange={handleChange}
                              fullWidth
                              required
                              variant="outlined"
                              error={
                                touched.candidates &&
                                touched.candidates[index] &&
                                touched.candidates[index].lastName &&
                                Boolean(errors.candidates && errors.candidates[index]?.lastName)
                              }
                              helperText={
                                touched.candidates &&
                                touched.candidates[index] &&
                                touched.candidates[index].lastName &&
                                errors.candidates &&
                                errors.candidates[index]?.lastName
                              }
                            />
                          </Grid>

                          {/* Email */}
                          <Grid item xs={12} sm={6}>
                            <TextField
                              label="Email"
                              name={`candidates[${index}].email`}
                              type="email"
                              value={candidate.email}
                              onChange={handleChange}
                              fullWidth
                              required
                              variant="outlined"
                              error={
                                touched.candidates &&
                                touched.candidates[index] &&
                                touched.candidates[index].email &&
                                Boolean(errors.candidates && errors.candidates[index]?.email)
                              }
                              helperText={
                                touched.candidates &&
                                touched.candidates[index] &&
                                touched.candidates[index].email &&
                                errors.candidates &&
                                errors.candidates[index]?.email
                              }
                            />
                          </Grid>

                          {/* Phone Number */}
                          <Grid item xs={12} sm={6}>
                            <TextField
                              label="Phone Number"
                              name={`candidates[${index}].phoneNumber`}
                              type="tel"
                              value={candidate.phoneNumber}
                              onChange={handleChange}
                              fullWidth
                              required
                              variant="outlined"
                              error={
                                touched.candidates &&
                                touched.candidates[index] &&
                                touched.candidates[index].phoneNumber &&
                                Boolean(errors.candidates && errors.candidates[index]?.phoneNumber)
                              }
                              helperText={
                                touched.candidates &&
                                touched.candidates[index] &&
                                touched.candidates[index].phoneNumber &&
                                errors.candidates &&
                                errors.candidates[index]?.phoneNumber
                              }
                            />
                          </Grid>

                          {/* Current Company */}
                          <Grid item xs={12} sm={6}>
                            <TextField
                              label="Current Company"
                              name={`candidates[${index}].currentCompany`}
                              value={candidate.currentCompany}
                              onChange={handleChange}
                              fullWidth
                              variant="outlined"
                            />
                          </Grid>

                          {/* Previous Companies */}
                          <Grid item xs={12} sm={6}>
                            <TextField
                              label="Previous Companies"
                              name={`candidates[${index}].previousCompanies`}
                              value={candidate.previousCompanies}
                              onChange={handleChange}
                              fullWidth
                              variant="outlined"
                              helperText="Separate multiple companies with commas"
                            />
                          </Grid>

                          {/* Skill Set */}
                          <Grid item xs={12} sm={6}>
                            <TextField
                              label="Skill Set"
                              name={`candidates[${index}].skillSet`}
                              value={candidate.skillSet}
                              onChange={handleChange}
                              fullWidth
                              variant="outlined"
                              helperText="e.g., Java, Spring Boot"
                            />
                          </Grid>

                          {/* PAN Card Number */}
                          <Grid item xs={12} sm={6}>
                            <TextField
                              label="PAN Card Number"
                              name={`candidates[${index}].panCardNumber`}
                              value={candidate.panCardNumber}
                              onChange={handleChange}
                              fullWidth
                              required
                              variant="outlined"
                              error={
                                touched.candidates &&
                                touched.candidates[index] &&
                                touched.candidates[index].panCardNumber &&
                                Boolean(errors.candidates && errors.candidates[index]?.panCardNumber)
                              }
                              helperText={
                                touched.candidates &&
                                touched.candidates[index] &&
                                touched.candidates[index].panCardNumber &&
                                errors.candidates &&
                                errors.candidates[index]?.panCardNumber
                              }
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
                                onChange={(event) => {
                                  setFieldValue(`candidates[${index}].resumeFile`, event.currentTarget.files[0]);
                                }}
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
                                  onClick={() => setFieldValue(`candidates[${index}].resumeFile`, null)}
                                  aria-label="remove resume"
                                >
                                  <RemoveCircleOutlineIcon />
                                </IconButton>
                              </Box>
                            )}
                          </Grid>

                          {/* Remove Candidate Button */}
                          {values.candidates.length > 1 && (
                            <Grid item xs={12}>
                              <Button
                                variant="outlined"
                                color="error"
                                startIcon={<RemoveCircleOutlineIcon />}
                                onClick={() => remove(index)}
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
                      onClick={() =>
                        push({
                          firstName: '',
                          lastName: '',
                          email: '',
                          phoneNumber: '',
                          currentCompany: '',
                          previousCompanies: '',
                          skillSet: '',
                          panCardNumber: '',
                          recruiterRefId: 'RECRUITER_001',
                          appliedPositionIds: positionId,
                          resumeFile: null,
                        })
                      }
                      sx={{ mb: 2, textTransform: 'none' }}
                    >
                      Add Another Candidate
                    </Button>
                  </div>
                )}
              </FieldArray>

              {/* Submit Button */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button type="button" onClick={handleModalClose} sx={{ mr: 2, textTransform: 'none' }}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  startIcon={isSubmitting && <CircularProgress size={20} />}
                  sx={{ textTransform: 'none' }}
                >
                  {isSubmitting ? 'Adding...' : 'Add Candidates'}
                </Button>
              </Box>

              {/* Submission Error */}
              {errors.submit && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {errors.submit}
                </Alert>
              )}
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
};

AddCandidate.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  jobId: PropTypes.string.isRequired,
  positionId: PropTypes.string.isRequired,
};

export default AddCandidate;