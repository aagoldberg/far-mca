'use client';

import { useEffect } from 'react';
import { useCampaign } from '@/hooks/useCampaign';

interface DynamicMetaTagsProps {
  campaignId: string;
}

export default function DynamicMetaTags({ campaignId }: DynamicMetaTagsProps) {
  const { campaign, loading, error } = useCampaign(campaignId);

  useEffect(() => {
    if (!campaign?.metadata) return;

    const IPFS_GATEWAY = process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/';
    const title = campaign.metadata.title || 'Support This Campaign';
    const description = campaign.metadata.description || 'Help support this important cause on everybit';
    const imageUrl = campaign.metadata.image 
      ? `${IPFS_GATEWAY}${campaign.metadata.image.replace('ipfs://', '')}`
      : '/placeholder.png';
    const campaignUrl = `${window.location.origin}/campaign/${campaignId}`;

    // Update document title
    document.title = title;

    // Function to update or create meta tag
    const updateMetaTag = (property: string, content: string, isProperty = true) => {
      const selector = isProperty ? `meta[property="${property}"]` : `meta[name="${property}"]`;
      let tag = document.querySelector(selector) as HTMLMetaElement;
      
      if (!tag) {
        tag = document.createElement('meta');
        if (isProperty) {
          tag.setAttribute('property', property);
        } else {
          tag.setAttribute('name', property);
        }
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    // Update meta tags
    updateMetaTag('description', description, false);
    
    // Open Graph tags
    updateMetaTag('og:type', 'website');
    updateMetaTag('og:url', campaignUrl);
    updateMetaTag('og:title', title);
    updateMetaTag('og:description', description);
    updateMetaTag('og:image', imageUrl);
    updateMetaTag('og:image:width', '1200');
    updateMetaTag('og:image:height', '630');
    updateMetaTag('og:site_name', 'everybit');
    
    // Twitter tags
    updateMetaTag('twitter:card', 'summary_large_image', false);
    updateMetaTag('twitter:title', title, false);
    updateMetaTag('twitter:description', description, false);
    updateMetaTag('twitter:image', imageUrl, false);

  }, [campaign, campaignId]);

  return null; // This component doesn't render anything
}