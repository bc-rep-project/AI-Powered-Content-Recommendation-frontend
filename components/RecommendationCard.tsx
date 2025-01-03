import React from 'react';

export function RecommendationCard({ recommendation }) {
  return (
    <div className="card p-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        {recommendation.title}
      </h3>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        {recommendation.description}
      </p>
      <div className="mt-4 flex items-center gap-2">
        {recommendation.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 text-sm rounded-full
                     bg-gray-100 dark:bg-gray-800
                     text-gray-600 dark:text-gray-300"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
} 