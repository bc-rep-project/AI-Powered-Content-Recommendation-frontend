'use client';

import React from 'react';

export default function DiscoverPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Discover</h1>
      <div className="grid gap-6">
        {/* Add your discover content here */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recommended Content</h2>
          <p className="text-gray-600">Discover new content based on your interests.</p>
        </div>
      </div>
    </div>
  );
} 