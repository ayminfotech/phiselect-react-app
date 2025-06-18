import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

// Optional: attach token from localStorage
api.interceptors.request.use((config) => {
  const authData = localStorage.getItem('auth');
  const auth = authData ? JSON.parse(authData) : null;

  if (auth?.token) {
    config.headers['Authorization'] = `Bearer ${auth.token}`;
  }

  return config;
}, (error) => Promise.reject(error));

// Response interceptor to handle 401 errors globally
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // You can call refresh-token logic here if implemented
      console.warn("Unauthorized request - redirecting to login or refreshing...");
      // logout or navigate to login here

      return Promise.reject(error); // don't retry automatically
    }

    return Promise.reject(error);
  }
);

export default api;