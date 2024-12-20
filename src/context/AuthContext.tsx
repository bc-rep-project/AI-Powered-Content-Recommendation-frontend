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

const AuthContext = createContext<AuthContextType>(defaultContext);

interface Props {
  children: React.ReactNode;
}

const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const userData = await authService.validateToken(token);
            setUser(userData);
          } catch (error) {
            console.error('Token validation failed:', error);
            localStorage.removeItem('token');
          }
        }
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      setUser(response.user);
      localStorage.setItem('token', response.token);
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
      localStorage.setItem('token', response.token);
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
      localStorage.setItem('token', response.token);
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
      localStorage.setItem('token', response.token);
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Facebook login failed:', error);
      throw error;
    }
  };

  const contextValue = {
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
    { value: contextValue },
    children
  );
};

const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth }; 