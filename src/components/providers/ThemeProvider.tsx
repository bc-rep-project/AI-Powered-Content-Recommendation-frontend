'use client';

import dynamic from 'next/dynamic';
import * as React from 'react';

const NextThemesProvider = dynamic(() => import('next-themes').then(mod => mod.ThemeProvider), {
  ssr: false
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return React.createElement(NextThemesProvider, {
    attribute: 'class',
    defaultTheme: 'system',
    enableSystem: true,
    children
  });
}