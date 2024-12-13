export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ai-recommendation-api.onrender.com';

export const API_ENDPOINTS = {
    recommendations: '/recommendations',
    interactions: '/interactions',
    auth: {
        login: '/auth/login',
        register: '/auth/register',
        refresh: '/auth/refresh'
    },
    user: {
        profile: '/users/me',
        preferences: '/users/preferences'
    }
}; 