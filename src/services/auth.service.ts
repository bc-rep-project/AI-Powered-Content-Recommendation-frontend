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
      headers: {
        ...API_HEADERS,
      },
      body: JSON.stringify({
        username: data.username,
        email: data.email,
        password: data.password
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || 'Registration failed');
    }

    return response.json();
  },

  async login(loginData: LoginData): Promise<AuthResponse> {
    try {
      // Convert the form data to match FastAPI's OAuth2 password flow
      const formData = new URLSearchParams();
      formData.append('username', loginData.username); // Using email as username
      formData.append('password', loginData.password);

      const response = await fetch(API_ENDPOINTS.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        if (response.status === 401) {
          throw new Error('Invalid email or password');
        }
        throw new Error(errorData?.detail || 'Login failed');
      }

      const responseData = await response.json();
      if (responseData.access_token) {
        localStorage.setItem('auth_token', responseData.access_token);
      }
      return responseData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
}; 