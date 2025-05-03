import axios from 'axios';

const api = axios.create({
  baseURL: 'https://test.phiselect.com/api',
  withCredentials: true
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await api.post('/api/v1/auth/authenticate');
        originalRequest.headers['Authorization'] = `Bearer ${response.data.access_token}`;
        console.log("orginal",response.data.access_token)
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;