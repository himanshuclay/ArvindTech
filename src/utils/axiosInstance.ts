import axios from 'axios';
import config from '@/config';

const axiosInstance = axios.create({
    baseURL: config.API_URL_APPLICATION,
});

// Request Interceptor: Attach token from localStorage
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('_AUTH_TOKEN');  // Use the same key you used in your AuthContext
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response Interceptor: Handle 401 errors
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('_AUTH_SESSION');
            localStorage.removeItem('_AUTH_TOKEN');
            window.location.href = '/auth/logout';  // Redirect to logout or login page
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
