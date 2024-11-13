import axios from 'axios';
import config from '@/config'; 

const axiosInstance = axios.create({
  baseURL: config.API_URL_APPLICATION, // Set your base URL here
});
// Request interceptor to attach access token to every request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Optional: Response interceptor to check for 401 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If the token is expired or invalid, redirect to the login page
      localStorage.removeItem('token'); // Clear token
      window.location.href = '/auth/login'; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
