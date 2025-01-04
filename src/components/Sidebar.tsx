import React from 'react';
import { useRouter } from 'next/router';
import { IconType } from 'react-icons';
import { FiHome, FiCompass, FiStar, FiSettings } from 'react-icons/fi';

interface NavItem {
  label: string;
  icon: IconType;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', icon: FiHome, href: '/dashboard' },
  { label: 'Explore', icon: FiCompass, href: '/explore' },
  { label: 'Favorites', icon: FiStar, href: '/favorites' },
  { label: 'Settings', icon: FiSettings, href: '/settings' },
];

export const Sidebar = () => {
  const router = useRouter();

  return (
    <div className="w-64 bg-white dark:bg-gray-800 h-full shadow-lg">
      <nav className="mt-5 px-2">
        {NAV_ITEMS.map((item) => {
          const isActive = router.pathname === item.href;
          const Icon = item.icon;
          
          return (
            <a
              key={item.label}
              href={item.href}
              className={`flex items-center px-4 py-2 mt-2 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                isActive ? 'bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-white' : ''
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="mx-4 font-medium">{item.label}</span>
            </a>
          );
        })}
      </nav>
    </div>
  );
}; 