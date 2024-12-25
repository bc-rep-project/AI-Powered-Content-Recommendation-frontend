'use client';

import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '@/config/api.config';

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
}

const CATEGORIES = ['All', 'Technology', 'Science', 'Business', 'Arts', 'Health'];
const RATINGS = [1, 2, 3, 4, 5];

export default function DashboardPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Content[]>([]);
  const [recommendations, setRecommendations] = useState<Content[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    category: 'All',
    minRating: 0,
    tags: [],
  });
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  // Extract unique tags from content
  useEffect(() => {
    const tags = new Set<string>();
    [...recommendations, ...searchResults].forEach(item => {
      item.tags.forEach(tag => tags.add(tag));
    });
    setAvailableTags(Array.from(tags));
  }, [recommendations, searchResults]);

  // Fetch initial recommendations
  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.recommendations);
      if (!response.ok) throw new Error('Failed to fetch recommendations');
      const data = await response.json();
      setRecommendations(data);
    } catch (err) {
      setError('Failed to load recommendations');
      // Use placeholder data for now
      setRecommendations([
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
      ]);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams({
        q: searchQuery,
        category: filters.category !== 'All' ? filters.category : '',
        minRating: filters.minRating.toString(),
        tags: filters.tags.join(','),
      });

      const response = await fetch(`${API_ENDPOINTS.recommendations}/search?${queryParams}`);
      if (!response.ok) throw new Error('Search failed');
      
      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      setError('Search failed. Please try again.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
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

  // Apply filters to content
  const filterContent = (content: Content[]) => {
    return content.filter(item => {
      const categoryMatch = filters.category === 'All' || item.category === filters.category;
      const ratingMatch = !item.rating || item.rating >= filters.minRating;
      const tagsMatch = filters.tags.length === 0 || 
        filters.tags.every(tag => item.tags.includes(tag));
      
      return categoryMatch && ratingMatch && tagsMatch;
    });
  };

  // Determine which content to show
  const displayContent = filterContent(searchQuery ? searchResults : recommendations);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center flex-shrink-0">
              <a href="/" className="flex items-center">
                <span className="text-xl font-bold text-blue-600">AI Recommender</span>
              </a>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 justify-center px-6 max-w-2xl">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for content..."
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                             focus:ring-blue-500 focus:border-blue-500 block p-2.5 pl-10"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                  </div>
                  {isSearching && (
                    <div className="absolute inset-y-0 right-3 flex items-center">
                      <div className="animate-spin h-4 w-4 border-2 border-blue-600 rounded-full border-t-transparent"></div>
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8 flex-shrink-0">
              <a href="/dashboard" className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                Dashboard
              </a>
              <a href="/explore" className="text-gray-500 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                Explore
              </a>
              <a href="/favorites" className="text-gray-500 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                Favorites
              </a>
              <a href="/settings" className="text-gray-500 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                Settings
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-500 hover:text-blue-600 focus:outline-none focus:text-blue-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
            {/* Search Bar - Mobile */}
            <div className="px-2 pt-2 pb-3">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for content..."
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                             focus:ring-blue-500 focus:border-blue-500 block p-2.5 pl-10"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                  </div>
                  {isSearching && (
                    <div className="absolute inset-y-0 right-3 flex items-center">
                      <div className="animate-spin h-4 w-4 border-2 border-blue-600 rounded-full border-t-transparent"></div>
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* Mobile Navigation Links */}
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="/dashboard" className="block text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium">
                Dashboard
              </a>
              <a href="/explore" className="block text-gray-500 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium">
                Explore
              </a>
              <a href="/favorites" className="block text-gray-500 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium">
                Favorites
              </a>
              <a href="/settings" className="block text-gray-500 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium">
                Settings
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {searchQuery ? 'Search Results' : 'Your Recommendations'}
            </h1>
            <p className="mt-2 text-gray-600">
              {searchQuery 
                ? `Showing results for "${searchQuery}"`
                : 'Personalized content based on your interests'
              }
            </p>
          </div>
          
          {/* Filter Toggle Button */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="mt-4 md:mt-0 flex items-center text-gray-600 hover:text-blue-600"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            Filters
          </button>
        </div>

        {/* Filters Panel */}
        <div className={`bg-white rounded-lg shadow-md p-6 mb-8 ${isFilterOpen ? 'block' : 'hidden'}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
              >
                {CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Rating
              </label>
              <div className="flex items-center space-x-2">
                {RATINGS.map(rating => (
                  <button
                    key={rating}
                    onClick={() => handleFilterChange('minRating', rating)}
                    className={`p-2 rounded-md ${
                      filters.minRating === rating
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {rating}★
                  </button>
                ))}
                <button
                  onClick={() => handleFilterChange('minRating', 0)}
                  className={`p-2 rounded-md ${
                    filters.minRating === 0
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Any
                </button>
              </div>
            </div>

            {/* Tags Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      filters.tags.includes(tag)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={() => setFilters({ category: 'All', minRating: 0, tags: [] })}
              className="text-gray-600 hover:text-gray-900"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Results Summary */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {displayContent.length} {displayContent.length === 1 ? 'result' : 'results'}
          {(filters.category !== 'All' || filters.minRating > 0 || filters.tags.length > 0) && ' with filters'}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayContent.map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              {item.imageUrl ? (
                <img 
                  src={item.imageUrl} 
                  alt={item.title}
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
              ) : (
                <div className="w-full h-40 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm mb-3">{item.description}</p>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {item.rating && (
                <div className="mt-3 flex items-center">
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="ml-1 text-sm text-gray-600">{item.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* No Results Message */}
        {displayContent.length === 0 && !isSearching && !error && (
          <div className="text-center py-12">
            <p className="text-gray-600">
              {searchQuery 
                ? `No results found for "${searchQuery}"`
                : 'No content matches the selected filters'
              }
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilters({ category: 'All', minRating: 0, tags: [] });
              }}
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