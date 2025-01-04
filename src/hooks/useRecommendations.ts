import { useState, useEffect } from 'react';
import { apiFetch } from '@/config/api.config';
import { API_ENDPOINTS } from '@/config/api.config';
import { Recommendation } from '@/types';

export function useRecommendations() {
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchRecommendations();
    }, []);

    const fetchRecommendations = async () => {
        try {
            setIsLoading(true);
            const response = await apiFetch<Recommendation[]>(API_ENDPOINTS.recommendations);
            setRecommendations(response.data || []);
        } catch (err) {
            setError('Failed to fetch recommendations');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return { recommendations, isLoading, error, refetch: fetchRecommendations };
} 