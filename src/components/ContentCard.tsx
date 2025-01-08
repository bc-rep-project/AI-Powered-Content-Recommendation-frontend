import React from 'react';
import Image from 'next/image';
import { FiClock, FiHeart, FiBookmark, FiShare2 } from 'react-icons/fi';

interface ContentCardProps {
  id: number;
  title: string;
  description: string;
  type: 'article' | 'video' | 'product';
  imageUrl: string;
  metadata: {
    author?: string;
    readTime?: number;
    price?: number;
    category?: string;
    publishedAt?: string;
  };
  score: number;
  onInteraction?: (type: 'like' | 'bookmark' | 'share') => void;
}

export default function ContentCard({
  title,
  description,
  type,
  imageUrl,
  metadata,
  score,
  onInteraction,
}: ContentCardProps) {
  return (
    <div className="bg-white dark:bg-dark-card rounded-lg shadow-md overflow-hidden transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg">
      <div className="relative h-48 w-full">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-2 right-2 bg-primary-500 text-white px-2 py-1 rounded-full text-xs">
          {Math.round(score * 100)}% Match
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-primary-600 dark:text-primary-400 uppercase">
            {type}
          </span>
          {metadata.category && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {metadata.category}
            </span>
          )}
        </div>

        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>

        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
          {description}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            {metadata.author && (
              <span className="truncate">{metadata.author}</span>
            )}
            {metadata.readTime && (
              <span className="flex items-center">
                <FiClock className="mr-1 h-4 w-4" />
                {metadata.readTime} min
              </span>
            )}
            {metadata.price && (
              <span className="font-medium text-gray-900 dark:text-white">
                ${metadata.price.toFixed(2)}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onInteraction?.('like')}
              className="p-1 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
              aria-label="Like"
            >
              <FiHeart className="h-5 w-5" />
            </button>
            <button
              onClick={() => onInteraction?.('bookmark')}
              className="p-1 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
              aria-label="Bookmark"
            >
              <FiBookmark className="h-5 w-5" />
            </button>
            <button
              onClick={() => onInteraction?.('share')}
              className="p-1 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
              aria-label="Share"
            >
              <FiShare2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 