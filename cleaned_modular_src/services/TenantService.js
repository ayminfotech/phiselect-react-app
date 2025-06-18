// src/services/TenetService.js
import axios from 'axios';

const API_BASE_URL = 'http://test.phiselect.com'; // Ensure this matches your backend's base URL

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
 * 1. Get All Organizations
 * GET /api/organizations
 */
export const getAllTenets = async () => {
  try {
    const response = await api.get('/organizations');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * 2. Register a New Organization
 * POST /api/register
 * @param {Object} organizationData - Data for the new organization
 */
export const createTenet = async (organizationData) => {
  try {
    const response = await api.post('/register', organizationData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * 3. Update Organization Details
 * PUT /api/organizations/{id}
 * @param {String} id - UUID of the organization to update
 * @param {Object} organizationData - Updated data for the organization
 */
export const updateTenet = async (id, organizationData) => {
  try {
    const response = await api.put(`/organizations/${id}`, organizationData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * 4. Delete an Organization
 * DELETE /api/organizations/{id}
 * @param {String} id - UUID of the organization to delete
 */
export const deleteTenet = async (id) => {
  try {
    const response = await api.delete(`/organizations/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * 5. Activate an Organization
 * POST /api/organizations/{id}/activate
 * @param {String} id - UUID of the organization to activate
 */
export const activateTenet = async (id) => {
  try {
    const response = await api.post(`/organizations/${id}/activate`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * 6. Deactivate an Organization
 * POST /api/organizations/{id}/deactivate
 * @param {String} id - UUID of the organization to deactivate
 */
export const deactivateTenet = async (id) => {
  try {
    const response = await api.post(`/organizations/${id}/deactivate`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * 7. Get Organizations by Tenant ID
 * GET /api/tenants/{tenantId}/organizations
 * @param {String} tenantId - UUID of the tenant
 */
export const getOrganizationsByTenantId = async (tenantId) => {
  try {
    const response = await api.get(`/tenants/${tenantId}/organization`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * 8. Get Organization by ID
 * GET /api/organizations/{id}
 * @param {String} id - UUID of the organization
 */
export const getTenetById = async (id) => {
  try {
    const response = await api.get(`/organizations/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * 9. Get Organization by Tenant ID and Organization ID
 * GET /api/tenants/{tenantId}/organizations/{id}
 * @param {String} tenantId - UUID of the tenant
 * @param {String} id - UUID of the organization
 */
export const getOrganizationByTenantAndId = async (tenantId, id) => {
  try {
    const response = await api.get(`/tenants/${tenantId}/organizations/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * 10. Get Organization Reports
 * GET /api/organizations/{id}/reports
 * 
 * Note: Since the backend API is not ready yet, this function returns dummy data.
 * Once the backend is ready, uncomment the API call and remove the dummy data.
 * 
 * @param {String} id - UUID of the organization
 * @returns {Array} - Array of report objects
 */
export const getTenetReports = async (id) => {
  try {
    // Uncomment the following lines when your backend API is ready
    // const response = await api.get(`/organizations/${id}/reports`);
    // return response.data;

    // Dummy data implementation for testing purposes:
    return [
      {
        id: 'report-1',
        title: 'Monthly Sales Report',
        summary: 'Detailed summary of monthly sales for the organization.',
        date: '2024-11-01',
      },
      {
        id: 'report-2',
        title: 'User Activity Report',
        summary: 'Overview of user activities within the organization.',
        date: '2024-11-15',
      },
      {
        id: 'report-3',
        title: 'System Performance Report',
        summary: 'Analysis of system performance metrics.',
        date: '2024-12-01',
      },
      // Add more dummy reports as needed
    ];
  } catch (error) {
    throw error;
  }
};