"use client";

import Link from "next/link";
import { formatUnits } from "viem";
import { useIPFSMetadata } from "@/hooks/useIPFSMetadata";
import { ProcessedCampaign } from "@/hooks/useCampaign";

const USDC_DECIMALS = 6;
const IPFS_GATEWAY = "https://ipfs.io/ipfs/";

interface CampaignCardProps {
  campaign: ProcessedCampaign;
}

// A placeholder component to show while metadata is loading
function CampaignCardSkeleton() {
  return (
    <div className="flex flex-col bg-white animate-pulse">
      <div className="pb-2">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gray-200 mr-2.5"></div>
          <div className="h-3 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
      <div className="relative w-full h-48 bg-gray-200 rounded-xl"></div>
      <div className="pt-3">
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-2 bg-gray-100 rounded-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </div>
    </div>
  );
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  // Show a skeleton card while metadata is loading from IPFS
  if (!campaign.metadata) {
    return <CampaignCardSkeleton />;
  }

  const {
    goalAmount,
    totalRaised,
    actualBalance,
    creator,
    campaignAddress,
    metadata,
  } = campaign;

  const safeGoalAmount = goalAmount?.toString().replace(/[^0-9]/g, '') || '0';
  const safeTotalRaised = (actualBalance || totalRaised)?.toString().replace(/[^0-9]/g, '') || '0';
  
  const displayGoalAmount = formatUnits(BigInt(safeGoalAmount), USDC_DECIMALS);
  const displayTotalRaised = formatUnits(BigInt(safeTotalRaised), USDC_DECIMALS);
  const goalAmountNum = parseFloat(displayGoalAmount);
  const totalRaisedNum = parseFloat(displayTotalRaised);

  const formattedGoal = new Intl.NumberFormat("en-US").format(goalAmountNum);
  const formattedRaised = new Intl.NumberFormat("en-US").format(
    totalRaisedNum
  );

  let progressPercentage = 0;
  if (totalRaisedNum > 0 && goalAmountNum > 0) {
    progressPercentage = Math.min((totalRaisedNum / goalAmountNum) * 100, 100);
  }

  return (
    <Link href={`/campaign/${campaign.campaignNumericId}`} className="block">
      <div className="flex flex-col bg-white rounded-xl p-6">
        {/* Farcaster Avatar/Name Header */}
        <div className="pb-3">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6BBAA7] to-[#6C95C0] mr-2.5"></div>
            <span className="text-sm font-medium text-gray-700 truncate">
              {`${creator.substring(0, 6)}...${creator.substring(
                creator.length - 4
              )}`}
            </span>
          </div>
        </div>

        {/* Image Section */}
        <div className="relative w-full h-64 overflow-hidden bg-gray-100 rounded-xl mb-4">
          <img
            src={
              metadata.image
                ? `${IPFS_GATEWAY}${metadata.image.replace("ipfs://", "")}`
                : "/placeholder.png"
            }
            alt={metadata.title || "Campaign Image"}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Supporter Count Section - Clean and consistent height */}
        <div className="py-2 flex items-center text-sm text-gray-600 mb-3">
          <div className="flex -space-x-1.5 mr-2">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 ring-1 ring-white"></div>
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 ring-1 ring-white"></div>
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-green-400 to-emerald-400 ring-1 ring-white"></div>
          </div>
          <span className="font-medium">
            {campaign.contributions?.length || 0} supporters
          </span>
        </div>

        {/* Content Section */}
        <div>
          {/* Title */}
          <h3 className="text-lg font-sans font-semibold text-gray-900 mb-4 line-clamp-2">
            {metadata.title || "Untitled Campaign"}
          </h3>

          {/* Progress Bar */}
          <div className="mb-2">
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{ 
                  width: `${progressPercentage}%`,
                  background: progressPercentage > 0 
                    ? 'linear-gradient(90deg, #6BBAA7 0%, #6C95C0 100%)' 
                    : 'transparent'
                }}
              ></div>
            </div>
          </div>

          {/* Raised Amount */}
          <div className="text-sm">
            <span className="font-bold text-gray-900">${formattedRaised} raised</span>
          </div>
        </div>
      </div>
    </Link>
  );
} 