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
}

export interface GoogleAuthResponse {
  access_token: string;
  token_type: string;
  user: {
    email: string;
    name: string;
    picture?: string;
  };
}

export const authService = {
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await fetch(API_ENDPOINTS.register, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
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
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const formData = new URLSearchParams();
      formData.append('username', data.email);
      formData.append('password', data.password);

      const response = await fetch(API_ENDPOINTS.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        mode: 'cors',
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

  async loginWithGoogle(): Promise<void> {
    const googleAuthUrl = `${API_ENDPOINTS.googleAuth}?redirect_uri=${encodeURIComponent(window.location.origin + '/auth/google/callback')}`;
    const popup = window.open(googleAuthUrl, 'Google Sign In', 'width=500,height=600');

    if (!popup) {
      throw new Error('Failed to open Google sign in popup. Please allow popups for this site.');
    }

    return new Promise((resolve, reject) => {
      window.addEventListener('message', async function handleMessage(event) {
        if (event.origin !== window.location.origin) return;
        if (event.data.type === 'google_auth_success') {
          window.removeEventListener('message', handleMessage);
          try {
            const { access_token } = event.data;
            localStorage.setItem('auth_token', access_token);
            resolve();
          } catch (error) {
            reject(error);
          }
        }
      });
    });
  },

  logout() {
    localStorage.removeItem('auth_token');
  },

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}; 