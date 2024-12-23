import { API_ENDPOINTS, API_HEADERS, getAuthHeader } from '../config/api.config';

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  // Add other fields as per your API response
}

export const recommendationsService = {
  async getRecommendations(token: string): Promise<Recommendation[]> {
    const response = await fetch(API_ENDPOINTS.recommendations, {
      method: 'GET',
      headers: {
        ...API_HEADERS,
        ...getAuthHeader(token),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch recommendations');
    }

    return response.json();
  },
}; 