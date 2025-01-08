'use client';

import * as React from 'react';

interface StackProps {
  children: React.ReactNode;
  spacing?: number;
}

const Stack = ({ children, spacing }: StackProps) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: `${spacing}px` }}>
    {children}
  </div>
);

export const RecommendationSkeleton = () => (
  <Stack spacing={4}>
    {[...Array(3)].map((_, i) => (
      <div key={i} className="p-4 border rounded-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    ))}
  </Stack>
); 