'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import * as React from 'react';

export default function ThemeContext({ children }: { children: React.ReactNode }): React.ReactElement {
  return React.createElement(NextThemesProvider, {
    attribute: 'class',
    defaultTheme: 'system',
    enableSystem: true,
    children
  });
} 