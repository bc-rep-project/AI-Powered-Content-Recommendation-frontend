import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true // Important for handling cookies/auth
});

// Add request interceptor for auth
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Add response interceptor for token refresh
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                // Try to refresh token
                const refreshToken = localStorage.getItem('refresh_token');
                const response = await apiClient.post('/auth/refresh', { refresh_token: refreshToken });
                
                const { access_token } = response.data;
                localStorage.setItem('access_token', access_token);
                
                // Retry original request
                originalRequest.headers.Authorization = `Bearer ${access_token}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                // Handle refresh failure (logout user, redirect to login, etc.)
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error);
    }
);

export default apiClient; 