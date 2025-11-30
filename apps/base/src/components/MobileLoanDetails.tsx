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
  const [selectedTab, setSelectedTab] = useState<"story" | "updates" | "backers">("story");

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

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setSelectedTab("story")}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  selectedTab === "story"
                    ? "text-[#2C7A7B] border-b-2 border-[#2C7A7B]"
                    : "text-gray-500"
                }`}
              >
                Story
              </button>
              <button
                onClick={() => setSelectedTab("updates")}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  selectedTab === "updates"
                    ? "text-[#2C7A7B] border-b-2 border-[#2C7A7B]"
                    : "text-gray-500"
                }`}
              >
                Updates ({mockLoan.updates.length})
              </button>
              <button
                onClick={() => setSelectedTab("backers")}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  selectedTab === "backers"
                    ? "text-[#2C7A7B] border-b-2 border-[#2C7A7B]"
                    : "text-gray-500"
                }`}
              >
                Backers ({mockLoan.backers})
              </button>
            </div>

            <div className="p-4">
              {selectedTab === "story" && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {mockLoan.description}
                  </p>

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
              )}

              {selectedTab === "updates" && (
                <div className="space-y-3">
                  {mockLoan.updates.map((update, index) => (
                    <div key={index} className="border-l-2 border-gray-200 pl-3">
                      <p className="text-xs text-gray-500">{update.date}</p>
                      <p className="text-sm text-gray-700 mt-1">{update.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {selectedTab === "backers" && (
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

                  {mockLoan.backers > 3 && (
                    <button className="w-full text-center text-sm text-gray-500 py-2">
                      View all {mockLoan.backers} backers
                    </button>
                  )}
                </div>
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