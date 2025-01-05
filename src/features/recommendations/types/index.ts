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

export type RecommendationFilter = {
  category?: string;
  tags?: string[];
  rating?: number;
} 