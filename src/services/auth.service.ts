import { API_ENDPOINTS, API_HEADERS } from '../config/api.config';

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: {
    email: string;
    username: string;
    picture?: string;
  };
}

export const authService = {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch(API_ENDPOINTS.register, {
      method: 'POST',
      headers: API_HEADERS,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Registration failed');
    }

    return response.json();
  },

  async login(data: LoginData): Promise<AuthResponse> {
    const formData = new URLSearchParams();
    formData.append('username', data.email);
    formData.append('password', data.password);

    const response = await fetch(API_ENDPOINTS.login, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }

    const authData = await response.json();
    localStorage.setItem('auth_token', authData.access_token);
    return authData;
  },

  async loginWithGoogle(): Promise<void> {
    const popup = window.open(
      `${API_ENDPOINTS.googleAuth}?redirect_uri=${encodeURIComponent(window.location.origin + '/auth/google/callback')}`,
      'Google Sign In',
      'width=500,height=600'
    );

    if (!popup) {
      throw new Error('Failed to open popup window');
    }

    return new Promise((resolve, reject) => {
      const checkPopup = setInterval(() => {
        try {
          // Check if popup is closed
          if (!popup || popup.closed) {
            clearInterval(checkPopup);
            reject(new Error('Authentication cancelled'));
          }

          // Check if we received the token
          const token = localStorage.getItem('auth_token');
          if (token) {
            clearInterval(checkPopup);
            popup.close();
            resolve();
          }
        } catch (err) {
          clearInterval(checkPopup);
          popup.close();
          reject(err);
        }
      }, 1000);
    });
  },

  logout(): void {
    localStorage.removeItem('auth_token');
  },

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}; 