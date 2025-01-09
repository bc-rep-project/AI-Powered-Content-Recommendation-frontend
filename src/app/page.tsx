'use client';

import ContentCard from '@/components/ContentCard';
import { type ContentType } from '@/components/ContentCard';

export default function Home() {
  // Example content items
  const contentItems: Array<{
    id: number;
    title: string;
    description: string;
    type: ContentType;
    imageUrl: string;
    metadata: {
      author?: string;
      readTime?: number;
      price?: number;
      category?: string;
      publishedAt?: string;
    };
    score: number;
  }> = [
    {
      id: 1,
      title: "Understanding AI in 2024",
      description: "A comprehensive guide to artificial intelligence and its impact on modern technology.",
      type: "article",
      imageUrl: "https://picsum.photos/800/600?random=1",
      metadata: {
        author: "Dr. Jane Smith",
        readTime: 8,
        category: "Technology",
        publishedAt: "2024-01-08",
      },
      score: 0.95,
    },
    {
      id: 2,
      title: "Machine Learning Basics",
      description: "Learn the fundamentals of machine learning with practical examples.",
      type: "video",
      imageUrl: "https://picsum.photos/800/600?random=2",
      metadata: {
        author: "Tech Academy",
        readTime: 15,
        category: "Education",
        publishedAt: "2024-01-07",
      },
      score: 0.88,
    },
    {
      id: 3,
      title: "Data Science Toolkit",
      description: "Essential tools and software for modern data science workflows.",
      type: "product",
      imageUrl: "https://picsum.photos/800/600?random=3",
      metadata: {
        price: 99.99,
        category: "Software",
        publishedAt: "2024-01-06",
      },
      score: 0.92,
    },
  ];

  const handleInteraction = (type: 'like' | 'bookmark' | 'share') => {
    console.log(`Interaction: ${type}`);
    // Add interaction handling logic here
  };

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
        {contentItems.map((item) => (
          <ContentCard
            key={item.id}
            {...item}
            onInteraction={handleInteraction}
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
    </div>
  );
} 