'use client';

import React from 'react';
import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';
import { useCampaigns, ProcessedCampaign } from '@/hooks/useCampaign';
import { formatUnits } from 'viem';
import { usePrivy } from '@privy-io/react-auth';
import { getSocialProfile, formatDisplayName } from '@/utils/socialUtils';

const USDC_DECIMALS = 6;

// Define the GraphQL query to fetch campaigns with enhanced data
const GET_CAMPAIGNS = gql`
  query GetCampaigns {
    campaigns(orderBy: createdAt, orderDirection: desc) {
      id
      campaignId
      creator
      metadataURI
      goalAmount
      totalRaised
      totalDirectTransfers
      actualBalance
      contributions(orderBy: timestamp, orderDirection: desc, first: 5) {
        id
        contributor
        amount
        timestamp
      }
      directTransfers(orderBy: timestamp, orderDirection: desc, first: 5) {
        id
        from
        amount
        timestamp
      }
    }
  }
`;

const CampaignList = () => {
  const { loading, error, data } = useQuery(GET_CAMPAIGNS, {
    fetchPolicy: 'network-only', 
  });
  
  const { campaigns: processedCampaigns, loading: processingLoading, error: processingError } = useCampaigns(data?.campaigns);

  if (loading || processingLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-1">
        {[...Array(6)].map((_, i) => <CampaignCardSkeleton key={i} />)}
      </div>
    );
  }
  if (error) return <p className="text-center text-red-500">Error loading campaigns: {error.message}</p>;
  if (processingError) return <p className="text-center text-red-500">Error processing campaigns: {processingError}</p>;
  if (!processedCampaigns || processedCampaigns.length === 0) return <p className="text-center">No campaigns found.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-1">
      {processedCampaigns.map((campaign) => (
        <CampaignCard key={campaign.campaignAddress} campaign={campaign} />
      ))}
    </div>
  );
};

export default CampaignList;

// --- Campaign Card with restored UI ---

interface CampaignCardProps {
    campaign: ProcessedCampaign;
}

const IPFS_GATEWAY = process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/';

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

const CampaignCard = ({ campaign }: CampaignCardProps) => {
    const { user } = usePrivy();
    
    if (!campaign.metadata) {
        return <CampaignCardSkeleton />;
    }
    
    console.log('Campaign data:', campaign); // Debug log

    const {
        goalAmount,
        totalRaised,
        actualBalance,
        metadata,
        contributions = [],
        directTransfers = [],
    } = campaign;

    // Get donor profiles for current user if they donated
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
        
        // For other donors, show abbreviated address
        return {
            name: `${address.substring(0, 6)}...${address.substring(address.length - 4)}`,
            avatar: null,
            platforms: [],
            trustScore: 0
        };
    };

    // Combine and process donations
    const allDonors = [
        ...contributions.map((c: { contributor: string }) => ({ address: c.contributor, type: 'wallet' })),
        ...directTransfers.map((d: { from: string }) => ({ address: d.from, type: 'coinbase' }))
    ];
    
    // Get unique donors
    const uniqueDonors = allDonors.reduce((acc: { address: string; type: string }[], donor) => {
        if (!acc.find(d => d.address.toLowerCase() === donor.address.toLowerCase())) {
            acc.push(donor);
        }
        return acc;
    }, []);

    const title = metadata.title || 'Loading title...';
    const imageSrc = metadata.image ? `${IPFS_GATEWAY}${metadata.image.replace('ipfs://', '')}` : '/placeholder.png';

    const safeGoalAmount = goalAmount?.toString().replace(/[^0-9]/g, '') || '0';
    const safeTotalRaised = (actualBalance || totalRaised)?.toString().replace(/[^0-9]/g, '') || '0';
    
    const displayGoalAmount = formatUnits(BigInt(safeGoalAmount), USDC_DECIMALS);
    const displayTotalRaised = formatUnits(BigInt(safeTotalRaised), USDC_DECIMALS);
    const goalAmountNum = parseFloat(displayGoalAmount);
    const totalRaisedNum = parseFloat(displayTotalRaised);

    const formattedGoal = new Intl.NumberFormat('en-US').format(goalAmountNum);
    const formattedRaised = new Intl.NumberFormat('en-US').format(totalRaisedNum);

    let progressPercentage = 0;
    if (totalRaisedNum > 0 && goalAmountNum > 0) {
        progressPercentage = Math.min((totalRaisedNum / goalAmountNum) * 100, 100);
    }

    return (
        <Link href={`/campaign/${campaign.campaignNumericId || campaign.campaignId}`} className="block group">
            <div className="flex flex-col bg-white rounded-xl p-4 transition-all duration-200 group-hover:shadow-xl cursor-pointer">

                {/* Image Section */}
                <div className="relative w-full h-48 overflow-hidden bg-gray-100 rounded-xl mb-2">
                    <img
                        src={imageSrc}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Subtle gradient overlay at bottom for better text readability */}
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Donor Avatars and Names Section */}
                {uniqueDonors.length > 0 ? (
                  <div className="flex items-center text-sm text-gray-600 mb-1.5">
                    {/* Overlapping Avatar Circles */}
                    <div className="flex -space-x-1.5 mr-3">
                      {uniqueDonors.slice(0, 3).map((donor, index) => {
                        const profile = getDonorProfile(donor.address);
                        return profile.avatar ? (
                          <img 
                            key={donor.address}
                            src={profile.avatar}
                            alt={profile.name}
                            className="w-5 h-5 rounded-full ring-1 ring-white object-cover"
                          />
                        ) : (
                          <div 
                            key={donor.address}
                            className={`w-5 h-5 rounded-full ring-1 ring-white flex items-center justify-center ${
                              index === 0 ? 'bg-gradient-to-br from-purple-400 to-pink-400' :
                              index === 1 ? 'bg-gradient-to-br from-blue-400 to-cyan-400' :
                              'bg-gradient-to-br from-green-400 to-emerald-400'
                            }`}
                          >
                            <span className="text-white text-xs font-semibold">
                              {profile.name.substring(0, 1).toUpperCase()}
                            </span>
                          </div>
                        );
                      })}
                      {uniqueDonors.length > 3 && (
                        <div className="w-5 h-5 rounded-full bg-gray-300 ring-1 ring-white flex items-center justify-center">
                          <span className="text-white text-xs font-semibold">+{uniqueDonors.length - 3}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      {/* Simple supporter count - no randomization */}
                      <span className="font-medium text-gray-800">
                        {uniqueDonors.length} supporter{uniqueDonors.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center text-sm text-gray-500 mb-1.5">
                    <div className="flex -space-x-1.5 mr-3">
                      <div className="w-5 h-5 rounded-full bg-gray-200 ring-1 ring-white"></div>
                      <div className="w-5 h-5 rounded-full bg-gray-200 ring-1 ring-white"></div>
                      <div className="w-5 h-5 rounded-full bg-gray-200 ring-1 ring-white"></div>
                    </div>
                    <span>Be the first to support this</span>
                  </div>
                )}

                {/* Content Section */}
                <div>
                  {/* Title */}
                  <h3 className="text-lg font-sans font-semibold text-gray-900 mb-1 line-clamp-2">
                      {title}
                  </h3>
                  
                  {/* Progress Bar */}
                  <div className="mb-1">
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                        className="h-full rounded-full transition-all duration-700 ease-out group-hover:bg-opacity-90"
                        style={{ 
                          width: `${progressPercentage}%`,
                          background: progressPercentage > 0 
                            ? 'linear-gradient(90deg, #6BBAA7 0%, #29738F 100%)' 
                            : 'transparent'
                        }}
                        ></div>
                    </div>
                  </div>

                  {/* Raised Amount */}
                  <div className="text-sm">
                      <span className="font-bold text-gray-900">${formattedRaised} raised</span>
                      {goalAmountNum > 0 && (
                        <span className="text-gray-600"> of ${formattedGoal}</span>
                      )}
                  </div>
                </div>
            </div>
        </Link>
    );
}; 