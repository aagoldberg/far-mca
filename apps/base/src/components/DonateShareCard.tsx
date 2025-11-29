"use client";

import { useState, useEffect, useMemo } from "react";
import Link from 'next/link';
import ShareModal from './ShareModal';
import { useCampaign } from '@/hooks/useCampaign';
import { formatUnits } from "viem";
import { useCDPAuth } from '@/hooks/useCDPAuth';
import { getSocialProfile, formatDisplayName, PlatformBadges, TrustIndicator } from '@/utils/socialUtils';

const USDC_DECIMALS = 6;

type DonateShareCardProps = {
  campaignNumericId: string;
  onDonateClick: () => void;
};

export default function DonateShareCard({ campaignNumericId, onDonateClick }: DonateShareCardProps) {
  const [isShareModalOpen, setShareModalOpen] = useState(false);
  const [showAllDonors, setShowAllDonors] = useState(false);
  const [showTopDonors, setShowTopDonors] = useState(false);
  const { campaign, loading, error } = useCampaign(campaignNumericId);
  const { user } = useCDPAuth();
  
  // Process donation data to get all donation lists
  const donationStats = useMemo(() => {
    if (!campaign) return { 
      recent: null, 
      top: null, 
      first: null, 
      allDonations: [], 
      sortedByTime: [], 
      sortedByAmount: [] 
    };
    
    // Combine all donations
    const allDonations = [
      ...(campaign.contributions || []).map((c: any) => ({
        ...c,
        type: 'wallet',
        address: c.contributor,
        displayAmount: formatUnits(BigInt(c.amount || 0), USDC_DECIMALS)
      })),
      ...(campaign.directTransfers || []).map((d: any) => ({
        ...d,
        type: 'coinbase',
        address: d.from,
        displayAmount: formatUnits(BigInt(d.amount || 0), USDC_DECIMALS)
      }))
    ];
    
    if (allDonations.length === 0) return { 
      recent: null, 
      top: null, 
      first: null, 
      allDonations: [], 
      sortedByTime: [], 
      sortedByAmount: [] 
    };
    
    // Sort by timestamp for recent
    const sortedByTime = [...allDonations].sort((a, b) => 
      parseInt(b.timestamp || '0') - parseInt(a.timestamp || '0')
    );
    
    // Sort by amount for top
    const sortedByAmount = [...allDonations].sort((a, b) => 
      parseFloat(b.displayAmount) - parseFloat(a.displayAmount)
    );
    
    // Get first donation (oldest)
    const first = sortedByTime[sortedByTime.length - 1];
    
    return {
      recent: sortedByTime[0] || null,
      top: sortedByAmount[0] || null,
      first: first || null,
      allDonations,
      sortedByTime,
      sortedByAmount
    };
  }, [campaign]);

  if (loading) {
    return (
      <div className="sticky top-24 p-6 bg-white rounded-xl shadow-lg border">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="sticky top-24 p-6 bg-white rounded-xl shadow-lg border">
        <div className="text-center text-gray-500">
          Unable to load donation information
        </div>
      </div>
    );
  }

  const goalAmountNum = campaign.goalAmount ? parseFloat(formatUnits(BigInt(campaign.goalAmount), USDC_DECIMALS)) : 0;
  // Use actualBalance for total raised (includes both wallet donations and Coinbase Pay)
  const actualBalanceNum = campaign.actualBalance ? parseFloat(formatUnits(BigInt(campaign.actualBalance), USDC_DECIMALS)) : 0;
  const totalContributions = (campaign.contributions?.length || 0) + (campaign.directTransfers?.length || 0);

  const formattedGoal = new Intl.NumberFormat('en-US').format(goalAmountNum);
  const formattedRaised = new Intl.NumberFormat('en-US').format(actualBalanceNum);
  
  const progress = goalAmountNum > 0 ? Math.min((actualBalanceNum / goalAmountNum) * 100, 100) : 0;
  
  // Helper function to get donor profile data
  const getDonorProfile = (address: string) => {
    if (!address) return { name: 'Anonymous', avatar: null, platforms: [], trustScore: 0 };
    
    // Check if this is the current user and they have social data
    if (user?.wallet?.address?.toLowerCase() === address.toLowerCase()) {
      const profile = getSocialProfile(user);
      return {
        name: formatDisplayName(user, address),
        avatar: profile.avatar,
        platforms: profile.platforms,
        trustScore: profile.trustScore
      };
    }
    
    // For other donors, show abbreviated address with default data
    return {
      name: `${address.substring(0, 6)}...${address.substring(address.length - 4)}`,
      avatar: null,
      platforms: [],
      trustScore: 0
    };
  };

  // Helper component to render donation items
  const DonationItem = ({ donation, label }: { donation: any, label?: string }) => {
    const profile = getDonorProfile(donation.address);
    
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1 min-w-0">
          {profile.avatar ? (
            <img 
              src={profile.avatar}
              alt="Donor"
              className="w-7 h-7 rounded-full object-cover mr-2 flex-shrink-0"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 mr-2 flex-shrink-0 flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <p className="text-base font-medium text-gray-900 truncate">
                {profile.name}
              </p>
              {profile.trustScore > 0 && (
                <TrustIndicator score={profile.trustScore} className="flex-shrink-0" />
              )}
            </div>
            <div className="flex items-center space-x-2">
              {label && <p className="text-sm text-gray-500">{label}</p>}
              {profile.platforms.length > 0 && (
                <PlatformBadges platforms={profile.platforms} maxDisplay={2} className="flex-shrink-0" />
              )}
            </div>
          </div>
        </div>
        <span className="text-base font-medium text-gray-900 ml-2 flex-shrink-0">
          ${new Intl.NumberFormat('en-US').format(parseFloat(donation.displayAmount))}
        </span>
      </div>
    );
  };


  return (
    <>
      <div className="sticky top-24 p-3 bg-white rounded-2xl shadow-sm border border-gray-200 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-sans font-semibold text-gray-900">${formattedRaised} raised</h2>
            <p className="text-gray-600 text-base">
              <span className="font-medium">${formattedGoal} goal</span> · <span className="font-medium">{totalContributions} donations</span>
            </p>
          </div>
          <div className="relative w-14 h-14 flex-shrink-0 ml-1">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6BBAA7" />
                  <stop offset="100%" stopColor="#29738F" />
                </linearGradient>
              </defs>
              <path
                className="text-gray-100"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                strokeWidth="3"
                strokeDasharray={`${progress}, 100`}
                strokeDashoffset="0"
                stroke="url(#progressGradient)"
                fill="none"
                strokeLinecap="round"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-[#29738F]">
                {goalAmountNum > 0 ? `${Math.round(progress)}%` : '0%'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="space-y-1.5">
          <button 
            onClick={onDonateClick}
            className="w-full bg-gradient-to-r from-[#29738F] to-[#6BBAA7] hover:from-[#1E5A73] hover:to-[#5AA695] text-white font-semibold py-3 rounded-xl text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] relative overflow-hidden group"
          >
            {/* Subtle shimmer effect */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-full transition-transform duration-1000"></div>
            <span className="relative z-10">Donate</span>
          </button>
          
          <button 
            onClick={() => setShareModalOpen(true)}
            className="w-full bg-white hover:bg-gray-50 text-[#29738F] font-semibold py-3 rounded-xl text-lg border border-[#29738F] transition-colors duration-200 flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Share
          </button>
        </div>

        {/* Donation Stats Section */}
        <div className="pt-3 border-t border-gray-100">

          {/* Recent Donors List */}
          <div className="space-y-3">
            {showAllDonors ? (
              // Show all donations in chronological order
              <>
                {donationStats.sortedByTime.length > 0 ? (
                  <div className="max-h-80 overflow-y-auto space-y-3">
                    {donationStats.sortedByTime.map((donation, index) => (
                      <DonationItem key={`${donation.address}-${donation.timestamp}-${index}`} donation={donation} />
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 text-sm py-2">
                    No donations yet. Be the first to donate!
                  </p>
                )}
              </>
            ) : showTopDonors ? (
              // Show top donations by amount
              <>
                {donationStats.sortedByAmount.length > 0 ? (
                  <div className="max-h-80 overflow-y-auto space-y-3">
                    {donationStats.sortedByAmount.map((donation, index) => (
                      <DonationItem 
                        key={`${donation.address}-${donation.amount}-${index}`} 
                        donation={donation} 
                        label={index === 0 ? '🏆 Top contributor' : index === 1 ? '🥈 2nd biggest' : index === 2 ? '🥉 3rd biggest' : undefined}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 text-sm py-2">
                    No donations yet. Be the first to donate!
                  </p>
                )}
              </>
            ) : (
              // Default view - show 5 most recent donations
              <>
                {donationStats.sortedByTime.length > 0 ? (
                  <>
                    {donationStats.sortedByTime.slice(0, 5).map((donation, index) => {
                      // Only show time-based labels - no fake social connections
                      let label = undefined;
                      
                      const timeDiff = Date.now() - parseInt(donation.timestamp) * 1000;
                      const minutes = Math.floor(timeDiff / 60000);
                      const hours = Math.floor(timeDiff / 3600000);
                      const days = Math.floor(timeDiff / 86400000);
                      
                      if (minutes < 60) label = `${minutes} mins ago`;
                      else if (hours < 24) label = `${hours}h ago`;
                      else if (days < 7) label = `${days}d ago`;
                      // No label for donations older than a week
                      
                      return (
                        <DonationItem 
                          key={`${donation.address}-${donation.timestamp}-${index}`} 
                          donation={donation} 
                          label={label}
                        />
                      );
                    })}
                    {donationStats.sortedByTime.length > 5 && (
                      <p className="text-center text-sm text-gray-500 mt-2">
                        +{donationStats.sortedByTime.length - 5} more donations
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-center text-gray-500 text-sm py-2">
                    No donations yet. Be the first to donate!
                  </p>
                )}
              </>
            )}
          </div>

          {/* See all / See top buttons - only show if more than 5 donations */}
          {donationStats.allDonations.length > 5 && (
            <div className="flex gap-1 mt-3">
              <button 
                onClick={() => {
                  setShowAllDonors(!showAllDonors);
                  setShowTopDonors(false);
                }}
                className={`flex-1 py-2 px-2 text-base font-medium rounded-lg transition-colors duration-200 ${
                  showAllDonors 
                    ? 'bg-[#29738F] text-white' 
                    : 'text-gray-700 bg-gray-50 hover:bg-gray-100'
                }`}
              >
                {showAllDonors ? 'Show less' : `See all ${donationStats.allDonations.length}`}
              </button>
              <button 
                onClick={() => {
                  setShowTopDonors(!showTopDonors);
                  setShowAllDonors(false);
                }}
                className={`flex-1 py-2 px-2 text-base font-medium rounded-lg transition-colors duration-200 flex items-center justify-center ${
                  showTopDonors 
                    ? 'bg-[#29738F] text-white' 
                    : 'text-gray-700 bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                {showTopDonors ? 'Show less' : 'See top'}
              </button>
            </div>
          )}
        </div>
      </div>

      <ShareModal 
        isOpen={isShareModalOpen}
        onClose={() => setShareModalOpen(false)}
        campaignId={campaignNumericId}
        campaignTitle={campaign.metadata?.title || 'Campaign'}
      />
    </>
  );
} 