import { useState, useEffect } from 'react';
import { Recommendation } from '../types';
import { recommendationsApi } from '../api/recommendationsApi';
import { useAuth } from '@/features/auth/hooks/useAuth';

export const useRecommendations = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const fetchRecommendations = async () => {
    try {
      setIsLoading(true);
      const response = await recommendationsApi.getRecommendations(token);
      setRecommendations(response.data);
    } catch (err) {
      setError('Failed to fetch recommendations');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [token]);

  return { recommendations, isLoading, error, refetch: fetchRecommendations };
}; 