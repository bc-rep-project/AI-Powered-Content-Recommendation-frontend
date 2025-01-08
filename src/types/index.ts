export interface InteractionData {
  date: string;
  interactions: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  preferences?: {
    theme?: 'light' | 'dark';
    notifications?: boolean;
  };
}

export interface ApiError {
  message: string;
  code?: string;
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