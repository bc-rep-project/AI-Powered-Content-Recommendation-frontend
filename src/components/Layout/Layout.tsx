'use client';

import * as React from 'react';

interface LayoutProps {
    children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen bg-white">
            <main className="container mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    );
} 