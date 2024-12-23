import { API_CONFIG } from '../config/api';
import { AuthResponse, RegisterData } from '../types/auth';
import { RecommendationsResponse, ApiResponse } from '../types/api';
import { retry } from '@/utils/retry';

class ApiService {
    private baseUrl: string;
    
    constructor() {
        this.baseUrl = API_CONFIG.baseUrl;
    }

    async register(userData: RegisterData): Promise<{ message: string }> {
        const response = await fetch(`${this.baseUrl}${API_CONFIG.endpoints.register}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });
        return this.handleResponse(response);
    }

    async login(email: string, password: string): Promise<AuthResponse> {
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);

        const response = await fetch(`${this.baseUrl}${API_CONFIG.endpoints.login}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData
        });
        return this.handleResponse(response);
    }

    async getRecommendations(): Promise<RecommendationsResponse> {
        return retry(async () => {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No authentication token');

            const response = await fetch(`${this.baseUrl}${API_CONFIG.endpoints.recommendations}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            
            return this.handleResponse<RecommendationsResponse>(response);
        }, {
            maxAttempts: 3,
            delayMs: 1000,
            backoff: true
        });
    }

    async checkHealth() {
        const response = await fetch(`${this.baseUrl}${API_CONFIG.endpoints.health}`);
        return this.handleResponse(response);
    }

    async requestPasswordReset(email: string): Promise<{ message: string }> {
        const response = await fetch(`${this.baseUrl}${API_CONFIG.endpoints.forgotPassword}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
        });
        return this.handleResponse(response);
    }

    async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
        const response = await fetch(`${this.baseUrl}${API_CONFIG.endpoints.resetPassword}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token, new_password: newPassword })
        });
        return this.handleResponse(response);
    }

    private async handleResponse<T>(response: Response): Promise<T> {
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.detail || 'Request failed');
        }
        return data as T;
    }
}

export const apiService = new ApiService(); 