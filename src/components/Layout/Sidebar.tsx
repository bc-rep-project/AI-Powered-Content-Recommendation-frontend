import type { LinkProps } from 'next/link'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Recommendations', href: '/recommendations' },
    { name: 'Profile', href: '/profile' },
    { name: 'Settings', href: '/settings' },
  ];

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      <div className="flex flex-grow flex-col overflow-y-auto border-r border-gray-200 bg-white px-6">
        <div className="flex h-16 flex-shrink-0 items-center">
          <h1 className="text-xl font-bold">Content Recommender</h1>
        </div>
        <nav className="mt-6 flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <NextLink
                      {...item}
                      legacyBehavior
                      className={`
                        group flex gap-x-3 rounded-md p-2 text-sm font-semibold
                        ${pathname === item.href
                          ? 'bg-gray-100 text-primary'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-primary'
                        }
                      `}
                    >
                      {item.name}
                    </NextLink>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar; 