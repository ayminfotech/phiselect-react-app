import axios from 'axios';

const API_BASE_URL = "http://localhost:8380"; // Adjust as needed
const api = axios.create({
  baseURL: API_BASE_URL
});

// Interceptor to attach the token to every request
api.interceptors.request.use((config) => {
  // Retrieve the auth object from local storage and parse it
  const authData = localStorage.getItem('auth');
  const auth = authData ? JSON.parse(authData) : null;

  if (auth && auth.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const getAllTenants = async () => {
  return (await api.get('/organizations')).data;
};

export const createTenant = async (tenantData) => {
  return (await api.post('/register', tenantData)).data;
};

export const updateTenant = async (tenantId, tenantData) => {
  return (await api.put(`/${tenantId}`, tenantData)).data;
};

export const deleteTenant = async (tenantId) => {
  return (await api.delete(`/${tenantId}`)).data;
};

export const activateTenant = async (tenantId, organizationRefId) => {
  return (await api.post(`/${tenantId}/${organizationRefId}/activate`)).data;
};

export const deactivateTenant = async (tenantId, organizationRefId) => {
  return (await api.post(`/${tenantId}/${organizationRefId}/deactivate`)).data;
};

export const getTenantById = async (tenantId, organizationId) => {
  return (await api.get(`/${tenantId}/${organizationId}`)).data;
};