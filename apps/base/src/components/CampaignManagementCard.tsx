'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatUnits } from 'viem';
import { useCampaign } from '@/hooks/useCampaign';
import WithdrawFundsModal from '@/components/WithdrawFundsModal';
import EndCampaignModal from '@/components/EndCampaignModal';
import ShareModal from '@/components/ShareModal';
import {
  BanknotesIcon,
  ChartBarIcon,
  ShareIcon,
  PencilIcon,
  PauseIcon,
  PlayIcon,
  StopIcon,
  TrashIcon,
  EllipsisVerticalIcon,
  CheckIcon,
  ClockIcon,
  FireIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';

const USDC_DECIMALS = 6;
const IPFS_GATEWAY = process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/';

interface CampaignManagementCardProps {
  campaign: any;
  isSelected: boolean;
  onSelect: (selected: boolean) => void;
  onUpdate: () => void;
}

export default function CampaignManagementCard({ 
  campaign, 
  isSelected, 
  onSelect, 
  onUpdate 
}: CampaignManagementCardProps) {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [isPausing, setIsPausing] = useState(false);

  // Fetch full campaign data including metadata
  const { campaign: fullCampaign } = useCampaign(campaign.campaignId);

  const metadata = fullCampaign?.metadata;
  const imageUrl = metadata?.image 
    ? `${IPFS_GATEWAY}${metadata.image.replace('ipfs://', '')}`
    : '/placeholder.png';

  // Calculate stats
  const totalRaised = BigInt(campaign.actualBalance || campaign.totalRaised || '0');
  const goalAmount = BigInt(campaign.goalAmount || '0');
  const raisedFormatted = formatUnits(totalRaised, USDC_DECIMALS);
  const goalFormatted = formatUnits(goalAmount, USDC_DECIMALS);
  const percentComplete = goalAmount > 0 
    ? Math.min(Number((totalRaised * BigInt(100)) / goalAmount), 100)
    : 0;

  // Donor count
  const contributors = new Set([
    ...(campaign.contributions?.map((c: any) => c.contributor) || []),
    ...(campaign.directTransfers?.map((dt: any) => dt.from) || [])
  ]);
  const donorCount = contributors.size;

  // Status - using heuristics since isActive/endedAt fields don't exist
  const isRecent = (Date.now() / 1000 - Number(campaign.createdAt || 0)) < 90 * 24 * 60 * 60; // 90 days
  const reachedGoal = totalRaised >= goalAmount && goalAmount > BigInt(0);
  const isActive = !reachedGoal && isRecent && goalAmount > BigInt(0);
  const isDraft = totalRaised === BigInt(0);
  const hasRecentActivity = false; // TODO: Check timestamps

  // Performance indicator
  const getPerformanceIndicator = () => {
    if (isDraft) return null;
    if (percentComplete > 70) return { icon: ArrowTrendingUpIcon, color: 'text-green-600', label: 'Trending' };
    if (percentComplete > 30) return { icon: FireIcon, color: 'text-orange-600', label: 'Active' };
    return { icon: ArrowTrendingDownIcon, color: 'text-red-600', label: 'Needs attention' };
  };

  const performance = getPerformanceIndicator();

  const handlePauseResume = async () => {
    setIsPausing(true);
    try {
      // TODO: Implement pause/resume functionality
      console.log('Pause/Resume campaign:', campaign.id);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onUpdate();
    } catch (error) {
      console.error('Failed to pause/resume campaign:', error);
    } finally {
      setIsPausing(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
        <div className="p-6">
          <div className="flex gap-6">
            {/* Checkbox and Image */}
            <div className="flex items-start gap-4">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => onSelect(e.target.checked)}
                className="mt-2 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <img 
                  src={imageUrl} 
                  alt={metadata?.title || 'Campaign'} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {metadata?.title || 'Loading...'}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    {/* Status Badge */}
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      isActive 
                        ? 'bg-green-100 text-green-800' 
                        : isDraft 
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {isActive ? (
                        <>
                          <CheckIcon className="w-3 h-3 mr-1" />
                          Active
                        </>
                      ) : isDraft ? (
                        <>
                          <ClockIcon className="w-3 h-3 mr-1" />
                          Draft
                        </>
                      ) : (
                        <>
                          <StopIcon className="w-3 h-3 mr-1" />
                          Ended
                        </>
                      )}
                    </span>

                    {/* Performance Badge */}
                    {performance && (
                      <span className={`inline-flex items-center gap-1 text-xs font-medium ${performance.color}`}>
                        <performance.icon className="w-3 h-3" />
                        {performance.label}
                      </span>
                    )}

                    {/* Campaign ID */}
                    <span className="text-xs text-gray-500">
                      ID: #{campaign.campaignId}
                    </span>
                  </div>
                </div>

                {/* Actions Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowActions(!showActions)}
                    className="p-1 rounded-lg hover:bg-gray-100"
                  >
                    <EllipsisVerticalIcon className="w-5 h-5 text-gray-500" />
                  </button>
                  
                  {showActions && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                      <button
                        onClick={() => {
                          // TODO: Navigate to edit page
                          setShowActions(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <PencilIcon className="w-4 h-4" />
                        Edit Campaign
                      </button>
                      
                      {isActive && (
                        <button
                          onClick={() => {
                            handlePauseResume();
                            setShowActions(false);
                          }}
                          disabled={isPausing}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        >
                          <PauseIcon className="w-4 h-4" />
                          Pause Campaign
                        </button>
                      )}
                      
                      {!isDraft && (
                        <button
                          onClick={() => {
                            setShowEndModal(true);
                            setShowActions(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <StopIcon className="w-4 h-4" />
                          End Campaign
                        </button>
                      )}
                      
                      {isDraft && (
                        <button
                          onClick={() => {
                            // TODO: Implement delete
                            setShowActions(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <TrashIcon className="w-4 h-4" />
                          Delete Draft
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-semibold text-gray-900">
                    ${Number(raisedFormatted).toLocaleString()}
                  </span>
                  <span className="text-gray-600">
                    of ${Number(goalFormatted).toLocaleString()} goal
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${percentComplete}%` }}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <BanknotesIcon className="w-4 h-4" />
                  <span>{donorCount} donors</span>
                </div>
                {hasRecentActivity && (
                  <div className="flex items-center gap-1 text-orange-600">
                    <FireIcon className="w-4 h-4" />
                    <span>3 new today</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <ClockIcon className="w-4 h-4" />
                  <span>Created {new Date(Number(campaign.createdAt) * 1000).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-4">
                {totalRaised > BigInt(0) && (
                  <button
                    onClick={() => setShowWithdrawModal(true)}
                    className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <BanknotesIcon className="w-4 h-4 mr-1.5" />
                    Withdraw
                  </button>
                )}
                
                <Link
                  href={`/campaign/${campaign.campaignId}/analytics`}
                  className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <ChartBarIcon className="w-4 h-4 mr-1.5" />
                  Analytics
                </Link>
                
                <button
                  onClick={() => setShowShareModal(true)}
                  className="inline-flex items-center px-3 py-1.5 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <ShareIcon className="w-4 h-4 mr-1.5" />
                  Share
                </button>
                
                <Link
                  href={`/campaign/${campaign.campaignId}`}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  View Campaign
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showWithdrawModal && (
        <WithdrawFundsModal
          campaign={campaign}
          onClose={() => setShowWithdrawModal(false)}
          onSuccess={() => {
            setShowWithdrawModal(false);
            onUpdate();
          }}
        />
      )}

      {showEndModal && (
        <EndCampaignModal
          campaign={campaign}
          onClose={() => setShowEndModal(false)}
          onSuccess={() => {
            setShowEndModal(false);
            onUpdate();
          }}
        />
      )}

      {showShareModal && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          campaignId={campaign.campaignId}
          campaignTitle={metadata?.title || 'Campaign'}
        />
      )}
    </>
  );
}