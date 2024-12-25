const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ai-recommendation-api.onrender.com';
const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://ai-powered-content-recommendation-frontend.vercel.app';

export const API_ENDPOINTS = {
  // Auth endpoints
  register: `${API_BASE_URL}/api/v1/auth/register`,
  login: `${API_BASE_URL}/api/v1/auth/login`,
  googleAuth: `${API_BASE_URL}/api/v1/auth/google`,
  googleCallback: `${API_BASE_URL}/api/v1/auth/google/callback`,
  
  // Content endpoints
  recommendations: `${API_BASE_URL}/api/v1/recommendations`,
  explore: `${API_BASE_URL}/api/v1/content/explore`,
  search: `${API_BASE_URL}/api/v1/content/search`,
  favorites: `${API_BASE_URL}/api/v1/users/favorites`,
  
  // User settings
  settings: `${API_BASE_URL}/api/v1/users/settings`,
  
  // Health check
  health: `${API_BASE_URL}/health`
} as const;

export const AUTH_ENDPOINTS = {
  frontendGoogleAuth: '/auth/google',
  frontendGoogleCallback: '/api/auth/google/callback'
} as const;

// API response types
export interface User {
  email: string;
  username: string;
  picture: string | null;
  oauth_provider: string | null;
  id: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface RegisterResponse {
  message: string;
  email: string;
}

export interface RecommendationItem {
  id: string;
  title: string;
  description: string;
  content_id: string;
  score: number;
  category: string;
  image_url: string | null;
  metadata: {
    tags: string[];
    readTime: string;
  };
  created_at: string;
}

export interface RecommendationsResponse {
  items: RecommendationItem[];
  total: number;
  page: number;
  totalPages: number;
}

// Default headers for all requests
export const API_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Origin': FRONTEND_URL,
};

// Default fetch options
export const DEFAULT_FETCH_OPTIONS: RequestInit = {
  credentials: 'include',
  headers: API_HEADERS,
  mode: 'cors',
};

// Get auth headers with token
export const getAuthHeader = (token: string) => ({
  ...API_HEADERS,
  'Authorization': `Bearer ${token}`
});

// FastAPI error response type
interface FastAPIError {
  detail: string;
}

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

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const error = {
        status: response.status,
        statusText: response.statusText,
        data: data as FastAPIError || { detail: 'Unknown error occurred' },
      };
      console.error('API Error:', error);
      throw error;
    }

    return {
      success: true,
      data: data as T,
    };
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      console.error('Network error:', error);
      throw {
        status: 0,
        statusText: 'Network Error',
        data: { detail: 'Unable to connect to the server. Please check your internet connection.' }
      };
    }
    console.error('API fetch error:', error);
    throw error;
  }
};

// Error handling utilities
export const handleApiError = (error: any): string => {
  if (error.status) {
    switch (error.status) {
      case 0:
        return 'Unable to connect to the server. Please check your internet connection.';
      case 404:
        return error.data?.detail || 'The requested resource was not found';
      case 401:
        return error.data?.detail || 'Please login to access this feature';
      case 403:
        return error.data?.detail || 'You do not have permission to access this resource';
      case 500:
        return error.data?.detail || 'Server error. Please try again later';
      default:
        return error.data?.detail || 'An unexpected error occurred';
    }
  } else if (error.request) {
    return 'Unable to connect to the server. Please check your internet connection';
  } else {
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