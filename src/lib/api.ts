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
    response => {
        // Handle empty responses
        if (!response.data && response.status !== 204) {
            return Promise.reject({
                code: 'EMPTY_RESPONSE',
                message: 'Server returned an empty response',
                timestamp: new Date().toISOString()
            });
        }
        return response;
    },
    error => {
        // Handle network errors
        if (!error.response) {
            return Promise.reject({
                code: 'NETWORK_ERROR',
                message: 'Network error occurred',
                timestamp: new Date().toISOString()
            });
        }

        // Handle service unavailable
        if (error.response.status === 503) {
            console.error('Service temporarily unavailable');
            return Promise.reject({
                code: 'SERVICE_UNAVAILABLE',
                message: 'Service is temporarily unavailable. Please try again later.',
                timestamp: new Date().toISOString()
            });
        }
        
        // Handle authentication errors
        if (error.response.status === 401) {
            localStorage.removeItem('auth_token');
            window.location.href = '/login';
            return Promise.reject({
                code: 'UNAUTHORIZED',
                message: 'Please log in to continue',
                timestamp: new Date().toISOString()
            });
        }

        // Handle other errors
        const message = error.response?.data?.detail || 
            error.message || 'Unknown error occurred';
        
        return Promise.reject({
            code: error.response?.status || 'UNKNOWN_ERROR',
            message,
            timestamp: new Date().toISOString()
        });
    }
);

// Content-related API calls
export const contentApi = {
    getRecommendations: async () => {
        try {
            const response = await api.get('/recommendations');
            return response.data || { recommendations: [] }; // Provide default value
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            return { recommendations: [] }; // Return empty recommendations on error
        }
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