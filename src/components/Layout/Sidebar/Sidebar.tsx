'use client';

import { usePathname } from 'next/navigation';
import { FiHome, FiCompass, FiBookmark, FiUser } from 'react-icons/fi';
import { ThemeToggle } from '@/components/common/ThemeToggle';

export const Sidebar = () => {
  const pathname = usePathname();
  
  const navItems = [
    { href: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { href: '/explore', icon: FiCompass, label: 'Explore' },
    { href: '/saved', icon: FiBookmark, label: 'Saved' },
    { href: '/profile', icon: FiUser, label: 'Profile' }
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen bg-white dark:bg-dark-bg border-r dark:border-dark-border">
      <div className="p-4">
        <h1 className="text-xl font-bold">AI Recommender</h1>
      </div>
      <nav className="flex-1 px-2">
        {navItems.map(({ href, icon: Icon, label }) => (
          <a 
            key={href}
            href={href}
            className={`flex items-center px-4 py-2 mt-2 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-dark-border ${
              pathname === href ? 'bg-primary-50 text-primary-600' : ''
            }`}
          >
            <Icon className="w-5 h-5 mr-3" />
            {label}
          </a>
        ))}
      </nav>
      <div className="p-4">
        <ThemeToggle />
      </div>
    </aside>
  );
}; 