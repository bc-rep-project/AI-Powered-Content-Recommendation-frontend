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

// Add interfaces for recommendation parameters
interface RecommendationParams {
  page?: number;
  limit?: number;
  category?: string;
  minScore?: number;
}

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json'
  },
  withCredentials: false
});

// Remove the default Content-Type header as it will be set automatically for FormData
delete apiClient.defaults.headers['Content-Type'];

// Add request interceptor for debugging
apiClient.interceptors.request.use(request => {
  console.log('Request:', request.url);
  return request;
});

// Add an interceptor to include the auth token
apiClient.interceptors.request.use(request => {
  const token = localStorage.getItem('token');
  if (token) {
    request.headers['Authorization'] = `Bearer ${token}`;
  }
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
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    const response = await apiClient.post(API_ENDPOINTS.auth.login, formData);
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
  recommendations: '/api/v1/recommendations',
  interactions: '/api/v1/interactions',
  discover: '/api/v1/discover',
  favorites: '/api/v1/favorites',
  collections: '/api/v1/collections',
  trending: '/api/v1/trending',
  auth: {
    login: '/api/v1/auth/login',
    register: '/api/v1/auth/register',
    refresh: '/api/v1/auth/refresh',
    validate: '/api/v1/auth/validate',
    forgotPassword: '/api/v1/auth/forgot-password',
    resetPassword: '/api/v1/auth/reset-password',
    google: '/api/v1/auth/google',
    github: '/api/v1/auth/github',
    facebook: '/api/v1/auth/facebook'
  },
  user: {
    profile: '/api/v1/user/profile',
    stats: '/api/v1/user/stats',
    settings: '/api/v1/user/settings'
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
  async fetchRecommendations(params?: RecommendationParams): Promise<PaginatedResponse<Recommendation>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.category) queryParams.append('category', params.category);
    if (params?.minScore) queryParams.append('min_score', params.minScore.toString());

    const url = `${API_ENDPOINTS.recommendations}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiClient.get(url);
    return {
      items: response.data.items.map(mapRecommendationResponse),
      total: response.data.total,
      page: response.data.page,
      totalPages: response.data.totalPages
    };
  },

  async getRecommendationById(id: string): Promise<Recommendation> {
    const response = await apiClient.get(`${API_ENDPOINTS.recommendations}/${id}`);
    return mapRecommendationResponse(response.data);
  },

  async getRecommendationsByCategory(category: string): Promise<Recommendation[]> {
    return this.fetchRecommendations({ category }).then(response => response.items);
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