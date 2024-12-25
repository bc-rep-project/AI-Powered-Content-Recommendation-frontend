'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { User, RecommendationItem, RecommendationsResponse, apiFetch, API_ENDPOINTS } from '@/config/api.config';

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const access_token = searchParams.get('access_token');
        const userEmail = searchParams.get('user');
        const provider = searchParams.get('provider');
        
        if (access_token) {
          localStorage.setItem('auth_token', access_token);
          if (userEmail) {
            const userData = { 
              email: userEmail,
              username: userEmail.split('@')[0],
              picture: null,
              oauth_provider: provider || null,
              id: ''
            };
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
          }
          router.replace('/dashboard');
        } else {
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

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          throw new Error('No auth token found');
        }

        const response = await apiFetch<RecommendationsResponse>(
          API_ENDPOINTS.recommendations,
          { method: 'GET' },
          token
        );

        setRecommendations(response.data?.items || []);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        setError('Failed to load recommendations');
      }
    };

    if (user) {
      fetchRecommendations();
    }
  }, [user]);

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

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Your Recommendations</h2>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((item) => (
              <div 
                key={item.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {item.image_url ? (
                  <img 
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                    <span className="text-sm text-blue-600 font-medium">
                      {item.metadata.readTime}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.metadata.tags.map((tag) => (
                      <span 
                        key={tag}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Score: {(item.score * 100).toFixed(0)}%
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {recommendations.length === 0 && !error && !isLoading && (
            <div className="text-center py-12">
              <p className="text-gray-600">No recommendations available yet.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}