export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export const API_ENDPOINTS = {
  recommendations: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/recommendations`,
  explore: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/content/explore`,
  search: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/content/search`,
  favorites: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/favorites`,
  settings: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/settings`,
  health: `${process.env.NEXT_PUBLIC_API_URL}/health`,
  updateContent: (id: string) => `${process.env.NEXT_PUBLIC_API_URL}/api/v1/content/${id}`,
  trainModel: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/train`,
  // Auth endpoints
  register: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/register`,
  login: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`,
  me: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/me`,
};

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

export const getAuthHeader = (token: string) => ({
  'Authorization': `Bearer ${token}`
});

export async function apiFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    // For development, return dummy data for certain endpoints
    if (process.env.NODE_ENV === 'development') {
      if (url.includes('/recommendations')) {
        return {
          data: require('../utils/dummyData').dummyContent as T,
          status: 200,
          message: 'OK'
        };
      }
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...DEFAULT_HEADERS,
        ...options.headers,
      },
      credentials: 'include',
    });

    let data;
    try {
      data = await response.json();
    } catch (e) {
      data = null;
    }

    // Handle specific error cases
    if (!response.ok) {
      switch (response.status) {
        case 401:
          // Return dummy data in development
          if (process.env.NODE_ENV === 'development') {
            return {
              data: require('../utils/dummyData').dummyContent as T,
              status: 200,
              message: 'OK'
            };
          }
          throw {
            data: { detail: 'Please log in to access this resource' },
            status: 401,
            message: 'Unauthorized'
          };
        case 405:
          throw {
            data: { detail: 'This operation is not supported' },
            status: 405,
            message: 'Method Not Allowed'
          };
        default:
          throw {
            data,
            status: response.status,
            message: response.statusText,
          };
      }
    }

    return {
      data,
      status: response.status,
      message: response.statusText,
    };
  } catch (error: any) {
    console.error('API Error:', error);
    // Return dummy data in development for any error
    if (process.env.NODE_ENV === 'development') {
      return {
        data: require('../utils/dummyData').dummyContent as T,
        status: 200,
        message: 'OK'
      };
    }
    throw {
      data: error.data || { detail: 'Unknown error occurred' },
      status: error.status || 500,
      message: error.statusText || '',
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

export async function trainModelWithDummyData() {
  interface DummyDataItem {
    id: string;
    title: string;
    description: string;
    category: string;
    tags: string[];
    rating?: number;
  }

  const dummyData = require('../utils/dummyData').dummyContent as DummyDataItem[];
  
  try {
    const response = await apiFetch(API_ENDPOINTS.trainModel, {
      method: 'POST',
      body: JSON.stringify({
        training_data: dummyData.map((item: DummyDataItem) => ({
          content_id: item.id,
          title: item.title,
          description: item.description,
          category: item.category,
          tags: item.tags,
          rating: item.rating || 0,
          interactions: {
            views: Math.floor(Math.random() * 1000),
            likes: Math.floor(Math.random() * 100),
            shares: Math.floor(Math.random() * 50)
          }
        }))
      })
    });

    return response;
  } catch (error) {
    console.error('Failed to train model:', error);
    throw error;
  }
} 