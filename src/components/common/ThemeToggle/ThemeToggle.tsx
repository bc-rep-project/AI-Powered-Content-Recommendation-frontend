'use client';

import { useTheme } from 'next-themes';
import { FiSun, FiMoon } from 'react-icons/fi';

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
      aria-label="Toggle dark mode"
    >
      {theme === 'dark' ? (
        <FiSun className="w-5 h-5" data-testid="sun-icon" />
      ) : (
        <FiMoon className="w-5 h-5" data-testid="moon-icon" />
      )}
    </button>
  );
}; 