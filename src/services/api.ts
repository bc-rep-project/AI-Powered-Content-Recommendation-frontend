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

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Authentication
export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/api/v1/auth/token', {
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
  const response = await api.post<User>('/api/v1/auth/register', userData);
  return response.data;
};

// Recommendations
export const fetchRecommendations = async (): Promise<Recommendation[]> => {
  const response = await api.post<Recommendation[]>('/api/v1/recommendations', {
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
  const response = await api.get<Recommendation[]>('/api/v1/discover', {
    params: { q: searchQuery, category },
  });
  return response.data;
};

export const fetchTrendingContent = async (): Promise<TrendingData> => {
  const response = await api.get<TrendingData>('/api/v1/trending');
  return response.data;
};

// Favorites
export const fetchFavorites = async (): Promise<FavoritesData> => {
  const response = await api.get<FavoritesData>('/api/v1/favorites');
  return response.data;
};

export const createCollection = async (name: string): Promise<void> => {
  await api.post('/api/v1/favorites/collections', { name });
};

export const addToCollection = async (
  collectionId: string,
  contentId: string
): Promise<void> => {
  await api.post(`/api/v1/favorites/collections/${collectionId}/items`, {
    content_id: contentId,
  });
};

// User data
export const fetchUserStats = async (): Promise<UserStats> => {
  const response = await api.get<UserStats>('/api/v1/users/me/stats');
  return response.data;
};

export const fetchInteractionHistory = async (): Promise<InteractionData[]> => {
  const response = await api.get<InteractionData[]>('/api/v1/users/me/interactions');
  return response.data;
};

export const recordInteraction = async (interaction: {
  content_id: string;
  interaction_type: string;
}): Promise<void> => {
  await api.post('/api/v1/interactions', interaction);
};

// Settings
export const updateUserSettings = async (
  settings: UserSettings
): Promise<void> => {
  await api.put('/api/v1/users/me/settings', settings);
}; 