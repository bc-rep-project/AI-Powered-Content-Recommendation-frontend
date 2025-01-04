import { ApiService } from '@/lib/api';
import type { InteractionData } from '@/types';

class RecommendationService {
  private api = new ApiService();

  async fetchInteractionHistory(): Promise<InteractionData[]> {
    return this.api.get<InteractionData[]>('/api/recommendations/interactions');
  }
}

export const recommendationService = new RecommendationService(); 