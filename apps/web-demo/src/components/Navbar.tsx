'use client';

import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 no-underline">
            <span className="text-[22px] sm:text-[26px] tracking-tight text-cyan-700 font-normal">
              LendFriend
            </span>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <Link
              href="/create-loan"
              className="px-4 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-full transition-colors"
            >
              Start Your Raise
            </Link>
            <button className="text-gray-700 hover:text-gray-900 font-medium py-2 px-2 transition-colors">
              Maria S.
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
