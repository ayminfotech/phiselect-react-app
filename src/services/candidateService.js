// src/services/candidateService.js

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8380/api/candidates';

// Axios instance with default configurations
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Fetch candidates for a specific job and position, with optional search query
export const getCandidatesByPosition = async (jobId, positionId, searchQuery = '') => {
  try {
    const params = { jobId, positionId };
    if (searchQuery) {
      params.search = searchQuery;
    }
    const response = await axiosInstance.get('/', { params });
    return response.data; // Assuming this returns an array of candidates
  } catch (error) {
    console.error('Error fetching candidates by position:', error);
    throw error.response?.data || 'Error fetching candidates by position';
  }
};

// Search candidates within a specific job and position
export const searchCandidates = async (jobId, positionId, query) => {
  try {
    const response = await axiosInstance.get('/', {
      params: { jobId, positionId, search: query },
    });
    return response.data; // Assuming this returns an array of candidates matching the search
  } catch (error) {
    console.error('Error searching candidates:', error);
    throw error.response?.data || 'Error searching candidates';
  }
};

// Source a new candidate for a specific job and position
export const sourceCandidate = async (jobId, positionId, candidateName) => {
  try {
    const payload = { jobId, positionId, name: candidateName };
    const response = await axiosInstance.post('/', payload);
    return response.data; // Assuming this returns the newly created candidate object
  } catch (error) {
    console.error('Error sourcing candidate:', error);
    throw error.response?.data || 'Error sourcing candidate';
  }
};

// Optional: Fetch all candidates (if needed elsewhere in your application)
export const getAllCandidates = async () => {
  try {
    const response = await axiosInstance.get('/');
    return response.data; // Assuming this returns an array of all candidates
  } catch (error) {
    console.error('Error fetching all candidates:', error);
    throw error.response?.data || 'Error fetching all candidates';
  }
};

// Bulk Create Multiple Candidates
export const bulkCreateCandidates = async (bulkCandidates) => {
  try {
    const response = await axiosInstance.post('/bulk', bulkCandidates, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data; // Array of created candidates
  } catch (error) {
    console.error('Error bulk creating candidates:', error);
    throw error.message || 'Error bulk creating candidates';
  }
};

// Assign Candidate to Positions
export const assignCandidateToPositions = async (candidateId, positions) => {
  try {
    const payload = { positions };
    const response = await axiosInstance.post(`/${candidateId}/assign`, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data; // Updated candidate object
  } catch (error) {
    console.error('Error assigning candidate to positions:', error);
    throw error.message || 'Error assigning candidate to positions';
  }
};

// Bulk Upload Resumes (Optional)
export const bulkUploadResumes = async (resumeFiles) => {
  try {
    const formData = new FormData();
    
    // Append each resume file
    resumeFiles.forEach(file => {
      formData.append('resumes', file);
    });
    
    const response = await axiosInstance.post('/bulk-resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data; // Map of upload results
  } catch (error) {
    console.error('Error bulk uploading resumes:', error);
    throw error.message || 'Error bulk uploading resumes';
  }
};

// **Add the createCandidate function below**
// Create a new candidate with detailed payload and resume upload
export const createCandidate = async (formData) => {
  try {
    const response = await axiosInstance.post('/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data; // Assuming this returns the created candidate object
  } catch (error) {
    console.error('Error creating candidate:', error);
    throw error.response?.data || 'Error creating candidate';
  }
};

// Additional candidate service functions as needed