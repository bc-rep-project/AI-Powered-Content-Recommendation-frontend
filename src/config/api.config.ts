const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ai-recommendation-api.onrender.com/api/v1';

export const API_ENDPOINTS = {
  // Auth endpoints
  register: `${API_BASE_URL}/auth/register`,
  login: `${API_BASE_URL}/auth/login`,
  googleAuth: `${API_BASE_URL}/auth/google`,
  googleCallback: `${API_BASE_URL}/auth/google/callback`,
  
  // Content endpoints
  recommendations: `${API_BASE_URL}/recommendations`,
  explore: `${API_BASE_URL}/recommendations/explore`,
  search: `${API_BASE_URL}/recommendations/search`,
  favorites: `${API_BASE_URL}/user/favorites`,
  
  // User settings
  settings: `${API_BASE_URL}/user/settings`,
  
  // Health check
  health: `${API_BASE_URL}/health`
} as const;

export const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://ai-powered-content-recommendation-frontend.vercel.app';

export const AUTH_ENDPOINTS = {
  frontendGoogleAuth: '/auth/google',
  frontendGoogleCallback: '/api/auth/google/callback'
} as const;

export const API_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

export const getAuthHeader = (token: string) => ({
  Authorization: `Bearer ${token}`
});

// Error handling utilities
export const handleApiError = (error: any): string => {
  if (error.response) {
    // Server responded with error
    switch (error.response.status) {
      case 404:
        return 'The requested resource was not found';
      case 401:
        return 'Please login to access this feature';
      case 403:
        return 'You do not have permission to access this resource';
      case 500:
        return 'Server error. Please try again later';
      default:
        return error.response.data?.message || 'An unexpected error occurred';
    }
  } else if (error.request) {
    // Request made but no response
    return 'Unable to connect to the server. Please check your internet connection';
  } else {
    // Error setting up request
    return 'An error occurred while processing your request';
  }
};

// API response type
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
} 