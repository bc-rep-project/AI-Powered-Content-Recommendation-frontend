import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_PREFIX = '/api/v1';

export const api = axios.create({
    baseURL: `${API_URL}${API_PREFIX}`,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true  // Important for CORS with credentials
});

// Add request interceptor for authentication
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 503) {
            console.error('Service temporarily unavailable');
            return Promise.reject({
                code: 'SERVICE_UNAVAILABLE',
                message: 'Service is temporarily unavailable. Please try again later.',
                timestamp: new Date().toISOString()
            });
        }
        
        const message = error.response?.data?.detail || 
            error.message || 'Unknown error occurred';
        
        if (error.response?.status === 401) {
            localStorage.removeItem('auth_token');
            window.location.href = '/login';
        }
        
        return Promise.reject({
            code: error.response?.status || 'NETWORK_ERROR',
            message,
            timestamp: new Date().toISOString()
        });
    }
);

// Content-related API calls
export const contentApi = {
    getRecommendations: async () => {
        const response = await api.get('/recommendations');
        return response.data;
    },
    
    getContent: async (contentId: string) => {
        const response = await api.get(`/content/${contentId}`);
        return response.data;
    },
    
    submitFeedback: async (contentId: string, feedback: any) => {
        const response = await api.post(`/recommendations/feedback`, {
            content_id: contentId,
            ...feedback
        });
        return response.data;
    },
    
    trackInteraction: async (contentId: string, type: string) => {
        const response = await api.post('/interactions', {
            content_id: contentId,
            type: type
        });
        return response.data;
    }
};

// User-related API calls
export const userApi = {
    login: async (email: string, password: string) => {
        const response = await api.post('/auth/token', 
            `username=${email}&password=${password}`,
            {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
        );
        return response.data;
    },
    
    register: async (userData: any) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },
    
    getProfile: async () => {
        const response = await api.get('/users/me');
        return response.data;
    },
    
    updatePreferences: async (preferences: any) => {
        const response = await api.put('/users/preferences', preferences);
        return response.data;
    }
}; 