'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMiniAppWallet } from '@/hooks/useMiniAppWallet';

export default function BottomNav() {
  const pathname = usePathname();
  const { userProfile } = useMiniAppWallet();

  // Don't show on certain pages (like funding form)
  const hiddenPaths = ['/loan/', '/create-loan'];
  const shouldHide = hiddenPaths.some(path => pathname.includes(path) && pathname !== '/');

  if (shouldHide) return null;

  const navItems = [
    {
      href: '/',
      label: 'Home',
      icon: (active: boolean) => (
        <svg className="w-6 h-6" fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      ),
      isActive: pathname === '/',
    },
    {
      href: '/create-loan',
      label: 'Borrow',
      icon: (active: boolean) => (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.5 : 2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      ),
      isActive: pathname === '/create-loan',
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
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-pb z-50">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center min-w-[64px] h-full space-y-1 ${
              item.isActive
                ? 'text-base-blue'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {item.icon(item.isActive)}
            <span className="text-[10px] font-medium">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
