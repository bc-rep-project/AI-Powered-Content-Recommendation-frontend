export const API_CONFIG = {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://ai-recommendation-api.onrender.com',
    endpoints: {
        register: '/api/v1/auth/register',
        login: '/api/v1/auth/login',
        recommendations: '/api/v1/recommendations',
        health: '/health',
        forgotPassword: '/api/v1/auth/forgot-password',
        resetPassword: '/api/v1/auth/reset-password'
    }
}; 