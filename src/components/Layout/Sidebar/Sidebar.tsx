import { ThemeToggle } from '@/components/common/ThemeToggle';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { FiHome, FiCompass, FiBookmark, FiUser, FiSettings, FiLogOut } from 'react-icons/fi';

export const Sidebar = () => {
  const pathname = usePathname();
  
  const isActive = (path: string) => pathname === path;

  const navItems = [
    { href: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { href: '/explore', icon: FiCompass, label: 'Explore' },
    { href: '/saved', icon: FiBookmark, label: 'Saved Items' },
    { href: '/profile', icon: FiUser, label: 'Profile' },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen bg-white dark:bg-dark-bg border-r dark:border-dark-border">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">
          AI Recommender
        </h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map(({ href, icon: Icon, label }) => (
          <Link 
            key={href}
            href={href} 
            className={`flex items-center px-4 py-3 rounded-md transition-colors
              ${isActive(href) 
                ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400' 
                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-border'
              }`}
          >
            <Icon className="w-5 h-5 mr-3" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t dark:border-dark-border space-y-4">
        <Link 
          href="/settings" 
          className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 
                     hover:bg-gray-100 dark:hover:bg-dark-border rounded-md"
        >
          <FiSettings className="w-5 h-5 mr-3" />
          Settings
        </Link>
        <div className="flex items-center justify-between px-4">
          <ThemeToggle />
          <button 
            onClick={() => {/* Handle logout */}}
            className="text-gray-700 dark:text-gray-200 hover:text-red-600 
                       dark:hover:text-red-400 flex items-center gap-2"
          >
            <FiLogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}; 