// src/services/interviewerService.js

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8380/api/interviewers'; // Adjust the endpoint as needed

// Axios instance with default configurations
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Fetch all interviewers
export const getInterviewers = async () => {
  try {
    const response = await axiosInstance.get('/');
    return response.data; // Assuming this returns an array of interviewers
  } catch (error) {
    console.error('Error fetching interviewers:', error);
    throw error.response?.data || 'Error fetching interviewers';
  }
};

// Optional: Fetch a single interviewer by ID
export const getInterviewerById = async (interviewerId) => {
  try {
    const response = await axiosInstance.get(`/${interviewerId}`);
    return response.data; // Assuming this returns the interviewer object
  } catch (error) {
    console.error('Error fetching interviewer by ID:', error);
    throw error.response?.data || 'Error fetching interviewer by ID';
  }
};
// Fetch assigned candidates for the interviewer
export const fetchAssignedCandidates = async () => {
  const response = await axios.get(`${API_BASE_URL}/assigned-candidates`);
  return response.data; // Adjust based on API response format
};

// Submit feedback for a candidate
export const submitCandidateFeedback = async (feedbackData) => {
  const response = await axios.post(`${API_BASE_URL}/feedback`, feedbackData);
  return response.data; // Adjust based on API response format
};

// Additional interviewer service functions as needed