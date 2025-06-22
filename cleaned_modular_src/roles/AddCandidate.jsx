// Corrected AddCandidate.jsx with resume upload validation and submission

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

const AddCandidate = ({ open, handleClose, jobId, positions }) => {
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

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
        recruiterRefId: 'RECRUITER_001',
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

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const createdCandidates = await addCandidates(
        values.candidates,
        setSuccessMessage,
        setErrorMessage
      );

      if (createdCandidates) {
        setSuccessMessage('Candidates added successfully!');
        setErrorMessage(null);
        handleClose(createdCandidates);
        resetForm();
      }
    } catch (err) {
      console.error('Error adding candidates:', err);
      setErrorMessage(err.message || 'Failed to add candidates.');
      setSuccessMessage(null);
    } finally {
      setSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setSuccessMessage(null);
    setErrorMessage(null);
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleModalClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6">Add New Candidate(s)</Typography>
        {successMessage && <Alert severity="success">{successMessage}</Alert>}
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

        <Formik
          initialValues={initialValues}
          validationSchema={Yup.object({ candidates: Yup.array().of(CandidateSchema) })}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, setFieldValue, isSubmitting }) => (
            <Form>
              <FieldArray name="candidates">
                {({ push, remove }) => (
                  <div>
                    {values.candidates.map((candidate, index) => (
                      <Box key={index} sx={{ border: '1px solid #ddd', p: 2, mb: 2, borderRadius: 2 }}>
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
                              error={Boolean(touched?.candidates?.[index]?.firstName && errors?.candidates?.[index]?.firstName)}
                              helperText={touched?.candidates?.[index]?.firstName && errors?.candidates?.[index]?.firstName}
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
                              error={Boolean(touched?.candidates?.[index]?.lastName && errors?.candidates?.[index]?.lastName)}
                              helperText={touched?.candidates?.[index]?.lastName && errors?.candidates?.[index]?.lastName}
                            />
                          </Grid>

                          {/* Resume Upload */}
                          <Grid item xs={12}>
                            <Button
                              variant="contained"
                              component="label"
                              startIcon={<CloudUploadIcon />}
                              fullWidth
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
                              <Typography variant="body2" mt={1}>
                                {candidate.resumeFile.name}
                              </Typography>
                            )}
                            {touched?.candidates?.[index]?.resumeFile && errors?.candidates?.[index]?.resumeFile && (
                              <FormHelperText error>{errors.candidates[index].resumeFile}</FormHelperText>
                            )}
                          </Grid>
                        </Grid>

                        {/* Remove Candidate Button */}
                        {values.candidates.length > 1 && (
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => remove(index)}
                            startIcon={<RemoveCircleOutlineIcon />}
                            sx={{ mt: 2 }}
                          >
                            Remove Candidate
                          </Button>
                        )}
                      </Box>
                    ))}

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
                    >
                      Add Another Candidate
                    </Button>
                  </div>
                )}
              </FieldArray>
              <Box mt={3} display="flex" justifyContent="flex-end">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  startIcon={isSubmitting && <CircularProgress size={20} />}
                >
                  {isSubmitting ? 'Adding...' : 'Add Candidates'}
                </Button>
              </Box>
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
  positions: PropTypes.arrayOf(
    PropTypes.shape({
      positionId: PropTypes.string.isRequired,
      positionCode: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default AddCandidate;