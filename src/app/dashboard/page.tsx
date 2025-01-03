'use client';

import { useState, useEffect } from 'react';
import { API_ENDPOINTS, handleApiError, apiFetch } from '@/config/api.config';
import LoadingSpinner from '@/components/LoadingSpinner';
import { dummyContent } from '@/utils/dummyData';

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

interface ContentItem {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  rating?: number;
  interactions?: {
    views: number;
    likes: number;
    shares: number;
  };
}

const CATEGORIES = ['All', 'Technology', 'Science', 'Business', 'Arts', 'Health'];

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
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
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isTraining, setIsTraining] = useState(false);

  // Extract unique tags from content
  useEffect(() => {
    const tags = new Set<string>();
    [...recommendations, ...searchResults].forEach(item => {
      item.tags.forEach(tag => tags.add(tag));
    });
    setAvailableTags(Array.from(tags));
  }, [recommendations, searchResults]);
  
  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await apiFetch<Content[]>(API_ENDPOINTS.recommendations);
      setRecommendations(data.data || []);
    } catch (err) {
      setError(handleApiError(err));
      // Use dummy data when API fails
      setRecommendations(dummyContent);
    } finally {
      // Simulate loading for better UX with dummy data
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
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

      const data = await apiFetch<Content[]>(`${API_ENDPOINTS.search}?${queryParams}`);
      setSearchResults(data.data || []);
    } catch (err) {
      setError(handleApiError(err));
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

  const handleEdit = (content: Content) => {
    setEditingContent(content);
    setIsEditing(true);
  };

  const handleSave = async (updatedContent: Content) => {
    setIsSaving(true);
    try {
      await apiFetch(API_ENDPOINTS.updateContent(updatedContent.id), {
        method: 'PUT',
        body: JSON.stringify(updatedContent),
      });
      
      setRecommendations(prev => 
        prev.map(item => item.id === updatedContent.id ? updatedContent : item)
      );
      setIsEditing(false);
      setEditingContent(null);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingContent(null);
  };

  const trainModel = async () => {
    setIsTraining(true);
    try {
      const dummyData: ContentItem[] = require('@/utils/dummyData').dummyContent;
      
      await apiFetch(API_ENDPOINTS.trainModel, {
        method: 'POST',
        body: JSON.stringify({
          training_data: dummyData.map((item: ContentItem) => ({
            content_id: item.id,
            title: item.title,
            description: item.description,
            category: item.category,
            tags: item.tags,
            rating: item.rating || 0,
            interactions: {
              views: Math.floor(Math.random() * 1000),
              likes: Math.floor(Math.random() * 100),
              shares: Math.floor(Math.random() * 50)
            }
          }))
        })
      });

      // Refresh recommendations after training
      await fetchRecommendations();
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsTraining(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <h2 className="mt-4 text-xl font-semibold text-gray-700">
            Preparing your recommendations...
          </h2>
          <p className="mt-2 text-gray-500">
            Our AI is analyzing your preferences to find the best content for you.
          </p>
        </div>
      </div>
    );
  }

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
              <a href="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 bg-gray-50">
                Dashboard
              </a>
              <a href="/explore" className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50">
                Explore
              </a>
              <a href="/favorites" className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50">
                Favorites
              </a>
              <a href="/settings" className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50">
                Settings
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Header with training button */}
        <div className="mb-8 flex justify-between items-center">
          <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Recommendations</h1>
          <p className="mt-2 text-gray-600">
            Discover content tailored just for you
          </p>
          </div>
          <button
            onClick={trainModel}
            disabled={isTraining}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
          >
            {isTraining ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
                <span>Training Model...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                <span>Train Model</span>
              </>
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
            <p>{error}</p>
          </div>
        )}

        {/* Filters */}
        <div className="mb-8">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
            </svg>
            <span>Filters</span>
          </button>

          {isFilterOpen && (
            <div className="mt-4 p-4 bg-white rounded-lg shadow-sm">
              {/* Category Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Rating Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={filters.minRating}
                  onChange={(e) => handleFilterChange('minRating', parseFloat(e.target.value))}
                  className="w-full"
                />
                <span className="text-sm text-gray-600">{filters.minRating} stars</span>
              </div>

              {/* Tags Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        filters.tags.includes(tag)
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {isEditing && editingContent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
              <h2 className="text-2xl font-bold mb-4">Edit Content</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                handleSave(editingContent);
              }}>
            <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={editingContent.title}
                      onChange={(e) => setEditingContent({
                        ...editingContent,
                        title: e.target.value
                      })}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={editingContent.description}
                      onChange={(e) => setEditingContent({
                        ...editingContent,
                        description: e.target.value
                      })}
                      className="w-full p-2 border rounded-lg"
                      rows={4}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={editingContent.category}
                      onChange={(e) => setEditingContent({
                        ...editingContent,
                        category: e.target.value
                      })}
                      className="w-full p-2 border rounded-lg"
                    >
                      {CATEGORIES.filter(cat => cat !== 'All').map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                    <div className="flex flex-wrap gap-2">
                      {availableTags.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => {
                            const newTags = editingContent.tags.includes(tag)
                              ? editingContent.tags.filter(t => t !== tag)
                              : [...editingContent.tags, tag];
                            setEditingContent({
                              ...editingContent,
                              tags: newTags
                            });
                          }}
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            editingContent.tags.includes(tag)
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayContent.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              {item.imageUrl && (
                <div className="relative group">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => handleEdit(item)}
                      className="px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transform transition hover:scale-105"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              )}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                  {!item.imageUrl && (
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 text-gray-500 hover:text-blue-600"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  )}
                </div>
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
      </main>
    </div>
  );
}