// src/components/AssignMultipleInterviewerModal.jsx

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  IconButton,
  TextField,
  MenuItem,
  Checkbox,
  ListItemText,
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import CloseIcon from '@mui/icons-material/Close';
import {
  assignMultipleCandidatesToInterviewer,
  getAllInterviewers,
  getAllCandidates,
} from '../services/CandidateService'; // Ensure correct import path

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 700,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  maxHeight: '90vh',
  overflowY: 'auto',
};

const AssignMultipleInterviewerModal = ({ open, onClose, onAssignmentsUpdated }) => {
  const [interviewers, setInterviewers] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loadingInterviewers, setLoadingInterviewers] = useState(false);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [submissionError, setSubmissionError] = useState(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(null);

  useEffect(() => {
    if (open) {
      fetchInterviewers();
      fetchCandidates();
    }
  }, [open]);

  const fetchInterviewers = async () => {
    setLoadingInterviewers(true);
    setFetchError(null);
    try {
      const fetchedInterviewers = await getAllInterviewers();
      setInterviewers(fetchedInterviewers);
    } catch (error) {
      console.error('Error fetching interviewers:', error);
      setFetchError('Failed to load interviewers.');
    } finally {
      setLoadingInterviewers(false);
    }
  };

  const fetchCandidates = async () => {
    setLoadingCandidates(true);
    setFetchError(null);
    try {
      const fetchedCandidates = await getAllCandidates();
      setCandidates(fetchedCandidates);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      setFetchError('Failed to load candidates.');
    } finally {
      setLoadingCandidates(false);
    }
  };

  // Validation Schema using Yup
  const AssignmentSchema = Yup.object().shape({
    interviewerRefId: Yup.string().required('Interviewer is required'),
    candidateIds: Yup.array().of(Yup.string()).min(1, 'At least one candidate must be selected'),
  });

  const initialValues = {
    interviewerRefId: '',
    candidateIds: [],
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmissionError(null);
    setSubmissionSuccess(null);
    try {
      const { interviewerRefId, candidateIds } = values;
      const assignmentData = {
        interviewerRefId,
        candidateIds: candidateIds.map((id) => UUID.fromString(id)), // Adjust based on backend expectations
      };
      const response = await assignMultipleCandidatesToInterviewer(assignmentData);
      setSubmissionSuccess('Interviewer assigned to selected candidates successfully.');
      onAssignmentsUpdated?.(response);
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error assigning multiple candidates:', error);
      setSubmissionError(error.message || 'Failed to assign interviewer to candidates.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Assign Interviewer to Multiple Candidates</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Fetch Error */}
        {fetchError && <Alert severity="error" sx={{ mb: 2 }}>{fetchError}</Alert>}

        {/* Formik Form */}
        <Formik
          initialValues={initialValues}
          validationSchema={AssignmentSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            isSubmitting,
            setFieldValue,
          }) => (
            <Form>
              {/* Interviewer Selection */}
              <TextField
                select
                label="Select Interviewer"
                name="interviewerRefId"
                value={values.interviewerRefId}
                onChange={handleChange}
                onBlur={handleBlur}
                fullWidth
                margin="normal"
                error={Boolean(touched.interviewerRefId && errors.interviewerRefId)}
                helperText={touched.interviewerRefId && errors.interviewerRefId}
              >
                {loadingInterviewers ? (
                  <MenuItem value="">
                    <em>Loading...</em>
                  </MenuItem>
                ) : interviewers.length > 0 ? (
                  interviewers.map((interviewer) => (
                    <MenuItem key={interviewer.id} value={interviewer.refId}>
                      {interviewer.name} ({interviewer.email})
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="">
                    <em>No interviewers available.</em>
                  </MenuItem>
                )}
              </TextField>

              {/* Candidates Selection */}
              <TextField
                select
                label="Select Candidates"
                name="candidateIds"
                value={values.candidateIds}
                onChange={handleChange}
                onBlur={handleBlur}
                fullWidth
                margin="normal"
                SelectProps={{
                  multiple: true,
                  renderValue: (selected) => {
                    const selectedNames = candidates
                      .filter((candidate) => selected.includes(candidate.id))
                      .map((candidate) => `${candidate.firstName} ${candidate.lastName}`)
                      .join(', ');
                    return selectedNames;
                  },
                }}
                error={Boolean(touched.candidateIds && errors.candidateIds)}
                helperText={touched.candidateIds && errors.candidateIds}
              >
                {loadingCandidates ? (
                  <MenuItem value="">
                    <em>Loading...</em>
                  </MenuItem>
                ) : candidates.length > 0 ? (
                  candidates.map((candidate) => (
                    <MenuItem key={candidate.id} value={candidate.id}>
                      <Checkbox checked={values.candidateIds.includes(candidate.id)} />
                      <ListItemText primary={`${candidate.firstName} ${candidate.lastName} (${candidate.email})`} />
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="">
                    <em>No candidates available.</em>
                  </MenuItem>
                )}
              </TextField>

              {/* Submission Error */}
              {submissionError && <Alert severity="error" sx={{ mt: 2 }}>{submissionError}</Alert>}
              {submissionSuccess && <Alert severity="success" sx={{ mt: 2 }}>{submissionSuccess}</Alert>}

              {/* Actions */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button
                  variant="outlined"
                  onClick={onClose}
                  sx={{ mr: 2, textTransform: 'none' }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting || loadingInterviewers || loadingCandidates}
                  startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                  sx={{ textTransform: 'none' }}
                >
                  {isSubmitting ? 'Assigning...' : 'Assign Interviewer'}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
};

AssignMultipleInterviewerModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAssignmentsUpdated: PropTypes.func,
};

export default AssignMultipleInterviewerModal;