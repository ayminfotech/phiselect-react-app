// src/services/UserService.js

import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Base URL configuration (adjust as needed)
const API_BASE_URL = 'https://10.0.101.11:8380/api/users';

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

// Request interceptor to attach tokens and log requests
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
  
          // Adding headers
        //   config.headers.Authorization = `Bearer ${auth.token}`;
        //   config.headers['Tenant-ID'] = tenantId;
        //   config.headers['User-Ref-ID'] = userRefId;
  
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

// Fetch users by tenantId and roles
export const getUsersByTenantIdAndRoles = async (roles) => {
    try {
        const authData = localStorage.getItem('auth');
        const auth = authData ? JSON.parse(authData) : null;
      if (!auth?.token) {
        throw new Error('No token found');
      }
  
      // Decode token to get tenantId
      const decodedToken = jwtDecode(auth.token);
      const tenantId = decodedToken.tenantId;
  
      if (!tenantId) {
        throw new Error('Tenant ID not found in token');
      }
  
      const rolesString = roles.join(',');  // Convert roles array to a comma-separated string
      const response = await axiosInstance.get(`/tenant/${tenantId}/roles`, {
        params: { roles: rolesString }
      });
      return response.data;  // Return the list of users based on tenantId and roles
    } catch (error) {
      console.error('Error fetching users by tenant and roles:', error);
      throw error.response?.data || 'Error fetching users';
    }
  };