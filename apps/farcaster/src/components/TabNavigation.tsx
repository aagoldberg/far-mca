'use client';

import { usePathname, useRouter } from 'next/navigation';

export default function TabNavigation() {
  const pathname = usePathname();
  const router = useRouter();

  const tabs = [
    { name: 'Feed', path: '/' },
    { name: 'My Loans', path: '/my-loans' },
    { name: 'Supporting', path: '/supporting' },
  ];

  return (
    <div className="border-b border-gray-200 bg-white">
      <nav className="flex space-x-8 px-4" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = pathname === tab.path;
          return (
            <button
              key={tab.name}
              onClick={() => router.push(tab.path)}
              className={`
                py-3 px-1 text-sm font-medium border-b-2 transition-colors
                ${
                  isActive
                    ? 'border-[#3B9B7F] text-[#3B9B7F]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.name}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
