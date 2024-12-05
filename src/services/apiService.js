import axios from 'axios';

const apiService = axios.create({
    baseURL: 'http://localhost:8290/api/v1/auth', // Adjust as per your backend URL
});

// Interceptor to include token in headers for all requests
apiService.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default apiService;