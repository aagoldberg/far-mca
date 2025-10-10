"use client";

import { useCampaign } from '@/hooks/useCampaign';
import { usePrivy } from '@privy-io/react-auth';
import { useEffect, useState } from 'react';
import { getSocialProfile, PlatformBadges, TrustIndicator } from '@/utils/socialUtils';
import CampaignCreatorProfile from '@/components/CampaignCreatorProfile';

const IPFS_GATEWAY = process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/';

type CampaignDetailsProps = {
  campaignNumericId: string;
};

export default function CampaignDetails({ campaignNumericId }: CampaignDetailsProps) {
  const { campaign, loading, error } = useCampaign(campaignNumericId);
  const { user } = usePrivy();
  const [creatorProfile, setCreatorProfile] = useState<{
    name: string | null, 
    image: string | null,
    platforms: string[],
    trustScore: number
  }>({
    name: null,
    image: null,
    platforms: [],
    trustScore: 0
  });
  
  useEffect(() => {
    // Check if current user is the creator
    if (campaign && user && user.wallet?.address?.toLowerCase() === campaign.creator.toLowerCase()) {
      // Get full social profile data for the creator
      const profile = getSocialProfile(user);
      
      setCreatorProfile({
        name: profile.name,
        image: profile.avatar,
        platforms: profile.platforms,
        trustScore: profile.trustScore
      });
    }
  }, [campaign, user]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded-lg mb-6"></div>
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-3 bg-gray-200 rounded w-48"></div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">
        Error loading campaign: {error}
    </div>;
  }

  if (!campaign && !loading) {
    return <div className="text-center py-10">Campaign not found.</div>;
  }
  
  // Still loading, keep showing loading state
  if (!campaign) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded-lg mb-6"></div>
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-3 bg-gray-200 rounded w-48"></div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  const { title, description, image } = campaign.metadata || {};
  const imageUrl = image ? `${IPFS_GATEWAY}${image.replace('ipfs://', '')}` : '/placeholder.png';


  return (
    <div className="space-y-4">
      {/* Campaign Title */}
      <div>
        <h1 className="text-xl lg:text-2xl font-sans font-medium text-gray-900 leading-tight">
          {title || 'Campaign Title'}
        </h1>
      </div>
      
      {/* Campaign Image */}
      <div className="rounded-2xl overflow-hidden bg-gray-100">
        <img 
          src={imageUrl} 
          alt={title || 'Campaign Image'} 
          className="w-full aspect-video object-cover" 
        />
      </div>
      
      {/* Organizer Section */}
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-2">
          {creatorProfile.image ? (
            <img 
              src={creatorProfile.image}
              alt={creatorProfile.name || 'Creator'}
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#29738F] to-[#6BBAA7] flex-shrink-0 flex items-center justify-center">
              <span className="text-white font-semibold text-xs">
                {creatorProfile.name ? 
                  creatorProfile.name.substring(0, 2).toUpperCase() : 
                  campaign.creator.substring(2, 4).toUpperCase()}
              </span>
            </div>
          )}
          <div className="flex-1">
            {/* First line: Name/Address */}
            <p className="text-gray-600 text-sm">
              <span className="font-semibold text-gray-900">
                {creatorProfile.name || 
                  `${campaign.creator.substring(0, 6)}...${campaign.creator.substring(campaign.creator.length - 4)}`}
              </span>
              {' '}is organizing this fundraiser
            </p>
            {/* Second line: Platform badges */}
            {creatorProfile.platforms.length > 0 && (
              <div className="mt-1">
                <PlatformBadges platforms={creatorProfile.platforms} maxDisplay={6} />
              </div>
            )}
          </div>
        </div>
        {creatorProfile.trustScore > 0 && (
          <TrustIndicator score={creatorProfile.trustScore} showLabel />
        )}
      </div>
      
      {/* Divider */}
      <div className="border-t border-gray-200"></div>

      {/* Campaign Description */}
      <div className="space-y-2">
        <h2 className="text-lg font-sans font-semibold text-gray-900">About this fundraiser</h2>
        <div className="text-gray-700 text-base leading-relaxed space-y-4">
          {description ? (
            description.split('\n').map((paragraph, index) => {
              const trimmedParagraph = paragraph.trim();
              if (!trimmedParagraph) return null;
              return (
                <p key={index} className="mb-4 last:mb-0">
                  {trimmedParagraph}
                </p>
              );
            }).filter(Boolean)
          ) : (
            <p>No description provided.</p>
          )}
        </div>
      </div>

      {/* Creator Profile Section */}
      <div className="space-y-2">
        <h2 className="text-lg font-sans font-semibold text-gray-900">Organizer</h2>
        <CampaignCreatorProfile 
          creator={user?.wallet?.address?.toLowerCase() === campaign.creator.toLowerCase() ? user : null}
          walletAddress={campaign.creator}
          showFullProfile={true}
        />
      </div>
    </div>
  );
} 