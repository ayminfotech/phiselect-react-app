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

export const addCandidates = async (candidates, setSuccessMessage, setErrorMessage) => {
  try {
    const formData = new FormData();

    // Prepare candidate data
    const candidateData = candidates.map((candidate) => ({
      firstName: candidate.firstName,
      lastName: candidate.lastName,
      email: candidate.email,
      phoneNumber: candidate.phoneNumber,
      currentCompany: candidate.currentCompany,
      previousCompanies: candidate.previousCompanies,
      skillSet: candidate.skillSet,
      panCardNumber: candidate.panCardNumber,
      recruiterRefId: candidate.recruiterRefId,
      appliedPositionIds: [candidate.appliedPositionIds],
    }));

    // Append data to FormData
    formData.append('candidates', JSON.stringify(candidateData));

    // Append resume files
    candidates.forEach((candidate) => {
      if (candidate.resumeFile) {
        formData.append('resumes', candidate.resumeFile);
      }
    });

    const response = await axiosInstance.post('/batch-add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Check for successful creation
    if (response.status === 201) {
      setSuccessMessage('Candidates added successfully!');
      console.log('Created candidates:', response.data.candidates); // Log created candidates
    }

    // Return the created candidate data
    return response.data.candidates;
  } catch (error) {
    console.error('Error adding candidates:', error);

    // Handle error properly based on status code
    if (error.response) {
      if (error.response.status === 400 || error.response.status === 500) {
        setErrorMessage(error.response.data.error || 'An error occurred while adding candidates.');
      } else {
        setErrorMessage('Unexpected error occurred.');
      }
    } else {
      setErrorMessage('Network error or server not reachable.');
    }

    // Optionally, throw the error to be handled by UI
    throw error.response?.data || 'Error adding candidates.';
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

// Optional: Delete Candidate
export const deleteCandidate = async (candidateId) => {
  try {
    const response = await axiosInstance.delete(`/${candidateId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting candidate:', error);
    throw error.response?.data || 'Error deleting candidate';
  }
};