const API_BASE_URL = 'https://ai-recommendation-api.onrender.com/api/v1';

export const API_ENDPOINTS = {
  // Auth endpoints
  register: `${API_BASE_URL}/auth/register`,
  login: `${API_BASE_URL}/auth/login`,
  
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
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
  'Accept': 'application/json',
}); 