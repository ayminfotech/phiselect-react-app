import React, { createContext, useState, useEffect } from 'react';
import axios from '../../api/axiosInstance';
import {jwtDecode} from 'jwt-decode'; // Ensure proper import

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const storedAuth = localStorage.getItem('auth');
    return storedAuth ? JSON.parse(storedAuth) : null;
  });

  const setAuthData = (authData) => {
    setAuth(authData);
    localStorage.setItem('auth', JSON.stringify(authData));
  };

  /**
   * Refresh token function to renew the access token
   */
  const refreshToken = async () => {
    try {
      const response = await axios.post('/api/v1/auth/refresh-token', null, {
        headers: {
          Authorization: `Bearer ${auth?.refresh_token}`,
        },
      });

      const decodedToken = jwtDecode(response.data.access_token);

      const updatedAuth = {
        ...auth,
        token: response.data.access_token,
        roles: decodedToken.roles || [],
        permissions: decodedToken.permissions || [],
      };

      setAuthData(updatedAuth);
      console.log('Token refreshed successfully:', updatedAuth);
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error.response?.data?.message || error.message);
      logout();
      return false;
    }
  };

  /**
   * Login function to authenticate the user
   * @param {Object} credentials - User credentials
   * @returns {Boolean} - Indicates success or failure
   */
  const login = async (credentials) => {
    try {
      const response = await axios.post('/api/v1/auth/authenticate', credentials, {
        headers: {
          'Content-Type': 'application/json',
          Accept: '*/*',
        },
      });

      const decodedToken = jwtDecode(response.data.access_token);

      const authData = {
        token: response.data.access_token,
        refresh_token: response.data.refresh_token, // Store refresh token
        roles: decodedToken.roles || [],
        permissions: decodedToken.permissions || [],
        tenantId: decodedToken.tenantId || '',
      };

      setAuthData(authData);

      console.log('Login successful, auth data stored:', authData);
      return true;
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || error.message);
      return false;
    }
  };

  /**
   * Logout function to clear user authentication
   */
  const logout = async () => {
    try {
      await axios.post('/api/v1/auth/logout', null, {
        headers: {
          Authorization: `Bearer ${auth?.token}`,
        },
      });
    } catch (error) {
      console.error('Logout failed:', error.response?.data?.message || error.message);
    } finally {
      setAuth(null);
      localStorage.removeItem('auth');
    }
  };

  /**
   * Check authentication state on app load
   */
  useEffect(() => {
    const verifyAuth = async () => {
      const storedAuth = JSON.parse(localStorage.getItem('auth'));
      if (storedAuth?.token) {
        try {
          const decodedToken = jwtDecode(storedAuth.token);

          // Check token expiration
          const isTokenExpired = decodedToken.exp * 1000 < Date.now();
          if (isTokenExpired) {
            console.log('Token expired, attempting to refresh...');
            const refreshed = await refreshToken();
            if (!refreshed) {
              logout();
            }
          } else {
            setAuth(storedAuth);
            console.log('Auth state restored:', storedAuth);
          }
        } catch (error) {
          console.error('Token verification failed, logging out:', error.message);
          logout();
        }
      }
    };

    verifyAuth();
  }, []);

  /**
   * Axios request interceptor to handle token refreshing
   */
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      async (config) => {
        if (auth?.token) {
          const decodedToken = jwtDecode(auth.token);
          const isTokenExpired = decodedToken.exp * 1000 < Date.now();
          if (isTokenExpired) {
            console.log('Token expired, refreshing...');
            const refreshed = await refreshToken();
            if (refreshed) {
              config.headers['Authorization'] = `Bearer ${auth.token}`;
            }
          } else {
            config.headers['Authorization'] = `Bearer ${auth.token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => axios.interceptors.request.eject(requestInterceptor);
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, login, logout, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;