export const API_ENDPOINTS = {
  recommendations: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/recommendations`,
  explore: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/content/explore`,
  search: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/content/search`,
  favorites: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/favorites`,
  settings: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/settings`,
  health: `${process.env.NEXT_PUBLIC_API_URL}/health`,
  updateContent: (id: string) => `${process.env.NEXT_PUBLIC_API_URL}/api/v1/content/${id}`,
};

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
  statusText: string;
}

export async function apiFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...DEFAULT_HEADERS,
        ...options.headers,
      },
      credentials: 'include', // This enables sending cookies
    });

    let data;
    try {
      data = await response.json();
    } catch (e) {
      data = null;
    }

    if (!response.ok) {
      // Use dummy data for 401 errors in development
      if (response.status === 401 && process.env.NODE_ENV === 'development') {
        return { data: null as any, status: 200, statusText: 'OK' };
      }
      
      throw {
        data,
        status: response.status,
        statusText: response.statusText,
      };
    }

    return {
      data,
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error: any) {
    console.error('API Error:', error);
    throw {
      data: error.data || { detail: 'Unknown error occurred' },
      status: error.status || 500,
      statusText: error.statusText || '',
    };
  }
}

export function handleApiError(error: any): string {
  if (error?.data?.detail) {
    return error.data.detail;
  }
  if (error?.message) {
    return error.message;
  }
  return 'An unexpected error occurred. Please try again later.';
} 