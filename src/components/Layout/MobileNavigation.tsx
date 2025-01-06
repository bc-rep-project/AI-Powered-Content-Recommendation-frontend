import { useState } from 'react';
import type { LinkProps } from 'next/link'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation';
import { Dialog } from '@headlessui/react';
import { Bars3Icon as Bars3IconOutline, XMarkIcon as XMarkIconOutline } from '@heroicons/react/24/outline';

const MobileNavigation = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Recommendations', href: '/recommendations' },
    { name: 'Profile', href: '/profile' },
    { name: 'Settings', href: '/settings' },
  ];

  return (
    <>
      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 lg:hidden">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3IconOutline className="h-6 w-6" aria-hidden="true" />
        </button>
        <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">
          Content Recommender
        </div>
      </div>

      <Dialog as="div" className="lg:hidden" open={sidebarOpen} onClose={setSidebarOpen}>
        <div className="fixed inset-0 z-50" />
        <Dialog.Panel className="fixed inset-y-0 left-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center gap-x-6">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-700"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <XMarkIconOutline className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">
              Content Recommender
            </div>
          </div>
          <nav className="mt-6 flow-root">
            <ul role="list" className="-my-2 divide-y divide-gray-500/10">
              {navigation.map((item) => (
                <li key={item.name} className="py-2">
                  <NextLink
                    {...item}
                    legacyBehavior
                    className={`
                      -mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7
                      ${pathname === item.href
                        ? 'bg-gray-100 text-primary'
                        : 'text-gray-900 hover:bg-gray-100 hover:text-primary'
                      }
                    `}
                    onClick={() => setSidebarOpen(false)}
                  >
                    {item.name}
                  </NextLink>
                </li>
              ))}
            </ul>
          </nav>
        </Dialog.Panel>
      </Dialog>
    </>
  );
};

export default MobileNavigation; 