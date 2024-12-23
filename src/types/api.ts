import { Recommendation } from './recommendation';

export interface ApiResponse<T> {
    data: T;
    message?: string;
    error?: string;
}

export interface RecommendationsResponse {
    recommendations: Recommendation[];
} 