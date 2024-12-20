export interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  role: UserRole;
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

export interface Recommendation {
  title: string;
  description: string;
  score: number;
  image_url?: string;
  category?: string;
  content_id: string;
  metadata?: Record<string, any>;
}

export interface UserStats {
  totalInteractions: number;
  recommendationAccuracy: number;
  contentViewed: number;
}

export interface InteractionData {
  date: string;
  interactions: number;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
}

export interface TrendingStats {
  totalViews: number;
  totalLikes: number;
  trendingCategories: string[];
}

export interface TrendingData {
  stats: TrendingStats;
  today: Recommendation[];
  thisWeek: Recommendation[];
  thisMonth: Recommendation[];
}

export interface Collection {
  id: string;
  name: string;
  items: Recommendation[];
}

export interface FavoritesData {
  recent: Recommendation[];
  collections: Collection[];
}

export interface UserSettings {
  email: string;
  notificationsEnabled: boolean;
  recommendationFrequency: string;
  contentPreferences: string[];
  language: string;
}

export interface RecommendationResponse {
  id: number;
  content_id: string;
  title: string;
  description: string;
  score: number;
  image_url?: string;
  category?: string;
  metadata?: Record<string, any>;
}

export interface InteractionData {
  timestamp: string;
  interactionCount: number;
}

export interface ApiEndpoints {
  recommendations: string;
  interactions: string;
  discover: string;
  favorites: string;
  collections: string;
  auth: {
    login: string;
    register: string;
    refresh: string;
  };
  user: {
    profile: string;
    stats: string;
    settings: string;
  };
} 