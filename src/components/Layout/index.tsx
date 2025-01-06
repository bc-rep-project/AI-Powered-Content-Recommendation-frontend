'use client';

import { Sidebar } from './Sidebar';
import { MobileNavigation } from './MobileNavigation';
import { ErrorBoundary } from '../common/ErrorBoundary';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <ErrorBoundary>
      <div className="flex h-screen bg-gray-50 dark:bg-dark-bg">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
        <MobileNavigation />
      </div>
    </ErrorBoundary>
  );
}