'use client';

import { PropsWithChildren } from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';

export default function Providers({ children }: PropsWithChildren) {
  return <ThemeProvider>{children}</ThemeProvider>;
} 