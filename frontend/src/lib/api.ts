// Centralized API utility for authenticated requests
import axios from 'axios';

const API_BASE = '/api';

export const getToken = () => localStorage.getItem('token');

export const api = axios.create({
  baseURL: API_BASE,
});

// Attach token to every request if available
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle 401 Unauthorized globally
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Clear token and reload to force login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
