const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ai-recommendation-api.onrender.com/api/v1';

export const API_ENDPOINTS = {
  // Auth endpoints
  register: `${API_BASE_URL}/auth/register`,
  login: `${API_BASE_URL}/auth/login`,
  googleAuth: `${API_BASE_URL}/auth/google`,
  googleCallback: `${API_BASE_URL}/auth/google/callback`,
  
  // Content endpoints
  recommendations: `${API_BASE_URL}/recommendations`,
  explore: `${API_BASE_URL}/content/explore`,
  search: `${API_BASE_URL}/content/search`,
  favorites: `${API_BASE_URL}/user/favorites`,
  
  // User settings
  settings: `${API_BASE_URL}/user/settings`,
  
  // Health check
  health: `${API_BASE_URL}/health`
} as const;

export const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://ai-powered-content-recommendation-frontend.vercel.app';

export const AUTH_ENDPOINTS = {
  frontendGoogleAuth: '/auth/google',
  frontendGoogleCallback: '/api/auth/google/callback'
} as const;

export const API_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

export const getAuthHeader = (token: string) => ({
  Authorization: `Bearer ${token}`
}); 