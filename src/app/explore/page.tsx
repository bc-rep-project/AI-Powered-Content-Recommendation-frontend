'use client';

import { useState, useEffect } from 'react';
import { API_ENDPOINTS, handleApiError, ApiResponse, apiFetch } from '@/config/api.config';

interface Content {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
  rating?: number;
  tags: string[];
}

interface Filters {
  category: string;
  minRating: number;
  tags: string[];
  sortBy: 'rating' | 'newest' | 'popular';
}

const CATEGORIES = ['All', 'Technology', 'Science', 'Business', 'Arts', 'Health'];
const RATINGS = [1, 2, 3, 4, 5];
const SORT_OPTIONS = [
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest First' },
  { value: 'popular', label: 'Most Popular' },
];

export default function ExplorePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState<Content[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    category: 'All',
    minRating: 0,
    tags: [],
    sortBy: 'rating',
  });
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  // Extract unique tags from content
  useEffect(() => {
    const tags = new Set<string>();
    content.forEach(item => {
      item.tags.forEach(tag => tags.add(tag));
    });
    setAvailableTags(Array.from(tags));
  }, [content]);

  // Fetch all content
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
      
      // Use placeholder data for development/demo purposes
      setContent([
        {
          id: '1',
          title: 'Machine Learning Basics',
          description: 'Introduction to fundamental concepts in ML',
          category: 'Technology',
          tags: ['AI', 'ML', 'Beginner'],
          rating: 4.5
        },
        {
          id: '2',
          title: 'Data Science with Python',
          description: 'Learn data analysis using Python',
          category: 'Technology',
          tags: ['Python', 'Data Science'],
          rating: 4.8
        },
        {
          id: '3',
          title: 'Business Analytics',
          description: 'Learn business analytics fundamentals',
          category: 'Business',
          tags: ['Analytics', 'Business', 'Data'],
          rating: 4.2
        },
        {
          id: '4',
          title: 'Digital Art Fundamentals',
          description: 'Master the basics of digital art',
          category: 'Arts',
          tags: ['Art', 'Digital', 'Creative'],
          rating: 4.6
        },
        {
          id: '5',
          title: 'Web Development Bootcamp',
          description: 'Complete guide to modern web development',
          category: 'Technology',
          tags: ['Web', 'JavaScript', 'React'],
          rating: 4.7
        },
        {
          id: '6',
          title: 'Health and Nutrition',
          description: 'Understanding nutrition and healthy living',
          category: 'Health',
          tags: ['Health', 'Nutrition', 'Wellness'],
          rating: 4.3
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (filterType: keyof Filters, value: any) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const toggleTag = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  // Apply filters and sorting to content
  const filteredContent = content.filter(item => {
    const categoryMatch = filters.category === 'All' || item.category === filters.category;
    const ratingMatch = !item.rating || item.rating >= filters.minRating;
    const tagsMatch = filters.tags.length === 0 || 
      filters.tags.every(tag => item.tags.includes(tag));
    
    return categoryMatch && ratingMatch && tagsMatch;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'newest':
        return parseInt(b.id) - parseInt(a.id);
      case 'popular':
        return (b.rating || 0) - (a.rating || 0);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Explore Content</h1>
            <p className="mt-2 text-gray-600">
              Discover new and interesting content
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
            <p>{error}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent"></div>
        </div>
        )}

        {/* Content Grid */}
        {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContent.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                {item.imageUrl && (
                <img 
                  src={item.imageUrl} 
                  alt={item.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                {item.tags.map((tag) => (
                  <span 
                    key={tag}
                        className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{item.category}</span>
              {item.rating && (
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                        <span className="ml-1 text-sm text-gray-600">{item.rating}</span>
                </div>
              )}
                  </div>
                </div>
            </div>
          ))}
          </div>
        )}

        {/* No Results Message */}
        {!isLoading && filteredContent.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No content matches the selected filters</p>
            <button
              onClick={() => setFilters({
                category: 'All',
                minRating: 0,
                tags: [],
                sortBy: 'rating'
              })}
              className="mt-4 text-blue-600 hover:text-blue-700"
            >
              Clear all filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
} 