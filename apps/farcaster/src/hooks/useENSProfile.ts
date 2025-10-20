'use client';

import { useState, useEffect } from 'react';
import { getENSProfile, ENSProfile } from '@/lib/ens';

export function useENSProfile(address: `0x${string}` | undefined) {
  const [profile, setProfile] = useState<ENSProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!address) {
      setProfile(null);
      return;
    }

    const fetchProfile = async () => {
      setIsLoading(true);
      const ensProfile = await getENSProfile(address);
      setProfile(ensProfile);
      setIsLoading(false);
    };

    fetchProfile();
  }, [address]);

  return {
    profile,
    isLoading,
    hasENS: !!profile?.name
  };
}
