import * as React from 'react';
import { useRouter } from 'next/router';
import { api } from '../services/api';
import type { User, AuthResponse } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithGithub: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  logout: () => void;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const defaultContext: AuthContextType = {
  user: null,
  isLoading: false,
  login: async () => { throw new Error('AuthContext not initialized'); },
  loginWithGoogle: async () => { throw new Error('AuthContext not initialized'); },
  loginWithGithub: async () => { throw new Error('AuthContext not initialized'); },
  loginWithFacebook: async () => { throw new Error('AuthContext not initialized'); },
  logout: () => { throw new Error('AuthContext not initialized'); },
};

const AuthContext = React.createContext<AuthContextType>(defaultContext);
AuthContext.displayName = 'AuthContext';

export const AuthProvider = React.memo(function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  const login = React.useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await api.post<AuthResponse>('/auth/token', {
        username: email,
        password,
      });

      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      
      // Get user data
      const userResponse = await api.get<User>('/users/me');
      setUser(userResponse.data);
      
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const loginWithGoogle = React.useCallback(async () => {
    try {
      setIsLoading(true);
      window.location.href = '/api/v1/auth/google/login';
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithGithub = React.useCallback(async () => {
    try {
      setIsLoading(true);
      window.location.href = '/api/v1/auth/github/login';
    } catch (error) {
      console.error('GitHub login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithFacebook = React.useCallback(async () => {
    try {
      setIsLoading(true);
      window.location.href = '/api/v1/auth/facebook/login';
    } catch (error) {
      console.error('Facebook login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = React.useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  }, [router]);

  const value = React.useMemo(() => ({
    user,
    login,
    loginWithGoogle,
    loginWithGithub,
    loginWithFacebook,
    logout,
    isLoading,
  }), [user, login, loginWithGoogle, loginWithGithub, loginWithFacebook, logout, isLoading]);

  return React.createElement(
    AuthContext.Provider,
    { value },
    children
  );
});

export function useAuth(): AuthContextType {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 