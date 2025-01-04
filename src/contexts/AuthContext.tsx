'use client';

import React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import type { User, AuthResponse } from '@/types';
import { authService } from '@/services/auth.service';

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loginWithProvider: (provider: 'google' | 'github' | 'facebook') => Promise<void>;
};

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const user = await authService.validateToken(token);
      setUser(user);
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: async (email: string, password: string) => {
      const response = await authService.login({ email, password });
      setUser(response.user);
      localStorage.setItem('token', response.access_token);
    },
    logout: () => {
      localStorage.removeItem('token');
      setUser(null);
    },
    loginWithProvider: async (provider: 'google' | 'github' | 'facebook') => {
      await authService.loginWithProvider(provider);
    },
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}