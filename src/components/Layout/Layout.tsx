'use client';

import { ReactElement } from 'react';

interface LayoutProps {
    children: JSX.Element | JSX.Element[];
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