import { useState, useEffect } from 'react';
import apiClient from '../services/api';
import { API_ENDPOINTS } from '../config/api';
import { Recommendation } from '../types';

export const useRecommendations = () => {
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchRecommendations = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await apiClient.get(API_ENDPOINTS.recommendations);
            setRecommendations(response.data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch recommendations'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecommendations();
    }, []);

    return { recommendations, loading, error, refetch: fetchRecommendations };
}; 