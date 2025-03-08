// src/services/interviewService.js

import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Corrected import

const API_BASE_URL =  'http://localhost:8380/api' // Updated base URL

// Create an axios instance for interview-related API calls
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

        // Logging details (can be removed in production)
        console.log('==== Preparing Interview API Request ====');
        console.log('Request URL:', config.url);
        console.log('Request Method:', config.method);
        console.log('Token:', auth.token);
        console.log('Tenant ID:', tenantId);
        console.log('User Ref ID:', userRefId);
        console.log('Request Headers:', config.headers);
        if (config.data) {
          console.log('Request Data:', config.data);
        }
        console.log('===========================================');
      } catch (error) {
        console.error('Failed to decode token:', error.message);
      }
    } else {
      console.warn('No auth token found in localStorage.');
    }

    return config;
  },
  (error) => {
    console.error('Error in interview request interceptor:', error);
    return Promise.reject(error);
  }
);

/**
 * Fetch all interviews assigned to the currently logged-in interviewer.
 * GET /api/candidates/interviews/assigned?interviewerRefId={interviewerRefId}
 *
 * @returns {Promise<Array>} - Array of ScheduledInterview objects
 */
export const getInterviewsByInterviewer = async () => {
  try {
    const authData = localStorage.getItem('auth');
    const auth = authData ? JSON.parse(authData) : null;

    if (!auth?.token) {
      throw new Error('No token found');
    }

    // Decode the token to extract userRefId
    const decodedToken = jwtDecode(auth.token);
    const userRefId = decodedToken.userRefID;  // Ensure this matches your token's payload

    if (!userRefId) {
      throw new Error('User Reference ID not found in token');
    }

    // Make the API call to fetch assigned interviews
    const response = await axiosInstance.get(`/candidates/interviews/assigned`, {
      params: { interviewerRefId: userRefId },
    });

    return response.data; // Assuming backend returns an array of interviews
  } catch (error) {
    console.error('Error fetching interviews by interviewer:', error);
    throw error.response?.data || 'Error fetching interviews';
  }
};

/**
 * Provide feedback for a specific interview.
 * PATCH /api/interviews/interviewers/{interviewerRefId}/interviews/{interviewRefId}/feedback
 *
 * @param {string} interviewerRefId - Reference ID of the interviewer
 * @param {string} interviewRefId - UUID of the interview
 * @param {Object} feedbackData - { feedback, rating, notes, selectionStatus }
 * @returns {Promise<Object>} - Updated ScheduledInterview object
 */
export const provideInterviewFeedback = async (interviewerRefId, interviewRefId, feedbackData) => {
  try {
    const response = await axiosInstance.patch(
      `/candidates/interviewers/${interviewerRefId}/interviews/${interviewRefId}/feedback`,
      feedbackData
    );
    return response.data; // Assuming backend returns the updated interview
  } catch (error) {
    console.error('Error providing interview feedback:', error);
    throw error.response?.data || 'Error providing feedback';
  }
};

/**
 * Cancel a specific interview.
 * PATCH /api/interviews/cancel
 *
 * @param {string} candidateId - UUID of the candidate
 * @param {string} interviewRefId - UUID of the interview
 * @returns {Promise<Object>} - Updated ScheduledInterview object
 */
export const cancelInterview = async (candidateId, interviewRefId) => {
  try {
    const response = await axiosInstance.patch('/cancel', { candidateId, interviewRefId });
    return response.data; // Assuming backend returns the updated interview
  } catch (error) {
    console.error('Error cancelling interview:', error);
    throw error.response?.data || 'Error cancelling interview';
  }
};

/**
 * Update details of a specific interview.
 * PUT /api/interviews/update
 *
 * @param {string} candidateId - UUID of the candidate
 * @param {string} interviewRefId - UUID of the interview
 * @param {Object} updateData - Fields to update (e.g., scheduledDateTime, roundNumber)
 * @returns {Promise<Object>} - Updated ScheduledInterview object
 */
export const updateInterview = async (candidateId, interviewRefId, updateData) => {
  try {
    const payload = { candidateId, interviewRefId, ...updateData };
    const response = await axiosInstance.put('/update', payload);
    return response.data; // Assuming backend returns the updated interview
  } catch (error) {
    console.error('Error updating interview:', error);
    throw error.response?.data || 'Error updating interview';
  }
};

/**
 * Fetch all scheduled interviews (for Recruiters or Admins).
 * GET /api/interviews/scheduled
 *
 * @returns {Promise<Array>} - Array of ScheduledInterview objects
 */
export const getAllScheduledInterviews = async () => {
  try {
    const response = await axiosInstance.get('/scheduled');
    return response.data; // Assuming backend returns an array of scheduled interviews
  } catch (error) {
    console.error('Error fetching all scheduled interviews:', error);
    throw error.response?.data || 'Error fetching scheduled interviews';
  }
};

/**
 * Fetch all scheduled interviews for a specific candidate.
 * GET /api/interviews/candidates/{candidateId}/interviews
 *
 * @param {string} candidateId - UUID of the candidate
 * @returns {Promise<Array>} - Array of ScheduledInterview objects
 */
export const getScheduledInterviewsByCandidate = async (candidateId) => {
  try {
    const response = await axiosInstance.get(`/candidates/${candidateId}/interviews`);
    return response.data; // Assuming backend returns an array of interviews
  } catch (error) {
    console.error('Error fetching scheduled interviews by candidate:', error);
    throw error.response?.data || 'Error fetching scheduled interviews';
  }
};