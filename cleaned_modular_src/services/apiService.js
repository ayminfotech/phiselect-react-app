import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const apiService = axios.create({
  baseURL: 'https://test.phiselect.com/api/v1/auth', // Adjust if needed
});

// Interceptor to include token in headers for all requests
apiService.interceptors.request.use((config) => {
  const authData = localStorage.getItem('auth');
  const auth = authData ? JSON.parse(authData) : null;

  if (auth?.token) {
    try {
      const decodedToken = jwtDecode(auth.token);
      const tenantId = decodedToken.tenantId || 'Unknown-Tenant';
      const userRefId = decodedToken.userRefID || 'Unknown-UserRef';

      config.headers.Authorization = `Bearer ${auth.token}`;
      config.headers['X-Tenant-ID'] = tenantId;
      config.headers['X-User-Ref'] = userRefId;

      console.log('🔐 Injected Auth Headers:', {
        Authorization: config.headers.Authorization,
        'X-Tenant-ID': tenantId,
        'X-User-Ref': userRefId,
      });
    } catch (err) {
      console.error('❌ Failed to decode JWT:', err.message);
    }
  }

  return config;
}, (error) => Promise.reject(error));

export default apiService;