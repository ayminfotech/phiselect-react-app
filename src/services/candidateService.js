// src/services/candidateService.js
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Corrected import

const API_BASE_URL = 'https://test.phiselect.com/api/candidates'; // Adjust as needed

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to attach tokens and log requests
axiosInstance.interceptors.request.use(
  (config) => {
    const authData = localStorage.getItem('auth');
    const auth = authData ? JSON.parse(authData) : null;

    if (auth?.token) {
      try {
        // Decode the token to extract tenantId and userRefId
        const decodedToken = jwtDecode(auth.token);
        const tenantId = decodedToken.tenantId || 'No Tenant ID Found';
        const userRefId = decodedToken.userRefID || 'No User Ref ID Found';

        // Adding headers with correct names
        config.headers.Authorization = `Bearer ${auth.token}`;
        config.headers['X-Tenant-ID'] = tenantId;
        config.headers['X-User-Ref'] = userRefId;

        // Logging details
        console.log('==== Preparing API Request ====');
        console.log('Request URL:', config.url);
        console.log('Request Method:', config.method);
        console.log('Token:', auth.token);
        console.log('Tenant ID:', tenantId);
        console.log('User Ref ID:', userRefId);
        console.log('Request Headers:', config.headers);
        if (config.data) {
          console.log('Request Data:', config.data);
        }
        console.log('===============================');
      } catch (error) {
        console.error('Failed to decode token:', error.message);
      }
    } else {
      console.warn('No auth token found in localStorage.');
    }

    return config;
  },
  (error) => {
    console.error('Error in request interceptor:', error);
    return Promise.reject(error);
  }
);

/**
 * Fetch candidates optionally filtered by positionId and search.
 * GET /api/candidates?positionId=xxx&search=zzz
 * 
 * If positionId is not provided, returns all candidates.
 */
export const getCandidates = async (positionId, search = '') => {
  try {
    const params = {};
    if (positionId) params.positionId = positionId;
    if (search) params.search = search;

    const response = await axiosInstance.get('', { params }); // Removed trailing '/'
    return response.data; // Assuming this returns an array of candidates
  } catch (error) {
    console.error('Error fetching candidates:', error);
    throw error.response?.data || 'Error fetching candidates';
  }
};

/**
 * Add a single candidate with optional resume upload.
 */
export const addCandidate = async (candidateData, resumeFile) => {
  try {
    const formData = new FormData();
    Object.keys(candidateData).forEach((key) => {
      if (Array.isArray(candidateData[key])) {
        candidateData[key].forEach((item) => formData.append(`${key}[]`, item));
      } else {
        formData.append(key, candidateData[key]);
      }
    });
    if (resumeFile) {
      formData.append('resume', resumeFile);
    }

    const response = await axiosInstance.post('', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data; // Assuming this returns the created candidate object
  } catch (error) {
    console.error('Error adding candidate:', error);
    throw error.response?.data || 'Error adding candidate';
  }
};

/**
 * Batch-add multiple candidates with optional resumes.
 *
 * @param {Array} candidates - Array of candidate objects to be added.
 * @param {Function} setSuccessMessage - Function to update success message in UI.
 * @param {Function} setErrorMessage - Function to update error message in UI.
 * @returns {Promise<Array>} - Array of created candidate objects.
 */
export const addCandidates = async (candidates, setSuccessMessage, setErrorMessage) => {
  try {
    const formData = new FormData();

    // Append candidate data
    const candidateData = candidates.map((candidate) => ({
      firstName: candidate.firstName,
      lastName: candidate.lastName,
      email: candidate.email,
      phoneNumber: candidate.phoneNumber,
      currentCompany: candidate.currentCompany || '',
      skillSet: candidate.skillSet || '',
      panCardNumber: candidate.panCardNumber,
      recruiterRefId: candidate.recruiterRefId,
      appliedPositions: candidate.appliedPositions, // Assuming this is an array of PositionDTO
    }));

    formData.append('candidates', JSON.stringify(candidateData));

    // Append resume files, if provided
    candidates.forEach((candidate, index) => {
      if (candidate.resumeFile) {
        formData.append(`resumes[${index}]`, candidate.resumeFile);
      }
    });

    // Send POST request to batch-add endpoint
    const response = await axiosInstance.post('/batch-add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Check for successful creation
    if (response.status === 201) {
      setSuccessMessage('Candidates added successfully!');
      console.log('Created candidates:', response.data); // Log created candidates for debugging
      return response.data; // Return the created candidates
    }
  } catch (error) {
    console.error('Error adding candidates:', error);

    // Handle error responses and update UI messages
    if (error.response) {
      if (error.response.status === 400 || error.response.status === 500) {
        setErrorMessage(error.response.data.error || 'An error occurred while adding candidates.');
      } else {
        setErrorMessage('Unexpected error occurred.');
      }
    } else {
      setErrorMessage('Network error or server not reachable.');
    }

    throw error.response?.data || 'Error adding candidates.';
  }
};
/**
 * Assign an interview to a candidate.
 * POST /api/candidates/{candidateId}/assign-interview
 */
export const assignInterview = async (candidateId, interviewData) => {
  try {
    const response = await axiosInstance.post(`/${candidateId}/assign-interview`, interviewData);
    return response.data; // Should return InterviewScheduleResponseDTO
  } catch (error) {
    console.error('Error assigning interview:', error);
    throw error.response?.data || 'Error assigning interview';
  }
};

/**
 * Assign multiple candidates to an interviewer.
 * POST /api/candidates/assign-multiple-interviews
 * 
 * @param {Object} assignmentData - { positionId: string, interviewerRefId: string, scheduledDateTime: string (ISO), roundNumber: string, candidateIds: array of UUIDs }
 * @returns {Promise<Array>} - Array of updated Candidate objects
 */
export const assignMultipleCandidatesToInterviewer = async (assignmentData) => {
  try {
    const response = await axiosInstance.post('/assign-multiple-interviews', assignmentData);
    return response.data; // Assuming this returns an array of updated candidates
  } catch (error) {
    console.error('Error assigning multiple candidates:', error);
    throw error.response?.data || 'Error assigning multiple candidates';
  }
};

/**
 * Optional: Delete a candidate by ID.
 */
export const deleteCandidate = async (candidateId) => {
  try {
    const response = await axiosInstance.delete(`/${candidateId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting candidate:', error);
    throw error.response?.data || 'Error deleting candidate';
  }
};