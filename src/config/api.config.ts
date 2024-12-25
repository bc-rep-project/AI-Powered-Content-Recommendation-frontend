const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ai-recommendation-api.onrender.com';
const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://ai-powered-content-recommendation-frontend.vercel.app';

export const API_ENDPOINTS = {
  // Content endpoints
  recommendations: `${API_BASE_URL}/api/v1/recommendations`,
  explore: `${API_BASE_URL}/api/v1/content/explore`,
  search: `${API_BASE_URL}/api/v1/content/search`,
  favorites: `${API_BASE_URL}/api/v1/users/favorites`,
  
  // User settings
  settings: `${API_BASE_URL}/api/v1/users/settings`,
  
  // Health check
  health: `${API_BASE_URL}/health`,
  
  // Root
  root: `${API_BASE_URL}/`
} as const;

// Default headers for all requests
export const API_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Origin': FRONTEND_URL
};

// Default fetch options
export const DEFAULT_FETCH_OPTIONS: RequestInit = {
  credentials: 'include', // Include cookies for cross-origin requests
  headers: API_HEADERS,
  mode: 'cors' // Enable CORS
};

// FastAPI error response type
interface FastAPIError {
  detail: string;
}

// Fetch wrapper with default options
export const apiFetch = async <T>(
  url: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(url, {
      ...DEFAULT_FETCH_OPTIONS,
      ...options,
      headers: {
        ...DEFAULT_FETCH_OPTIONS.headers,
        ...options.headers
      }
    });

    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json().catch(() => null);
    } else {
      data = await response.text().catch(() => null);
    }

    if (!response.ok) {
      const error = {
        status: response.status,
        statusText: response.statusText,
        data: typeof data === 'object' ? data as FastAPIError : { detail: data || 'Unknown error occurred' }
      };
      console.error('API Error:', error);
      throw error;
    }

    return {
      success: true,
      data: data as T
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
    // Server responded with error
    switch (error.status) {
      case 0:
        return 'Unable to connect to the server. Please check your internet connection.';
      case 404:
        return error.data?.detail || 'The requested resource was not found';
      case 500:
        return error.data?.detail || 'Server error. Please try again later';
      default:
        return error.data?.detail || 'An unexpected error occurred';
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