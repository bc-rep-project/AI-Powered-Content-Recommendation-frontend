'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function ThemeProvider({ children }: { children: React.ReactNode }): JSX.Element {
  return React.createElement(
    NextThemesProvider,
    { attribute: 'class', enableSystem: true, defaultTheme: 'system' },
    children
  );
}