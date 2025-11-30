'use client';

import { useState, useEffect } from 'react';
import { gitcoinPassportClient, GitcoinPassportScore, isGitcoinPassportEnabled } from '@/lib/gitcoin-passport';

export function useGitcoinPassport(address: `0x${string}` | undefined) {
  const [score, setScore] = useState<GitcoinPassportScore | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!address || !isGitcoinPassportEnabled()) {
      setScore(null);
      return;
    }

    const fetchScore = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const passportScore = await gitcoinPassportClient.getScore(address);
        setScore(passportScore);
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.debug('Gitcoin Passport score fetch error:', err);
        }
        setError(null); // Don't expose errors to component
        setScore(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchScore();
  }, [address]);

  return {
    score,
    isLoading,
    error,
    hasScore: !!score,
  };
}
