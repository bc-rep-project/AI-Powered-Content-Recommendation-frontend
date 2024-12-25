export const API_BASE_URL = 'https://ai-recommendation-api.onrender.com/api/v1';

// Frontend URLs for OAuth flow
export const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  // Auth endpoints
  register: `${API_BASE_URL}/auth/register`,
  login: `${API_BASE_URL}/auth/login`,
  googleAuth: `${API_BASE_URL}/auth/google`,
  googleCallback: `${API_BASE_URL}/auth/google/callback`,
  
  // Content endpoints
  recommendations: `${API_BASE_URL}/recommendations`,
  
  // Health check
  health: 'https://ai-recommendation-api.onrender.com/health'
} as const;

export const API_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

export const getAuthHeader = (token: string) => ({
  Authorization: `Bearer ${token}`
}); 