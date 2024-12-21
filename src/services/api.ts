import axios from 'axios';
import type { User, RecommendationResponse, InteractionData, AuthResponse, UserStats, Recommendation, FavoritesData, Collection, UserSettings, TrendingData } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

console.log('API_BASE_URL:', API_BASE_URL);

// Add DiscoverParams interface
interface DiscoverParams {
  searchQuery?: string;
  category?: string;
}

interface CreateCollectionParams {
  name: string;
  items?: string[];
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: false
});

// Add request interceptor for debugging
apiClient.interceptors.request.use(request => {
  console.log('Request:', request.url);
  return request;
});

// Mapping function
const mapRecommendationResponse = (response: RecommendationResponse): Recommendation => ({
  title: response.title,
  description: response.description,
  score: response.score,
  image_url: response.image_url,
  category: response.category,
  content_id: response.content_id,
  metadata: response.metadata
});

// Auth Service
export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post(API_ENDPOINTS.auth.login, {
      email,
      password
    });
    return response.data;
  },

  async register(userData: {
    username: string;
    email: string;
    password: string;
    name?: string;
  }): Promise<AuthResponse> {
    const response = await apiClient.post(API_ENDPOINTS.auth.register, userData);
    return response.data;
  },

  async refreshToken(): Promise<AuthResponse> {
    const response = await apiClient.post(API_ENDPOINTS.auth.refresh);
    return response.data;
  },

  async validateToken(token: string): Promise<User> {
    const response = await apiClient.post(API_ENDPOINTS.auth.validate, { token });
    return response.data;
  },

  async forgotPassword(email: string): Promise<void> {
    await apiClient.post(API_ENDPOINTS.auth.forgotPassword, { email });
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await apiClient.post(API_ENDPOINTS.auth.resetPassword, {
      token,
      password: newPassword
    });
  },

  async loginWithGoogle(): Promise<AuthResponse> {
    const response = await apiClient.get(API_ENDPOINTS.auth.google);
    return response.data;
  },

  async loginWithGithub(): Promise<AuthResponse> {
    const response = await apiClient.get(API_ENDPOINTS.auth.github);
    return response.data;
  },

  async loginWithFacebook(): Promise<AuthResponse> {
    const response = await apiClient.get(API_ENDPOINTS.auth.facebook);
    return response.data;
  }
};

// API Endpoints
export const API_ENDPOINTS = {
  recommendations: '/recommendations',
  interactions: '/interactions',
  discover: '/discover',
  favorites: '/favorites',
  collections: '/collections',
  trending: '/trending',
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    refresh: '/auth/refresh',
    validate: '/auth/validate',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    google: '/auth/google',
    github: '/auth/github',
    facebook: '/auth/facebook'
  },
  user: {
    profile: '/user/profile',
    stats: '/user/stats',
    settings: '/user/settings'
  }
};

// User Service
export const userService = {
  async fetchUserStats(): Promise<UserStats> {
    const response = await apiClient.get(API_ENDPOINTS.user.stats);
    return response.data;
  },

  async updateSettings(settings: UserSettings): Promise<UserSettings> {
    const response = await apiClient.put(API_ENDPOINTS.user.settings, settings);
    return response.data;
  },

  async getSettings(): Promise<UserSettings> {
    const response = await apiClient.get(API_ENDPOINTS.user.settings);
    return response.data;
  }
};

// Recommendation Service
export const recommendationService = {
  async getRecommendations(userId: string): Promise<Recommendation[]> {
    const response = await apiClient.get(`${API_ENDPOINTS.recommendations}/${userId}`);
    return response.data.map(mapRecommendationResponse);
  },

  async fetchInteractionHistory(): Promise<InteractionData[]> {
    const response = await apiClient.get(`${API_ENDPOINTS.interactions}/history`);
    return response.data;
  },

  async trackInteraction(contentId: string, type: 'view' | 'like'): Promise<void> {
    await apiClient.post(API_ENDPOINTS.interactions, {
      contentId,
      type,
      timestamp: new Date().toISOString()
    });
  },

  async fetchRecommendations(): Promise<Recommendation[]> {
    const response = await apiClient.get(API_ENDPOINTS.recommendations);
    return response.data.map(mapRecommendationResponse);
  },

  async fetchDiscoverContent(params?: DiscoverParams): Promise<Recommendation[]> {
    const queryParams = new URLSearchParams();
    if (params?.searchQuery) {
      queryParams.append('search', params.searchQuery);
    }
    if (params?.category) {
      queryParams.append('category', params.category);
    }

    const url = `${API_ENDPOINTS.discover}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiClient.get(url);
    return response.data.map(mapRecommendationResponse);
  }
};

// Favorites Service
export const favoritesService = {
  async fetchFavorites(): Promise<FavoritesData> {
    const response = await apiClient.get(API_ENDPOINTS.favorites);
    return {
      ...response.data,
      recent: response.data.recent.map(mapRecommendationResponse),
      collections: response.data.collections.map((collection: any) => ({
        ...collection,
        items: collection.items.map(mapRecommendationResponse)
      }))
    };
  },

  async createCollection(params: CreateCollectionParams): Promise<Collection> {
    const response = await apiClient.post(API_ENDPOINTS.collections, params);
    return {
      ...response.data,
      items: response.data.items.map(mapRecommendationResponse)
    };
  },

  async addToFavorites(contentId: string): Promise<void> {
    await apiClient.post(`${API_ENDPOINTS.favorites}/${contentId}`);
  },

  async removeFromFavorites(contentId: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.favorites}/${contentId}`);
  }
};

// Add Trending Service
export const trendingService = {
  async fetchTrending(): Promise<TrendingData> {
    const response = await apiClient.get(API_ENDPOINTS.trending);
    return {
      ...response.data,
      today: response.data.today.map(mapRecommendationResponse),
      thisWeek: response.data.thisWeek.map(mapRecommendationResponse),
      thisMonth: response.data.thisMonth.map(mapRecommendationResponse)
    };
  }
};

// Export convenience functions with proper types
export const register = authService.register;
export const fetchRecommendations = recommendationService.fetchRecommendations;
export const fetchUserStats = userService.fetchUserStats;
export const fetchDiscoverContent = (params?: DiscoverParams) => 
  recommendationService.fetchDiscoverContent(params);
export const fetchFavorites = favoritesService.fetchFavorites;
export const createCollection = favoritesService.createCollection;
export const updateUserSettings = userService.updateSettings;
export const fetchTrendingContent = trendingService.fetchTrending;

// Export types
export type { 
  User, 
  RecommendationResponse, 
  InteractionData, 
  AuthResponse, 
  UserStats, 
  DiscoverParams,
  CreateCollectionParams,
  UserSettings,
  TrendingData
};

// Export default client
export default apiClient; 