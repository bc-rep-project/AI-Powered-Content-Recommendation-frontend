import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor for authentication
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

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
    }
};

// User-related API calls
export const userApi = {
    login: async (email: string, password: string) => {
        const response = await api.post('/auth/login', { email, password });
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