const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ai-recommendation-api.onrender.com';
const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://ai-powered-content-recommendation-frontend.vercel.app';

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

export const AUTH_ENDPOINTS = {
  frontendGoogleAuth: '/auth/google',
  frontendGoogleCallback: '/api/auth/google/callback'
} as const;

// Default headers for all requests
export const API_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Origin': FRONTEND_URL,
};

// Default fetch options
export const DEFAULT_FETCH_OPTIONS: RequestInit = {
  credentials: 'include', // Include cookies for cross-origin requests
  headers: API_HEADERS,
  mode: 'cors', // Enable CORS
};

// Get auth headers with token
export const getAuthHeader = (token: string) => ({
  ...API_HEADERS,
  'Authorization': `Bearer ${token}`
});

// Fetch wrapper with default options and optional auth
export const apiFetch = async <T>(
  url: string, 
  options: RequestInit = {},
  token?: string
): Promise<ApiResponse<T>> => {
  try {
    const headers = token 
      ? { ...DEFAULT_FETCH_OPTIONS.headers, ...getAuthHeader(token) }
      : DEFAULT_FETCH_OPTIONS.headers;

    const response = await fetch(url, {
      ...DEFAULT_FETCH_OPTIONS,
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw {
        status: response.status,
        statusText: response.statusText,
        data: errorData,
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API fetch error:', error);
    throw error;
  }
};

// Error handling utilities
export const handleApiError = (error: any): string => {
  if (error.status) {
    // Server responded with error
    switch (error.status) {
      case 404:
        return 'The requested resource was not found';
      case 401:
        return 'Please login to access this feature';
      case 403:
        return 'You do not have permission to access this resource';
      case 500:
        return 'Server error. Please try again later';
      default:
        return error.data?.message || 'An unexpected error occurred';
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