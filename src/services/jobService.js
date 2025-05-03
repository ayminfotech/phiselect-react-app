import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Ensure jwt-decode is installed

// Base URL configuration
const API_BASE_URL = 'http://10.0.101.11:8380/api';

// Axios instance with default configurations
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

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
    }

    return config;
  },
  (error) => {
    console.error('Error in request interceptor:', error);
    return Promise.reject(error);
  }
);

// Functions for Job Operations

/**
 * Create a new job
 * @param {Object} jobData - Job details to be created
 * @returns {Object} - Created job details
 */
export const createJob = async (jobData) => {
  try {
    console.log('Creating job with data:', jobData);
    const response = await axiosInstance.post('/jobs', jobData);
    console.log('Job created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating job:', error.response || error);
    throw error.response?.data || 'Error creating job';
  }
};

/**
 * Fetch all jobs
 * @returns {Array} - List of jobs
 */
export const getAllJobs = async () => {
  try {
    console.log('Fetching all jobs...');
    const response = await axiosInstance.get('/jobs');
    console.log('Jobs fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching jobs:', error.response || error);
    throw error.response?.data || 'Error fetching jobs';
  }
};

/**
 * Fetch a job by its ID
 * @param {String} jobId - Job ID
 * @returns {Object} - Job details
 */
export const getJobById = async (jobId) => {
  try {
    console.log(`Fetching job with ID: ${jobId}`);
    const response = await axiosInstance.get(`/${jobId}`);
    console.log('Job details fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching job with ID ${jobId}:`, error.response || error);
    throw error.response?.data || 'Error fetching job';
  }
};

/**
 * Update a job
 * @param {String} jobId - Job ID
 * @param {Object} jobData - Updated job data
 * @returns {Object} - Updated job details
 */
export const updateJob = async (jobId, jobData) => {
  try {
    console.log(`Updating job with ID: ${jobId}`, jobData);
    const response = await axiosInstance.put(`/${jobId}`, jobData);
    console.log('Job updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error updating job with ID ${jobId}:`, error.response || error);
    throw error.response?.data || 'Error updating job';
  }
};

/**
 * Delete a job
 * @param {String} jobId - Job ID
 * @returns {Object} - Deletion response
 */
export const deleteJob = async (jobId) => {
  try {
    console.log(`Deleting job with ID: ${jobId}`);
    const response = await axiosInstance.delete(`/${jobId}`);
    console.log('Job deleted successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error deleting job with ID ${jobId}:`, error.response || error);
    throw error.response?.data || 'Error deleting job';
  }
};

/**
 * Assign a recruiter to a position
 * @param {String} jobId - Job ID
 * @param {String} positionCode - Position code
 * @param {String} recruiterId - Recruiter ID
 * @returns {Object} - Updated job position
 */
export const assignRecruiterToPosition = async (jobId, positionCode, recruiterId) => {
  try {
    console.log(
      `Assigning recruiter ${recruiterId} to position ${positionCode} in job ${jobId}`
    );
    const response = await axiosInstance.post(
      `/jobs/${jobId}/positions/${positionCode}/assignRecruiter`,
      null,
      {
        params: { recruiterId },
      }
    );
    console.log('Recruiter assigned successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error(
      `Error assigning recruiter ${recruiterId} to position ${positionCode} in job ${jobId}:`,
      error.response || error
    );
    throw error.response?.data || 'Error assigning recruiter to position';
  }
};

/**
 * Assign candidates to a position
 * @param {String} jobId - Job ID
 * @param {String} positionCode - Position code
 * @param {Array} candidateIds - Array of candidate IDs
 * @returns {Object} - Updated job position
 */
export const assignCandidatesToPosition = async (jobId, positionCode, candidateIds) => {
  try {
    console.log(
      `Assigning candidates ${candidateIds} to position ${positionCode} in job ${jobId}`
    );
    const response = await axiosInstance.post(
      `/${jobId}/positions/${positionCode}/assignCandidates`,
      { candidateIds }
    );
    console.log('Candidates assigned successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error(
      `Error assigning candidates to position ${positionCode} in job ${jobId}:`,
      error.response || error
    );
    throw error.response?.data || 'Error assigning candidates to position';
  }
};

// Function to fetch assigned jobs for the recruiter based on tenantId and userRefId extracted from the token
export const getAssignedJobsByRecruiter = async () => {
  try {
    const authData = localStorage.getItem('auth');
    const auth = authData ? JSON.parse(authData) : null;

    if (!auth?.token) {
      throw new Error('No token found');
    }

    // Decode the token to extract tenantId and userRefId
    const decodedToken = jwtDecode(auth.token);
    const tenantId = decodedToken.tenantId;  // Assuming tenantId is in the token payload
    const userRefId = decodedToken.userRefID;  // Assuming userRefId is in the token payload

    // Fetch assigned jobs using the tenantId and userRefId
    const response = await axiosInstance.get(`${API_BASE_URL}/jobs/tenant/${tenantId}/recruiter/${userRefId}`);
    return response.data;

  } catch (error) {
    console.error('Error fetching assigned jobs:', error);
    throw error.response?.data || 'Error fetching assigned jobs';
  }
};
/**
 * Fetch positions for a specific job
 * @param {String} jobId - Job ID (UUID) for which positions are fetched
 * @returns {Array} - Array of Position objects
 */
export const getPositionsByJobId = async (jobId) => {
  try {
    console.log(`Fetching positions for job with ID: ${jobId}`);
    // Notice we are calling /jobs/<jobId>/positions
    const response = await axiosInstance.get(`/jobs/${jobId}/positions`);
    console.log('Positions fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching positions for job ID ${jobId}:`, error.response || error);
    throw error.response?.data || 'Error fetching positions';
  }
};