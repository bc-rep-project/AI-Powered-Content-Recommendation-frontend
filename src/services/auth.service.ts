import { API_ENDPOINTS, API_HEADERS } from '../config/api.config';

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export const authService = {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch(API_ENDPOINTS.register, {
      method: 'POST',
      headers: API_HEADERS,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    return response.json();
  },

  async login(data: LoginData): Promise<AuthResponse> {
    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('password', data.password);

    const response = await fetch(API_ENDPOINTS.login, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    return response.json();
  },
}; 