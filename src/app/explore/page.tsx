'use client';

import { useState, useEffect } from 'react';
import { API_ENDPOINTS, handleApiError, apiFetch } from '../../config/api.config';

interface Content {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
}

export default function ExplorePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState<Content[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await apiFetch<Content[]>(API_ENDPOINTS.explore);
      setContent(data.data || []);
    } catch (err) {
      setError(handleApiError(err));
      // Use placeholder data for development
      setContent([
        {
          id: '1',
          title: 'Machine Learning Basics',
          description: 'Introduction to fundamental concepts in ML',
          category: 'Technology',
          tags: ['AI', 'ML', 'Beginner']
        },
        {
          id: '2',
          title: 'Data Science with Python',
          description: 'Learn data analysis using Python',
          category: 'Technology',
          tags: ['Python', 'Data Science']
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Explore Content</h1>
        
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
            <p>{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
} 