import React from 'react';
import Sidebar from './Sidebar';
import MobileNavigation from './MobileNavigation';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-dark-bg">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
      <MobileNavigation />
    </div>
  );
} 