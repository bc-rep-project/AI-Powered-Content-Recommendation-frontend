'use client';

import { PropsWithChildren, ReactNode } from 'react';
import { PageTransition } from '../PageTransition';

interface LayoutProps {
    children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
    return (
        <PageTransition className="min-h-screen bg-gray-50">
            <main className="container mx-auto px-4 py-8">
                {children}
            </main>
        </PageTransition>
    );
} 