'use client';

import { useState, useEffect } from 'react';
import { analyzeWalletActivityWithAPI, WalletActivityScore } from '@/lib/walletActivity';

export function useWalletActivity(address: `0x${string}` | undefined) {
  const [activityScore, setActivityScore] = useState<WalletActivityScore | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!address) {
      setActivityScore(null);
      return;
    }

    const fetchActivity = async () => {
      setIsLoading(true);
      const score = await analyzeWalletActivityWithAPI(address);
      setActivityScore(score);
      setIsLoading(false);
    };

    fetchActivity();
  }, [address]);

  return {
    activityScore,
    isLoading,
    score: activityScore?.score || 0,
    metrics: activityScore?.metrics,
    breakdown: activityScore?.breakdown,
  };
}
