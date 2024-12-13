// src/services/UserService.js

import axios from 'axios';

// Base URL configuration (adjust as needed)
const API_BASE_URL = 'http://localhost:8290/api/users';

/**
 * Helper function to get the authentication token from localStorage or another secure storage.
 * Adjust this function based on where and how you store the token.
 */
const getAuthToken = () => {
  return localStorage.getItem('authToken'); // Example: Retrieve token from localStorage
};

// Axios instance with default configurations
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add the Authorization header to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Create a new user
export const createUser = async (userData) => {
  try {
    const response = await axiosInstance.post('/create', userData);
    // Assuming the API returns the created user data directly
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error.response?.data || 'Error creating user';
  }
};

// Change the authenticated user's password
export const changeUserPassword = async (passwordData) => {
  try {
    const response = await axiosInstance.post('/change-password', passwordData);
    return response.data;
  } catch (error) {
    console.error('Error changing password:', error);
    throw error.response?.data || 'Error changing password';
  }
};

// Assign a role to a user by userId and roleId
export const assignRoleToUser = async (userId, roleId) => {
  try {
    const response = await axiosInstance.post(`/${userId}/roles/${roleId}`);
    return response.data;
  } catch (error) {
    console.error('Error assigning role to user:', error);
    throw error.response?.data || 'Error assigning role to user';
  }
};

// Fetch users by tenantId
export const getUsersByTenantId = async (tenantId) => {
  try {
    const response = await axiosInstance.get(`/tenant/${tenantId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error.response?.data || 'Error fetching users';
  }
};

// Update a user (Assuming you have implemented this endpoint in your backend)
export const updateUser = async (userId, userData) => {
  try {
    const response = await axiosInstance.put(`/update/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error.response?.data || 'Error updating user';
  }
};

// Delete a user (Assuming you have implemented this endpoint in your backend)
export const deleteUser = async (userId) => {
  try {
    const response = await axiosInstance.delete(`/delete/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error.response?.data || 'Error deleting user';
  }
};