"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon, ShareIcon, HeartIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { useMiniAppWallet } from "@/hooks/useMiniAppWallet";

// Mock loan data - replace with actual data fetching
const mockLoan = {
  id: "1",
  address: "0x123...",
  title: "Sewing Machine for Business",
  creator: "andrewag",
  creatorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=andrewag",
  description: "I need a professional sewing machine to start my tailoring business. I've been taking orders but using a basic machine that keeps breaking down. With a proper industrial machine, I can fulfill more orders and grow my business. I already have 5 regular clients waiting for custom pieces.",
  imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
  goal: 600,
  raised: 425,
  backers: 12,
  daysLeft: 27,
  repaymentWeeks: 12,
  purpose: "Equipment",
  // Additional borrower info
  aboutBorrower: "I'm a self-taught tailor with 3 years of experience. Started making clothes for family, now have regular clients. Member of local artisan community.",
  businessWebsite: "https://sarahstitches.com",
  twitterHandle: "@sarahstitches",
  monthlyIncome: "$1,500 - $2,000",
  creditScore: 720,
  fundBreakdown: [
    { item: "Professional sewing machine", amount: 400 },
    { item: "Quality fabric and materials", amount: 150 },
    { item: "Workspace improvements", amount: 50 },
  ],
  updates: [
    { date: "2 days ago", text: "Reached 70% of goal! Thank you everyone!" },
    { date: "5 days ago", text: "Added photos of my current workspace" },
  ],
  contributions: [
    { name: "Sarah", amount: 50, time: "1 hour ago", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah" },
    { name: "Mike", amount: 100, time: "3 hours ago", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike" },
    { name: "Emma", amount: 25, time: "1 day ago", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma" },
  ],
};

interface MobileLoanDetailsProps {
  loanAddress: `0x${string}`;
}

export default function MobileLoanDetails({ loanAddress }: MobileLoanDetailsProps) {
  const router = useRouter();
  const { isConnected, connect } = useMiniAppWallet();
  const [isLiked, setIsLiked] = useState(false);

  const progress = (mockLoan.raised / mockLoan.goal) * 100;
  const weeklyPayment = (mockLoan.goal / mockLoan.repaymentWeeks).toFixed(2);

  const handleFund = async () => {
    if (!isConnected) {
      await connect();
      return;
    }
    router.push(`/loan/${loanAddress}/fund`);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: mockLoan.title,
          text: `Help fund: ${mockLoan.title}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Go back"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Like"
            >
              {isLiked ? (
                <HeartSolidIcon className="w-5 h-5 text-red-500" />
              ) : (
                <HeartIcon className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={handleShare}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Share"
            >
              <ShareIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Content with padding for fixed bottom bar */}
      <div className="flex-1 overflow-y-auto pb-28">
        {/* Hero Image */}
        <div className="relative h-48 bg-gray-200">
          <img
            src={mockLoan.imageUrl}
            alt={mockLoan.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-full text-xs font-medium">
            {mockLoan.purpose}
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 space-y-4">
          {/* Title and Creator */}
          <div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">{mockLoan.title}</h1>

            <Link href={`/profile/${mockLoan.creator}`} className="flex items-center gap-2">
              <img
                src={mockLoan.creatorAvatar}
                alt={mockLoan.creator}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">@{mockLoan.creator}</p>
                <p className="text-xs text-gray-500">Verified member</p>
              </div>
            </Link>
          </div>

          {/* Progress Card */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-2xl font-bold text-[#2C7A7B]">${mockLoan.raised}</span>
              <span className="text-sm text-gray-500">of ${mockLoan.goal}</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-[#2C7A7B] to-[#3B9B7F] relative overflow-hidden"
                style={{ width: `${Math.min(progress, 100)}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-shimmer" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-lg font-semibold">{mockLoan.backers}</p>
                <p className="text-xs text-gray-500">backers</p>
              </div>
              <div>
                <p className="text-lg font-semibold">{mockLoan.daysLeft}</p>
                <p className="text-xs text-gray-500">days left</p>
              </div>
              <div>
                <p className="text-lg font-semibold">${weeklyPayment}</p>
                <p className="text-xs text-gray-500">weekly</p>
              </div>
            </div>
          </div>

          {/* About the Borrower */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900 mb-3">About Me</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              {mockLoan.aboutBorrower}
            </p>

            {/* Social Links */}
            {(mockLoan.businessWebsite || mockLoan.twitterHandle) && (
              <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                {mockLoan.businessWebsite && (
                  <a
                    href={mockLoan.businessWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#2C7A7B] hover:underline flex items-center gap-1"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    Website
                  </a>
                )}
                {mockLoan.twitterHandle && (
                  <a
                    href={`https://twitter.com/${mockLoan.twitterHandle.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#2C7A7B] hover:underline flex items-center gap-1"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    {mockLoan.twitterHandle}
                  </a>
                )}
              </div>
            )}

            {/* Credit Score Badge */}
            {mockLoan.creditScore && (
              <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 rounded-full">
                <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-xs font-medium text-green-700">Credit Score: {mockLoan.creditScore}</span>
              </div>
            )}
          </div>

          {/* Loan Story Section */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900 mb-3">My Story</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {mockLoan.description}
            </p>
          </div>

          {/* How I'll Use the Funds */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900 mb-3">How I'll Use the Funds</h2>
            <div className="space-y-2">
              {mockLoan.fundBreakdown.map((item, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-[#2C7A7B] rounded-full mt-1.5"></div>
                  <p className="text-sm text-gray-700 flex-1">{item.item} (${item.amount})</p>
                </div>
              ))}
            </div>
          </div>

          {/* Impact & Goals */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900 mb-3">Expected Impact</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              With this equipment, I can increase my output from 5 to 20 pieces per week,
              serving my existing 5 clients and taking on 10 new customers who are already
              on my waiting list.
            </p>
          </div>

          {/* Repayment Plan */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900 mb-3">Repayment Plan</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Weekly Payment</span>
                <span className="text-sm font-semibold">${weeklyPayment}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Duration</span>
                <span className="text-sm font-semibold">{mockLoan.repaymentWeeks} weeks</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total to Repay</span>
                <span className="text-sm font-semibold">${mockLoan.goal}</span>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">0% Interest</p>
                    <p className="text-xs text-blue-700 mt-1">
                      This is a community loan with no interest or hidden fees
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Updates */}
          {mockLoan.updates.length > 0 && (
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h2 className="text-base font-semibold text-gray-900 mb-3">Recent Updates</h2>
              <div className="space-y-3">
                {mockLoan.updates.map((update, index) => (
                  <div key={index} className="border-l-2 border-gray-200 pl-3">
                    <p className="text-xs text-gray-500">{update.date}</p>
                    <p className="text-sm text-gray-700 mt-1">{update.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Backers */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900 mb-3">
              Recent Backers ({mockLoan.backers})
            </h2>
            <div className="space-y-3">
              {mockLoan.contributions.map((contribution, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={contribution.avatar}
                      alt={contribution.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="text-sm font-medium">{contribution.name}</p>
                      <p className="text-xs text-gray-500">{contribution.time}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-[#2C7A7B]">
                    ${contribution.amount}
                  </span>
                </div>
              ))}
              {mockLoan.backers > mockLoan.contributions.length && (
                <p className="text-center text-sm text-gray-500 pt-2">
                  + {mockLoan.backers - mockLoan.contributions.length} more backers
                </p>
              )}
            </div>
          </div>

          {/* Trust Badge */}
          <div className="bg-green-50 rounded-lg p-3 text-xs text-green-700">
            <div className="font-medium mb-1">Community verified</div>
            <div>This loan request has been reviewed by the community</div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 pb-safe z-10">
        <div className="flex gap-3">
          <button
            onClick={handleFund}
            className="flex-1 py-3 bg-[#2C7A7B] text-white rounded-lg font-medium"
          >
            {isConnected ? "Fund this loan" : "Sign in to Fund"}
          </button>
          <button
            onClick={handleShare}
            className="px-5 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <ShareIcon className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-center text-gray-500 mt-2">
          Min. contribution $5 · Max. ${mockLoan.goal - mockLoan.raised}
        </p>
      </div>
    </main>
  );
}