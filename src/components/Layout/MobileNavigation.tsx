'use client';

import { FiHome, FiCompass, FiBookmark, FiUser } from 'react-icons/fi';
import Link from 'next/link';

export const MobileNavigation = () => {
  return (
    <nav className="bottom-nav">
      <Link href="/dashboard" className="flex flex-col items-center text-xs p-2">
        <FiHome className="w-5 h-5 mb-1" />
        <span className="text-primary-600">Home</span>
      </Link>
      <Link href="/explore" className="flex flex-col items-center text-xs p-2">
        <FiCompass className="w-5 h-5 mb-1" />
        <span>Explore</span>
      </Link>
      <Link href="/saved" className="flex flex-col items-center text-xs p-2">
        <FiBookmark className="w-5 h-5 mb-1" />
        <span>Saved</span>
      </Link>
      <Link href="/profile" className="flex flex-col items-center text-xs p-2">
        <FiUser className="w-5 h-5 mb-1" />
        <span>Profile</span>
      </Link>
    </nav>
  );
}; 