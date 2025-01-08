import { API_ENDPOINTS, apiFetch } from '@/config/api.config';
import type { InteractionData } from '@/types';

class RecommendationService {
  async fetchInteractionHistory(): Promise<InteractionData[]> {
    try {
      const response = await apiFetch<InteractionData[]>(API_ENDPOINTS.recommendations);
      return response.data;
    } catch (error) {
      console.error('Error fetching interactions:', error);
      // Return mock data for development
      return [
        { date: '2024-01-01', interactions: 5 },
        { date: '2024-01-02', interactions: 8 },
        { date: '2024-01-03', interactions: 12 },
        { date: '2024-01-04', interactions: 7 },
        { date: '2024-01-05', interactions: 15 }
      ];
    }
  }
}

export const recommendationService = new RecommendationService(); 