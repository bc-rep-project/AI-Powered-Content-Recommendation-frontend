'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface User {
  email: string;
  picture?: string;
  provider?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const handleAuth = async () => {
      try {
        // Handle OAuth callback parameters
        const access_token = searchParams.get('access_token');
        const userEmail = searchParams.get('user');
        const provider = searchParams.get('provider');
        
        if (access_token) {
          // Store the token and user info
          localStorage.setItem('auth_token', access_token);
          if (userEmail) {
            const userData = { 
              email: userEmail,
              provider: provider || undefined
            };
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
          }
          
          // Clean up URL parameters
          router.replace('/dashboard');
        } else {
          // Check if user is already authenticated
          const storedToken = localStorage.getItem('auth_token');
          const storedUser = localStorage.getItem('user');
          
          if (!storedToken || !storedUser) {
            router.replace('/login');
            return;
          }
          
          try {
            setUser(JSON.parse(storedUser));
          } catch (error) {
            console.error('Error parsing stored user:', error);
            router.replace('/login');
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Authentication error:', error);
        router.replace('/login');
      }
    };

    handleAuth();
  }, [searchParams, router]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    router.replace('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    router.replace('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Content Recommendations</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">{user.email}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Welcome to your Dashboard</h2>
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Your Profile</h3>
            <div className="space-y-4">
              <p><span className="font-medium">Email:</span> {user.email}</p>
              {user.provider && (
                <p><span className="font-medium">Sign in method:</span> {user.provider}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}