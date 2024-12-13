export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

export interface Recommendation {
  content_id: string;
  title: string;
  description: string;
  score: number;
  image_url?: string;
  metadata?: Record<string, any>;
  category?: string;
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
  access_token: string;
  refresh_token: string;
  user: User;
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