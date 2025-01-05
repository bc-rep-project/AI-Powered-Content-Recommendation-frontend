'use client';

import React from 'react';
import { FiHome, FiCompass, FiBookmark, FiUser } from 'react-icons/fi';
import { usePathname } from 'next/navigation';

export const MobileNavigation = () => {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav">
      <a href="/dashboard" className="flex flex-col items-center text-xs p-2">
        <FiHome className="w-5 h-5 mb-1" />
        <span className={pathname === '/dashboard' ? 'text-primary-600' : ''}>Home</span>
      </a>
      <a href="/explore" className="flex flex-col items-center text-xs p-2">
        <FiCompass className="w-5 h-5 mb-1" />
        <span>Explore</span>
      </a>
      <a href="/saved" className="flex flex-col items-center text-xs p-2">
        <FiBookmark className="w-5 h-5 mb-1" />
        <span>Saved</span>
      </a>
      <a href="/profile" className="flex flex-col items-center text-xs p-2">
        <FiUser className="w-5 h-5 mb-1" />
        <span>Profile</span>
      </a>
    </nav>
  );
}; 