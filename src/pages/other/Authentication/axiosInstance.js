import axios from 'axios';
import config from '@/config'; // Assuming this has your base API URL

const axiosInstance = axios.create({
  baseURL: config.API_URL_APPLICATION, // Set your base URL here
});

// Function to refresh the token
const refreshToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken'); // Get the refresh token from localStorage

  if (!refreshToken) {
    // If there's no refresh token, redirect to login page
    window.location.href = '/login';
    return null;
  }

  try {
    const response = await axios.post(`${config.API_URL_APPLICATION}/auth/refresh-token`, { refreshToken });
    if (response.data && response.data.token) {
      // Update localStorage with the new access token
      localStorage.setItem('token', response.data.token);
      return response.data.token;
    } else {
      console.error("Failed to refresh token");
      return null;
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    window.location.href = '/login'; // If refresh fails, redirect to login
    return null;
  }
};

// Request interceptor to add token to the headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Get the current token from localStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Add token to headers
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 (Unauthorized), try to refresh the token
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Avoid infinite retry loop

      const newToken = await refreshToken(); // Try to refresh the token

      if (newToken) {
        // If token is refreshed, retry the original request with the new token
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return axios(originalRequest); // Retry the original request
      } else {
        return Promise.reject(error); // If refresh failed, reject the promise
      }
    }

    return Promise.reject(error); // For other errors, reject as usual
  }
);

export default axiosInstance;
