export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  role: UserRole;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
}

export interface InteractionData {
  date: string;
  interactions: number;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
  rating?: number;
  tags: string[];
  createdAt: string;
} 