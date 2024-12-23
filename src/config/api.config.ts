const API_VERSION = '/api/v1';

export const API_ENDPOINTS = {
  // Auth endpoints
  register: `${API_VERSION}/auth/register`,
  login: `${API_VERSION}/auth/login`,
  
  // Content endpoints
  recommendations: `${API_VERSION}/recommendations`,
  
  // Health check
  health: '/health'
} as const;

export const API_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

export const getAuthHeader = (token: string) => ({
  Authorization: `Bearer ${token}`
}); 