import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchRecommendations = async () => {
  const response = await api.post('/api/v1/recommendations', {
    n_recommendations: 10,
  });
  return response.data;
};

export const fetchUserStats = async () => {
  const response = await api.get('/api/v1/users/me/stats');
  return response.data;
};

export const fetchInteractionHistory = async () => {
  const response = await api.get('/api/v1/users/me/interactions');
  return response.data;
};

export const recordInteraction = async (interaction: {
  content_id: string;
  interaction_type: string;
}) => {
  const response = await api.post('/api/v1/interactions', interaction);
  return response.data;
};

export const login = async (email: string, password: string) => {
  const response = await api.post('/api/v1/auth/token', {
    username: email,
    password,
  });
  return response.data;
};

export const register = async (userData: {
  email: string;
  password: string;
  username: string;
}) => {
  const response = await api.post('/api/v1/auth/register', userData);
  return response.data;
}; 