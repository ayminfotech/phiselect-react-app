// src/services/TenetService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8380'; // Adjust as needed

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor to attach the token to every request
api.interceptors.request.use(
  (config) => {
    const authData = localStorage.getItem('auth');
    const auth = authData ? JSON.parse(authData) : null;

    if (auth && auth.token) {
      config.headers.Authorization = `Bearer ${auth.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Get all tenets (organizations)
 */
export const getAllTenets = async () => {
  return (await api.get('/organizations')).data;
};

/**
 * Register a new tenet (organization)
 * @param {Object} tenetData - Data for the new tenet
 */
export const createTenet = async (tenetData) => {
  return (await api.post('/register', tenetData)).data;
};

/**
 * Update tenet details
 * @param {String} tenantId - ID of the tenant
 * @param {Number} tenetId - ID of the tenet to update
 * @param {Object} tenetData - Updated data for the tenet
 */
export const updateTenet = async (tenantId, tenetId, tenetData) => {
  return (await api.put(`/${tenantId}/${tenetId}`, tenetData)).data;
};

/**
 * Delete a tenet
 * @param {String} tenantId - ID of the tenant
 * @param {Number} tenetId - ID of the tenet to delete
 */
export const deleteTenet = async (tenantId, tenetId) => {
  return (await api.delete(`/${tenantId}/${tenetId}`)).data;
};

/**
 * Activate a tenet
 * @param {String} tenantId - ID of the tenant
 * @param {String} organizationRefId - Reference ID of the organization
 */
export const activateTenet = async (tenantId, organizationRefId) => {
  return (await api.post(`/${tenantId}/${organizationRefId}/activate`)).data;
};

/**
 * Deactivate a tenet
 * @param {String} tenantId - ID of the tenant
 * @param {String} organizationRefId - Reference ID of the organization
 */
export const deactivateTenet = async (tenantId, organizationRefId) => {
  return (await api.post(`/${tenantId}/${organizationRefId}/deactivate`)).data;
};

/**
 * Get tenet by ID
 * @param {String} tenantId - ID of the tenant
 * @param {Number} tenetId - ID of the tenet
 */
export const getTenetById = async (tenantId, tenetId) => {
  return (await api.get(`/${tenantId}/${tenetId}`)).data;
};

/**
 * Get tenet reports (dummy data)
 */
export const getTenetReports = async () => {
  // If your backend API is ready, uncomment the following line:
  // return (await api.get('/organizations/reports')).data;

  // Dummy data implementation for testing purposes:
  return [
    {
      id: 1,
      title: 'Monthly Sales Report',
      summary: 'Summary of monthly sales.',
    },
    {
      id: 2,
      title: 'User Activity Report',
      summary: 'Summary of user activities.',
    },
    {
      id: 3,
      title: 'System Performance Report',
      summary: 'Summary of system performance.',
    },
    // Add more dummy reports as needed
  ];
};