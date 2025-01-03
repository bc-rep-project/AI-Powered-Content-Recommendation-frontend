import { ThemeToggle } from './ThemeToggle';

export function Navbar() {
  return (
    <nav className="bg-white dark:bg-dark-surface border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo and navigation links */}
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {/* Other navigation items */}
          </div>
        </div>
      </div>
    </nav>
  );
} 