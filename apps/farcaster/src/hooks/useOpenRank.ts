'use client';

import { useState, useEffect } from 'react';
import { openRankClient } from '@/lib/openrank';

export interface OpenRankData {
  fid: number;
  score: number;
  rank?: number;
}

export function useOpenRank(fid: number | undefined) {
  const [data, setData] = useState<OpenRankData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!fid) {
      setData(null);
      return;
    }

    const fetchScore = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const score = await openRankClient.getScoreByFID(fid);
        setData(score);
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.debug('OpenRank score fetch error:', err);
        }
        setError(null); // Don't expose errors to component
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchScore();
  }, [fid]);

  return {
    data,
    isLoading,
    error,
    hasScore: !!data,
  };
}
