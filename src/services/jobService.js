import axios from 'axios';

const API_BASE_URL = 'http://localhost:8380/api/jobs';

const getConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`
  }
});

export const createJob = async (jobData, token) => {
  return axios.post(API_BASE_URL, jobData, getConfig(token));
};

export const updateJob = async (jobId, jobData, token) => {
  return axios.put(`${API_BASE_URL}/${jobId}`, jobData, getConfig(token));
};

export const deleteJob = async (jobId, token) => {
  return axios.delete(`${API_BASE_URL}/${jobId}`, getConfig(token));
};

export const fetchAllJobs = async (token) => {
  return axios.get(API_BASE_URL, getConfig(token));
};