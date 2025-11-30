"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useMiniAppWallet } from "@/hooks/useMiniAppWallet";

// Enhanced mobile-first loan card with Farcaster-inspired UX
function MiniLoanCard({ loan }: { loan: any }) {
  const progress = (loan.raised / loan.goal) * 100;
  const hasContributors = loan.contributors && loan.contributors > 0;

  return (
    <Link href={`/loan/${loan.id}`} className="block group">
      <div className="relative bg-white rounded-xl shadow-sm hover:shadow-lg active:shadow-xl transition-all duration-300 overflow-hidden">
        {/* Hover gradient border effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#3B9B7F]/10 via-transparent to-[#2E7D68]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />

        {/* Loan image */}
        {loan.imageUrl && (
          <div className="relative w-full bg-gray-100" style={{ paddingBottom: '56.25%' /* 16:9 aspect ratio */ }}>
            <img
              src={loan.imageUrl}
              alt={loan.title}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}

        <div className="relative p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-sm leading-tight group-hover:text-[#2E7D68] transition-colors">
                {loan.title}
              </h3>
              <p className="text-xs text-gray-500 mt-1">by @{loan.creator}</p>
            </div>
            <div className="flex items-center gap-1 text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded-lg">
              <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{loan.daysLeft}d left</span>
            </div>
          </div>

          <div className="space-y-2">
            {/* Enhanced progress bar with gradient and shimmer */}
            <div className="relative w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-200" />
              <div
                className="relative h-full rounded-full transition-all duration-500 bg-gradient-to-r from-[#3B9B7F] to-[#2E7D68] shadow-sm"
                style={{ width: `${Math.min(progress, 100)}%` }}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              </div>
            </div>

            <div className="flex justify-between items-baseline">
              <span className="text-sm font-bold bg-gradient-to-r from-[#3B9B7F] to-[#2E7D68] bg-clip-text text-transparent">
                ${loan.raised.toLocaleString()}
              </span>
              <span className="text-xs text-gray-500">
                of ${loan.goal.toLocaleString()}
              </span>
            </div>

            {/* Contributors footer */}
            <div className="pt-2 mt-2 border-t border-gray-100/80">
              {hasContributors ? (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>{loan.contributors} {loan.contributors === 1 ? 'supporter' : 'supporters'}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-gray-400 italic">
                  <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>Be the first supporter</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const { isConnected, connect } = useMiniAppWallet();
  const [activeTab, setActiveTab] = useState<'browse' | 'my-loans'>('browse');

  // Mock data with images and contributor counts - replace with real data
  const mockLoans = [
    {
      id: "0x1234567890123456789012345678901234567890",
      title: "Sewing Machine for Business",
      creator: "andrewag",
      raised: 10,
      goal: 600,
      daysLeft: 27,
      contributors: 0,
      imageUrl: "https://images.unsplash.com/photo-1517840901100-8179e982acb7?w=800&q=80" // Sewing machine
    },
    {
      id: "0x2345678901234567890123456789012345678901",
      title: "Food Truck Equipment",
      creator: "maria",
      raised: 250,
      goal: 2000,
      daysLeft: 15,
      contributors: 3,
      imageUrl: "https://images.unsplash.com/photo-1567129937968-cdad8f07e2f8?w=800&q=80" // Food truck
    },
    {
      id: "0x3456789012345678901234567890123456789012",
      title: "Laptop for Coding Bootcamp",
      creator: "james",
      raised: 800,
      goal: 1200,
      daysLeft: 8,
      contributors: 12,
      imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80" // Laptop coding
    },
    {
      id: "0x4567890123456789012345678901234567890123",
      title: "Inventory for Online Store",
      creator: "sarah",
      raised: 450,
      goal: 1500,
      daysLeft: 21,
      contributors: 5,
      imageUrl: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80" // Warehouse/inventory
    },
  ];

  return (
    <main className="h-screen bg-gray-50 flex flex-col">
      {/* Compact Header */}
      <div className="bg-white px-4 py-3 border-b border-gray-200">
        <p className="text-xs text-gray-600 text-center">
          Community lending with 0% interest
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white px-4 border-b border-gray-200">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('browse')}
            className={`py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'browse'
                ? 'text-[#2C7A7B] border-[#2C7A7B]'
                : 'text-gray-500 border-transparent'
            }`}
          >
            Browse Loans
          </button>
          <button
            onClick={() => setActiveTab('my-loans')}
            className={`py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'my-loans'
                ? 'text-[#2C7A7B] border-[#2C7A7B]'
                : 'text-gray-500 border-transparent'
            }`}
          >
            My Activity
          </button>
        </div>
      </div>

      {/* Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-24">
        {activeTab === 'browse' ? (
          <>
            {/* Active Loans */}
            <div className="space-y-3">
              {mockLoans.map(loan => (
                <MiniLoanCard key={loan.id} loan={loan} />
              ))}
            </div>

            {/* Load More */}
            <button className="w-full mt-4 py-3 text-sm text-gray-600 font-medium">
              Load more loans
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            {isConnected ? (
              <div className="text-center">
                <p className="text-gray-500 mb-4">No activity yet</p>
                <Link
                  href="/create-loan"
                  className="text-[#2C7A7B] font-medium text-sm"
                >
                  Create your first loan →
                </Link>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-gray-600 mb-4">Sign in to see your activity</p>
                <button
                  onClick={connect}
                  className="px-6 py-2 bg-[#2C7A7B] text-white rounded-lg font-medium text-sm"
                >
                  Connect Wallet
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <Link
        href="/create-loan"
        className="fixed bottom-6 right-4 w-14 h-14 bg-[#2C7A7B] rounded-full shadow-lg flex items-center justify-center hover:bg-[#234E52] transition-colors z-10"
        aria-label="Create loan"
      >
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </Link>

      {/* Bottom Safe Area for iOS */}
      <div className="h-safe-bottom bg-white" />
    </main>
  );
}