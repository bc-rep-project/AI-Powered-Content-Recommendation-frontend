import React from 'react';

export function ContentCard({ content }) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-dark-paper p-4 shadow-sm hover:shadow-md transition-shadow">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
        {content.title}
      </h2>
      <p className="mt-2 text-gray-600 dark:text-gray-300">
        {content.description}
      </p>
      <div className="mt-4 flex gap-2">
        {content.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
} 