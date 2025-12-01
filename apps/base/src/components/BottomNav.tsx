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
        <svg className="w-6 h-6" fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      ),
      isActive: pathname === '/',
    },
    {
      href: '/create-loan',
      label: 'Borrow',
      icon: (active: boolean) => (
        <div className={`w-14 h-14 rounded-full flex items-center justify-center -mt-6 shadow-xl border-4 border-white ${active ? 'bg-[#234E52]' : 'bg-[#2C7A7B]'}`}>
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </div>
      ),
      isActive: pathname === '/create-loan',
      isCenter: true,
    },
    {
      href: '/activity',
      label: 'Activity',
      icon: (active: boolean) => (
        <svg className="w-6 h-6" fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.5}>
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
            className={`flex flex-col items-center justify-center min-w-[64px] min-h-[44px] ${
              item.isCenter ? '' : 'py-2'
            } ${
              item.isActive && !item.isCenter
                ? 'text-[#2C7A7B]'
                : 'text-gray-500'
            }`}
          >
            {item.icon(item.isActive)}
            {item.isCenter ? (
              <span className="text-xs mt-1 font-semibold text-[#2C7A7B]">
                {item.label}
              </span>
            ) : (
              <span className={`text-xs mt-1 font-medium ${item.isActive ? 'text-[#2C7A7B]' : 'text-gray-500'}`}>
                {item.label}
              </span>
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
}
