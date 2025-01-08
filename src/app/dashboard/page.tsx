'use client';

import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

export default function DashboardPage() {
  return (
    <ErrorBoundary>
      <div className="container pb-16 pt-4">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p className="text-gray-600">Welcome to your personalized dashboard</p>
      </div>
    </ErrorBoundary>
  );
}