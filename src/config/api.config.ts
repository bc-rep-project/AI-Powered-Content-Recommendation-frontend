export const API_ENDPOINTS = {
  explore: '/api/explore',
  favorites: '/api/favorites',
  recommendations: '/api/recommendations',
  login: '/api/login',
  register: '/api/register',
  settings: '/api/settings'
};

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export const handleApiError = (error: any): string => {
  if (error.response) {
    return error.response.data?.message || 'An error occurred';
  }
  return error.message || 'Network error';
};

export const apiFetch = async <T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    throw error;
  }
}; 