// src/components/AddCandidate.jsx

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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText,
} from '@mui/material';
import { Formik, Form, FieldArray } from 'formik';
import * as Yup from 'yup';
import { addCandidates } from '../services/candidateService';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

/**
 * Styling for the modal using MUI's sx prop.
 * Centers the modal and ensures responsiveness.
 */
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '95%',
  maxWidth: 900,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  maxHeight: '90vh',
  overflowY: 'auto',
};

/**
 * Validation schema for each candidate using Yup.
 * Ensures all required fields are filled and formatted correctly.
 */
const CandidateSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phoneNumber: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits')
    .required('Phone number is required'),
  panCardNumber: Yup.string().required('PAN card number is required'),
  appliedPositions: Yup.array()
    .of(
      Yup.object().shape({
        positionId: Yup.string().required('Position ID is required'),
        positionCode: Yup.string().required('Position Code is required'),
      })
    )
    .min(1, 'At least one applied position is required'),
  resumeFile: Yup.mixed()
    .required('Resume is required')
    .test(
      'fileSize',
      'File size is too large (max 5MB)',
      (value) => value && value.size <= 5242880
    )
    .test(
      'fileFormat',
      'Unsupported Format (only PDF, DOC, DOCX)',
      (value) =>
        value &&
        ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(
          value.type
        )
    ),
});

/**
 * AddCandidate Component
 *
 * This component renders a modal form allowing recruiters to add multiple candidates
 * along with their applied positions and resume uploads.
 *
 * Props:
 * - open: Boolean indicating if the modal is open.
 * - handleClose: Function to handle closing the modal.
 * - jobId: String representing the Job ID.
 * - positions: Array of position objects available for application.
 */
const AddCandidate = ({ open, handleClose, jobId, positions }) => {
  // State variables to manage success and error messages.
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  /**
   * Initial form values.
   * Starts with one candidate by default.
   */
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
        recruiterRefId: 'RECRUITER_001', // Replace with actual recruiter ID from context/auth.
        appliedPositions: [
          {
            positionId: '',
            positionCode: '',
          },
        ],
        resumeFile: null,
      },
    ],
  };

  /**
   * Handles form submission.
   * Prepares the payload and calls the addCandidates service.
   * Displays appropriate success or error messages based on the response.
   *
   * @param {Object} values - Form values.
   * @param {Function} setSubmitting - Formik function to set submitting state.
   * @param {Function} resetForm - Formik function to reset the form.
   */
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Prepare the payload by mapping each candidate's data.
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
        appliedPositions: candidate.appliedPositions,
        // Resume files are handled separately in the service.
      }));

      // Call the batch add service, passing the candidates and state setters.
      const createdCandidates = await addCandidates(
        payload,
        values.candidates,
        setSuccessMessage,
        setErrorMessage
      );

      // If candidates are successfully created, display success message and reset the form.
      if (createdCandidates) {
        setSuccessMessage('Candidates added successfully!');
        setErrorMessage(null);
        handleClose(createdCandidates); // Pass the created candidates back to the parent component.
        resetForm(); // Reset the form fields.
      }
    } catch (err) {
      // Handle errors from the service.
      console.error('Error adding candidates:', err);
      setErrorMessage(err.message || 'Failed to add candidates.');
      setSuccessMessage(null);
    } finally {
      // End the submitting state.
      setSubmitting(false);
    }
  };

  /**
   * Handles closing the modal.
   * Resets the form and passes null to indicate no new candidates were added.
   */
  const handleModalClose = () => {
    handleClose(null); // Pass null to indicate no new candidates added.
  };

  return (
    <Modal
      open={open}
      onClose={handleModalClose}
      aria-labelledby="add-candidate-modal-title"
      aria-describedby="add-candidate-modal-description"
    >
      <Box sx={modalStyle}>
        {/* Header Section */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography id="add-candidate-modal-title" variant="h6" component="h2">
            Add New Candidate(s)
          </Typography>
          <IconButton onClick={handleModalClose} aria-label="close">
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
          {({
            values,
            errors,
            touched,
            handleChange,
            setFieldValue,
            isSubmitting,
          }) => (
            <Form>
              {/* FieldArray for managing multiple candidates */}
              <FieldArray name="candidates">
                {({ push, remove }) => (
                  <div>
                    {/* Iterate through each candidate */}
                    {values.candidates.map((candidate, index) => (
                      <Box
                        key={index}
                        sx={{
                          mb: 4,
                          p: 2,
                          border: '1px solid #eee',
                          borderRadius: 2,
                        }}
                      >
                        <Grid container spacing={2}>
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
                                Boolean(
                                  errors.candidates &&
                                    errors.candidates[index]?.firstName
                                )
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
                                Boolean(
                                  errors.candidates &&
                                    errors.candidates[index]?.lastName
                                )
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
                                Boolean(
                                  errors.candidates &&
                                    errors.candidates[index]?.email
                                )
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
                                Boolean(
                                  errors.candidates &&
                                    errors.candidates[index]?.phoneNumber
                                )
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
                                Boolean(
                                  errors.candidates &&
                                    errors.candidates[index]?.panCardNumber
                                )
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
                                  setFieldValue(
                                    `candidates[${index}].resumeFile`,
                                    event.currentTarget.files[0]
                                  );
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
                                  onClick={() =>
                                    setFieldValue(`candidates[${index}].resumeFile`, null)
                                  }
                                  aria-label="remove resume"
                                >
                                  <RemoveCircleOutlineIcon />
                                </IconButton>
                              </Box>
                            )}
                            {touched.candidates &&
                              touched.candidates[index] &&
                              touched.candidates[index].resumeFile &&
                              errors.candidates &&
                              errors.candidates[index]?.resumeFile && (
                                <FormHelperText error>
                                  {errors.candidates[index].resumeFile}
                                </FormHelperText>
                              )}
                          </Grid>

                          {/* Applied Positions Section */}
                          <FieldArray name={`candidates[${index}].appliedPositions`}>
                            {({ push: pushPosition, remove: removePosition }) => (
                              <Grid item xs={12}>
                                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                  Applied Position(s)
                                </Typography>
                                {candidate.appliedPositions.map((position, posIndex) => (
                                  <Box
                                    key={posIndex}
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      mb: 2,
                                      gap: 2,
                                    }}
                                  >
                                    {/* Position Code (Dropdown) */}
                                    <FormControl
                                      fullWidth
                                      variant="outlined"
                                      error={
                                        touched.candidates &&
                                        touched.candidates[index] &&
                                        touched.candidates[index].appliedPositions &&
                                        touched.candidates[index].appliedPositions[posIndex] &&
                                        touched.candidates[index].appliedPositions[posIndex].positionId &&
                                        Boolean(
                                          errors.candidates &&
                                            errors.candidates[index]?.appliedPositions &&
                                            errors.candidates[index].appliedPositions[posIndex]?.positionId
                                        )
                                      }
                                    >
                                      <InputLabel id={`positionCode-label-${index}-${posIndex}`}>
                                        Position Code
                                      </InputLabel>
                                      <Select
                                        labelId={`positionCode-label-${index}-${posIndex}`}
                                        label="Position Code"
                                        name={`candidates[${index}].appliedPositions[${posIndex}].positionId`}
                                        value={position.positionId}
                                        onChange={(e) => {
                                          const selectedPositionId = e.target.value;
                                          const selectedPosition = positions.find(
                                            (pos) => pos.positionId === selectedPositionId
                                          );
                                          setFieldValue(
                                            `candidates[${index}].appliedPositions[${posIndex}].positionId`,
                                            selectedPositionId
                                          );
                                          setFieldValue(
                                            `candidates[${index}].appliedPositions[${posIndex}].positionCode`,
                                            selectedPosition
                                              ? selectedPosition.positionCode
                                              : ''
                                          );
                                        }}
                                      >
                                        {positions.map((pos) => (
                                          <MenuItem key={pos.positionId} value={pos.positionId}>
                                            {pos.positionCode}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                      {touched.candidates &&
                                        touched.candidates[index] &&
                                        touched.candidates[index].appliedPositions &&
                                        touched.candidates[index].appliedPositions[posIndex] &&
                                        touched.candidates[index].appliedPositions[posIndex].positionId &&
                                        errors.candidates &&
                                        errors.candidates[index]?.appliedPositions &&
                                        errors.candidates[index].appliedPositions[posIndex]?.positionId && (
                                          <FormHelperText>
                                            {errors.candidates[index].appliedPositions[posIndex].positionId}
                                          </FormHelperText>
                                        )}
                                    </FormControl>

                                    {/* Position Code Display (Read-Only) */}
                                    <TextField
                                      label="Position Code"
                                      name={`candidates[${index}].appliedPositions[${posIndex}].positionCode`}
                                      value={position.positionCode}
                                      onChange={handleChange}
                                      fullWidth
                                      variant="outlined"
                                      InputProps={{
                                        readOnly: true,
                                      }}
                                    />

                                    {/* Remove Position Button */}
                                    {candidate.appliedPositions.length > 1 && (
                                      <IconButton
                                        color="error"
                                        onClick={() => removePosition(posIndex)}
                                        aria-label="remove position"
                                      >
                                        <RemoveCircleOutlineIcon />
                                      </IconButton>
                                    )}
                                  </Box>
                                ))}

                                {/* Add Position Button */}
                                <Button
                                  variant="outlined"
                                  startIcon={<AddCircleOutlineIcon />}
                                  onClick={() =>
                                    pushPosition({
                                      positionId: '',
                                      positionCode: '',
                                    })
                                  }
                                  sx={{ textTransform: 'none' }}
                                >
                                  Add Position
                                </Button>
                              </Grid>
                            )}
                          </FieldArray>

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
                          appliedPositions: [{ positionId: '', positionCode: '' }],
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
                <Button
                  type="button"
                  onClick={handleModalClose}
                  sx={{ mr: 2, textTransform: 'none' }}
                >
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

              {/* Submission Error (if any) */}
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

/**
 * PropTypes for the AddCandidate component.
 * Ensures that required props are passed and have correct types.
 */
AddCandidate.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  jobId: PropTypes.string.isRequired,
  positions: PropTypes.arrayOf(
    PropTypes.shape({
      positionId: PropTypes.string.isRequired,
      positionCode: PropTypes.string.isRequired,
      status: PropTypes.string,
      filledAt: PropTypes.string,
      recruiterRefId: PropTypes.string,
      candidateRefIds: PropTypes.array,
      createdAt: PropTypes.string,
      updatedAt: PropTypes.string,
    })
  ).isRequired,
};

export default AddCandidate;