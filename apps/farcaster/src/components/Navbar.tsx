'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-700 hover:text-gray-900">
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);

const GrowthIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
    <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z"/>
  </svg>
);

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-16">
          <Link href="/" className="flex items-center gap-3 group no-underline">
            <div className="transition-all duration-300 group-hover:scale-110">
              <GrowthIcon />
            </div>
            <span className="text-2xl font-bold tracking-tight text-[#2E7D32] group-hover:text-[#4CAF50] transition-colors">
              lendfriend
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
