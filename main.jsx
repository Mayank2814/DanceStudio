import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  // Only add token if it's valid (has 3 parts separated by dots)
  if (token && token.split('.').length === 3) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Clear invalid tokens on 401 responses
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default API;
