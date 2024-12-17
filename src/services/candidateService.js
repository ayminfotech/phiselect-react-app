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

// Add Candidate: Create a new candidate with detailed payload and resume upload
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

    const response = await axiosInstance.post('/', formData, {
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

// Assign Interview: Assigns an interview to a candidate.
export const assignInterview = async (candidateId, interviewData) => {
  try {
    const response = await axiosInstance.post(`/${candidateId}/assign-interview`, interviewData);
    return response.data; // Assuming this returns the updated candidate object with interview details
  } catch (error) {
    console.error('Error assigning interview:', error);
    throw error.response?.data || 'Error assigning interview';
  }
};

// Existing service functions...

// Batch Add Candidates: Create multiple candidates with detailed payload and resume uploads
export const addCandidates = async (candidates) => {
  try {
    // Create FormData for multiple candidates
    const formData = new FormData();

    candidates.forEach((candidate, index) => {
      Object.keys(candidate).forEach((key) => {
        if (key === 'resumeFile') {
          formData.append(`candidates[${index}].resume`, candidate.resumeFile);
        } else if (Array.isArray(candidate[key])) {
          candidate[key].forEach((item) => formData.append(`candidates[${index}].${key}[]`, item));
        } else {
          formData.append(`candidates[${index}].${key}`, candidate[key]);
        }
      });
    });

    const response = await axiosInstance.post('/batch-add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data; // Assuming this returns an array of created candidate objects
  } catch (error) {
    console.error('Error adding candidates:', error);
    throw error.response?.data || 'Error adding candidates.';
  }
};