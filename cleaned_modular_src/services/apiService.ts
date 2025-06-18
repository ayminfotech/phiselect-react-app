import axios, { AxiosRequestConfig } from 'axios';

const apiService = axios.create({
  baseURL: 'https://test.phiselect.com/api/v1/auth', // Adjust as per your backend URL
});

// Interceptor to include token in headers for all requests
apiService.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = localStorage.getItem('authToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiService;
