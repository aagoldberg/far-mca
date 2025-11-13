'use client';

import { useState, useEffect } from 'react';

const IPFS_GATEWAY = process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/';

interface CampaignMetadata {
  title: string;
  description: string;
  image: string; // e.g., "ipfs://bafybe..."
}

export function useIPFSMetadata(metadataURI: string | undefined | null) {
  const [metadata, setMetadata] = useState<CampaignMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!metadataURI) {
      setMetadata(null);
      setIsLoading(false);
      return;
    }

    const fetchMetadata = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const url = `${IPFS_GATEWAY}${metadataURI.replace('ipfs://', '')}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Failed to fetch metadata from IPFS: ${response.statusText}`);
        }

        const data: CampaignMetadata = await response.json();
        setMetadata(data);
      } catch (err: any) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetadata();
  }, [metadataURI]);

  return { metadata, isLoading, error };
} 