'use client';

import React from 'react';

export default function MyListPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My List</h1>
      <div className="grid gap-6">
        {/* Add your my list content here */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Saved Content</h2>
          <p className="text-gray-600">Your saved content will appear here.</p>
        </div>
      </div>
    </div>
  );
} 