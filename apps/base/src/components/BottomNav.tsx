'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMiniAppWallet } from '@/hooks/useMiniAppWallet';

export default function BottomNav() {
  const pathname = usePathname();
  const { userProfile } = useMiniAppWallet();

  // Don't show on certain pages (like funding form or create loan page)
  const hiddenPaths = ['/loan/', '/create-loan'];
  const shouldHide = hiddenPaths.some(path => pathname.includes(path)); // Check if path includes it, so /loan/xyz also hides it

  if (shouldHide) return null;

  const navItems = [
    {
      href: '/',
      label: 'Home',
      icon: (active: boolean) => (
        <svg className="w-6 h-6" fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5z" />
        </svg>
      ),
      isActive: pathname === '/',
      isCentral: false,
    },
    {
      href: '/create-loan',
      label: 'Borrow',
      icon: (active: boolean) => (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      ),
      isActive: pathname === '/create-loan',
      isCentral: true,
    },
    {
      href: '/activity',
      label: 'Activity',
      icon: (active: boolean) => (
        <svg className="w-6 h-6" fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      isActive: pathname === '/activity',
      isCentral: false,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-pb z-50">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center h-full group
              ${item.isCentral ? 'flex-1' : 'min-w-[64px]'}
              ${item.isCentral ? '' : 'px-2'}
            `}
          >
            {item.isCentral ? (
              <div className={`
                w-12 h-12 rounded-full flex items-center justify-center
                transition-all duration-200
                ${item.isActive
                  ? 'bg-base-blue text-white shadow-md'
                  : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
                }
              `}>
                {item.icon(item.isActive)}
              </div>
            ) : (
              <div className={`w-6 h-6 transition-colors duration-200
                ${item.isActive ? 'text-base-blue' : 'text-gray-400 group-hover:text-gray-600'}
              `}>
                {item.icon(item.isActive)}
              </div>
            )}

            <span className={`text-[10px] mt-1 font-medium transition-colors duration-200
              ${item.isActive ? 'text-base-blue' : 'text-gray-500'}
            `}>
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
