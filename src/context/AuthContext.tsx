import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';
import { authService } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithGithub: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
}

// Create a default context value
const defaultContext: AuthContextType = {
  user: null,
  isAuthenticated: false,
  login: async () => {
    throw new Error('AuthContext not initialized');
  },
  logout: () => {
    throw new Error('AuthContext not initialized');
  },
  loading: false,
  loginWithGoogle: async () => {
    throw new Error('AuthContext not initialized');
  },
  loginWithGithub: async () => {
    throw new Error('AuthContext not initialized');
  },
  loginWithFacebook: async () => {
    throw new Error('AuthContext not initialized');
  }
};

// Create the context with the default value
const AuthContext = createContext<AuthContextType>(defaultContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const user = await authService.validateToken(token);
          setUser(user);
        } catch (error) {
          console.error('Token validation failed:', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      setUser(response.user);
      localStorage.setItem('token', response.access_token);
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const loginWithGoogle = async () => {
    try {
      const response = await authService.loginWithGoogle();
      setUser(response.user);
      localStorage.setItem('token', response.access_token);
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Google login failed:', error);
      throw error;
    }
  };

  const loginWithGithub = async () => {
    try {
      const response = await authService.loginWithGithub();
      setUser(response.user);
      localStorage.setItem('token', response.access_token);
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Github login failed:', error);
      throw error;
    }
  };

  const loginWithFacebook = async () => {
    try {
      const response = await authService.loginWithFacebook();
      setUser(response.user);
      localStorage.setItem('token', response.access_token);
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Facebook login failed:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading,
    loginWithGoogle,
    loginWithGithub,
    loginWithFacebook
  };

  return React.createElement(
    AuthContext.Provider,
    { value },
    children
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 