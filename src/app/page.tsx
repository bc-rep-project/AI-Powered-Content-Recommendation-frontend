'use client';

import { useEffect, useState } from 'react';
import ContentCard from '@/components/ContentCard';
import { contentApi } from '@/lib/api';
import { type Recommendation } from '@/types/recommendation';
import type { ContentType } from '@/components/ContentCard';
import type { WikipediaResult } from '@/components/ContentCard';

export default function Home() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [wikiContent, setWikiContent] = useState<WikipediaResult[]>([]);
  const [searchQuery, setSearchQuery] = useState("Artificial Intelligence");

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        const data = await contentApi.getRecommendations();
        setRecommendations(data.recommendations);
      } catch (err) {
        setError('Failed to load recommendations');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadRecommendations();
  }, []);

  useEffect(() => {
    const fetchWikipedia = async () => {
      try {
        const response = await contentApi.getWikipediaContent(searchQuery);
        setWikiContent(response.results);
      } catch (error) {
        console.error("Failed to load Wikipedia content:", error);
      }
    };
    
    fetchWikipedia();
  }, [searchQuery]);

  if (loading) return <div className="text-center py-8">Loading recommendations...</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
          Discover Content That Matters
        </h1>
        <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
          Personalized recommendations powered by advanced AI
        </p>
      </section>

      {/* Content Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((item) => (
          <ContentCard
            key={item.content_id}
            id={parseInt(item.content_id)}
            title={item.title}
            description={item.description}
            type={item.type as ContentType}
            imageUrl={item.image_url}
            metadata={item.metadata}
            score={item.score}
            onInteraction={type => contentApi.trackInteraction(item.content_id, type)}
          />
        ))}
      </section>

      {/* Features Section */}
      <section className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Personalized For You
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              AI-powered recommendations that learn from your preferences
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Diverse Content
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Articles, videos, and products tailored to your interests
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Smart Analytics
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Track your learning progress and content engagement
            </p>
          </div>
        </div>
      </section>

      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Wikipedia Content</h1>
        
        <div className="mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border p-2 w-full max-w-md"
            placeholder="Search Wikipedia..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wikiContent.map((item) => (
            <ContentCard key={item.pageid} content={item} />
          ))}
        </div>
      </main>
    </div>
  );
} 