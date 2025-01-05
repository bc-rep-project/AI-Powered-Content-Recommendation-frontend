import { ApiResponse } from '@/types/api';
import { Recommendation } from '../types';
import { apiFetch } from '@/config/api.config';

export const recommendationsApi = {
  getRecommendations: async (token: string): Promise<ApiResponse<Recommendation[]>> => {
    return apiFetch('/api/recommendations', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },
  
  getRatedRecommendations: async (token: string): Promise<ApiResponse<Recommendation[]>> => {
    return apiFetch('/api/recommendations/rated', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}; 