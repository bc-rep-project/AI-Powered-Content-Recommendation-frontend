'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import * as React from 'react';

export function ThemeToggle(): React.ReactElement {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return React.createElement('div', { className: 'w-8 h-8' });
  }

  return React.createElement(
    'button',
    {
      type: 'button',
      className: 'rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none',
      onClick: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
      'aria-label': 'Toggle theme',
    },
    React.createElement(
      'svg',
      {
        className: 'h-6 w-6',
        fill: 'none',
        viewBox: '0 0 24 24',
        stroke: theme === 'dark' ? 'currentColor' : 'currentColor',
        'aria-hidden': 'true',
    },
    theme === 'dark'
        ? React.createElement('path', {
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            strokeWidth: 2,
            d: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z',
          })
        : React.createElement('path', {
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            strokeWidth: 2,
            d: 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z',
          })
    )
  );
} 