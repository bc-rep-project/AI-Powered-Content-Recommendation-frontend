'use client';

import React from 'react';
import { authService, LoginData, RegisterData, AuthResponse } from '../services/auth.service';

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = React.useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  });

  const handleAuthResponse = React.useCallback((response: AuthResponse) => {
    const newToken = response.access_token;
    setToken(newToken);
    localStorage.setItem('auth_token', newToken);
  }, []);

  const login = React.useCallback(async (data: LoginData) => {
    const response = await authService.login(data);
    handleAuthResponse(response);
  }, [handleAuthResponse]);

  const register = React.useCallback(async (data: RegisterData) => {
    const response = await authService.register(data);
    handleAuthResponse(response);
  }, [handleAuthResponse]);

  const logout = React.useCallback(() => {
    setToken(null);
    localStorage.removeItem('auth_token');
  }, []);

  const value = React.useMemo(
    () => ({
      token,
      isAuthenticated: !!token,
      login,
      register,
      logout,
    }),
    [token, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 