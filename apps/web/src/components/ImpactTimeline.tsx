'use client';

import { useState } from 'react';
import { formatUnits } from 'viem';
import { useCampaign } from '@/hooks/useCampaign';
import Link from 'next/link';
import {
  CalendarIcon,
  HeartIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowTopRightOnSquareIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

const USDC_DECIMALS = 6;
const IPFS_GATEWAY = process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/';

interface Donation {
  id: string;
  amount: string;
  timestamp: string;
  campaign: {
    id: string;
    campaignId: string;
    metadataURI: string;
    goalAmount: string;
    totalRaised: string;
    actualBalance: string;
    creator: string;
  };
}

interface ImpactTimelineProps {
  donations: Donation[];
}

function DonationCard({ donation }: { donation: Donation }) {
  const { campaign: fullCampaign } = useCampaign(donation.campaign.campaignId);
  const metadata = fullCampaign?.metadata;
  
  const amount = Number(formatUnits(BigInt(donation.amount), USDC_DECIMALS));
  const totalRaised = BigInt(donation.campaign.actualBalance || donation.campaign.totalRaised || '0');
  const goalAmount = BigInt(donation.campaign.goalAmount || '1');
  const goalReached = totalRaised >= goalAmount;
  const progressPercentage = Math.min(Number((totalRaised * BigInt(100)) / goalAmount), 100);
  
  const imageUrl = metadata?.image 
    ? `${IPFS_GATEWAY}${metadata.image.replace('ipfs://', '')}`
    : '/placeholder.png';

  const date = new Date(Number(donation.timestamp) * 1000);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const timeAgo = (timestamp: string) => {
    const now = Date.now() / 1000;
    const donationTime = Number(timestamp);
    const diffSeconds = now - donationTime;
    
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffSeconds / 3600);
    const diffDays = Math.floor(diffSeconds / 86400);
    const diffWeeks = Math.floor(diffSeconds / 604800);
    const diffMonths = Math.floor(diffSeconds / 2629746);
    
    if (diffMonths > 0) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
    if (diffWeeks > 0) return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffMinutes > 0) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  return (
    <div className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
      {/* Timeline Icon */}
      <div className="flex-shrink-0">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          goalReached ? 'bg-green-100' : 'bg-blue-100'
        }`}>
          {goalReached ? (
            <TrophyIcon className="w-5 h-5 text-green-600" />
          ) : (
            <HeartIconSolid className="w-5 h-5 text-blue-600" />
          )}
        </div>
      </div>

      {/* Campaign Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-3 flex-1 min-w-0">
            {/* Campaign Image */}
            <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
              <img 
                src={imageUrl} 
                alt={metadata?.title || 'Campaign'} 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Campaign Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-gray-900 truncate">
                  {metadata?.title || 'Loading...'}
                </h4>
                {goalReached && (
                  <div className="flex items-center gap-1 text-green-600 text-sm">
                    <CheckCircleIcon className="w-4 h-4" />
                    <span className="text-xs font-medium">Goal Reached!</span>
                  </div>
                )}
              </div>
              
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                {metadata?.description || 'Campaign description loading...'}
              </p>

              {/* Progress Bar */}
              <div className="mb-2">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>{progressPercentage.toFixed(1)}% funded</span>
                  <span>${Number(formatUnits(totalRaised, USDC_DECIMALS)).toLocaleString()} raised</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full transition-all ${
                      goalReached ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                  />
                </div>
              </div>

              {/* Date and Action */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="w-3 h-3" />
                    <span>{formattedDate}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ClockIcon className="w-3 h-3" />
                    <span>{timeAgo(donation.timestamp)}</span>
                  </div>
                </div>
                <Link
                  href={`/campaign/${donation.campaign.campaignId}`}
                  className="text-blue-600 hover:text-blue-700 text-xs font-medium flex items-center gap-1"
                >
                  View Campaign
                  <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* Donation Amount */}
          <div className="text-right flex-shrink-0">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              goalReached 
                ? 'bg-green-100 text-green-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              <HeartIcon className="w-4 h-4 mr-1" />
              ${amount.toLocaleString()}
            </div>
            {goalReached && (
              <p className="text-xs text-green-600 mt-1">🎉 You helped reach the goal!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ImpactTimeline({ donations }: ImpactTimelineProps) {
  const [showAll, setShowAll] = useState(false);
  const displayedDonations = showAll ? donations : donations.slice(0, 5);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <HeartIcon className="w-5 h-5 mr-2 text-red-500" />
          Your Impact Timeline
        </h3>
        <div className="text-sm text-gray-500">
          {donations.length} donation{donations.length !== 1 ? 's' : ''}
        </div>
      </div>

      {donations.length > 0 ? (
        <>
          <div className="space-y-4">
            {displayedDonations.map((donation) => (
              <DonationCard key={donation.id} donation={donation} />
            ))}
          </div>

          {donations.length > 5 && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                {showAll ? 'Show Less' : `Show All ${donations.length} Donations`}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8">
          <HeartIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Your donation history will appear here</p>
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Browse campaigns to get started
          </Link>
        </div>
      )}
    </div>
  );
}