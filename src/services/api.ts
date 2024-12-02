import axios from 'axios';
import {
  Recommendation,
  UserStats,
  InteractionData,
  AuthResponse,
  User,
  TrendingData,
  FavoritesData,
  UserSettings,
} from '../types';

export const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication
export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/token', {
    username: email,
    password,
  });
  return response.data;
};

export const register = async (userData: {
  email: string;
  password: string;
  username: string;
}): Promise<User> => {
  const response = await api.post<User>('/auth/register', userData);
  return response.data;
};

// Recommendations
export const fetchRecommendations = async (): Promise<Recommendation[]> => {
  const response = await api.post<Recommendation[]>('/recommendations', {
    n_recommendations: 10,
  });
  return response.data;
};

export const fetchDiscoverContent = async ({
  searchQuery,
  category,
}: {
  searchQuery: string;
  category: string;
}): Promise<Recommendation[]> => {
  const response = await api.get<Recommendation[]>('/discover', {
    params: { q: searchQuery, category },
  });
  return response.data;
};

export const fetchTrendingContent = async (): Promise<TrendingData> => {
  const response = await api.get<TrendingData>('/trending');
  return response.data;
};

// Favorites
export const fetchFavorites = async (): Promise<FavoritesData> => {
  const response = await api.get<FavoritesData>('/favorites');
  return response.data;
};

export const createCollection = async (name: string): Promise<void> => {
  await api.post('/favorites/collections', { name });
};

export const addToCollection = async (
  collectionId: string,
  contentId: string
): Promise<void> => {
  await api.post(`/favorites/collections/${collectionId}/items`, {
    content_id: contentId,
  });
};

// User data
export const fetchUserStats = async (): Promise<UserStats> => {
  const response = await api.get<UserStats>('/users/me/stats');
  return response.data;
};

export const fetchInteractionHistory = async (): Promise<InteractionData[]> => {
  const response = await api.get<InteractionData[]>('/users/me/interactions');
  return response.data;
};

export const recordInteraction = async (interaction: {
  content_id: string;
  interaction_type: string;
}): Promise<void> => {
  await api.post('/interactions', interaction);
};

// Settings
export const updateUserSettings = async (
  settings: UserSettings
): Promise<void> => {
  await api.put('/users/me/settings', settings);
}; 