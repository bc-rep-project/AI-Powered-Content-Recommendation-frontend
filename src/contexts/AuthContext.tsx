import { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../services/api';
import { API_ENDPOINTS } from '../config/api';

interface AuthContextType {
    isAuthenticated: boolean;
    user: any | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('access_token');
            if (token) {
                const response = await apiClient.get(API_ENDPOINTS.user.profile);
                setUser(response.data);
            }
        } catch (error) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        const response = await apiClient.post(API_ENDPOINTS.auth.login, {
            email,
            password
        });
        
        const { access_token, refresh_token, user: userData } = response.data;
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        setUser(userData);
    };

    const logout = async () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ 
            isAuthenticated: !!user, 
            user, 
            login, 
            logout,
            loading 
        }}>
            {children}
        </AuthContext.Provider>
    );
} 