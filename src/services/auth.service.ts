import { ApiService } from '@/lib/api';
import type { AuthResponse, LoginCredentials, User } from '@/types';

class AuthService {
  private api = new ApiService();

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/login', credentials);
    return response;
  }

  async validateToken(token: string): Promise<User> {
    const response = await this.api.get<User>('/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response;
  }

  async loginWithProvider(provider: 'google' | 'github' | 'facebook'): Promise<void> {
    window.location.href = `/api/auth/${provider}`;
  }
}

export const authService = new AuthService();