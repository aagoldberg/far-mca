'use client';

import { useState, useEffect, useCallback } from 'react';
import { BorrowerProfile, BorrowerProfileFormData } from '@/types/borrowerProfile';

interface UseBorrowerProfileResult {
  profile: BorrowerProfile | null;
  isLoading: boolean;
  error: string | null;
  saveProfile: (data: BorrowerProfileFormData) => Promise<BorrowerProfile | null>;
  updateProfile: (data: Partial<BorrowerProfileFormData>) => Promise<BorrowerProfile | null>;
  refetch: () => Promise<void>;
}

export function useBorrowerProfile(walletAddress: string | undefined): UseBorrowerProfileResult {
  const [profile, setProfile] = useState<BorrowerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!walletAddress) {
      setProfile(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/borrower-profile?wallet=${encodeURIComponent(walletAddress)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch profile');
      }

      setProfile(data.profile);
    } catch (err) {
      console.error('Error fetching borrower profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
    } finally {
      setIsLoading(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const saveProfile = useCallback(async (data: BorrowerProfileFormData): Promise<BorrowerProfile | null> => {
    if (!walletAddress) {
      setError('Wallet not connected');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/borrower-profile', {
        method: 'PATCH', // Use PATCH for upsert
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress,
          ...data,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save profile');
      }

      setProfile(result.profile);
      return result.profile;
    } catch (err) {
      console.error('Error saving borrower profile:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to save profile';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [walletAddress]);

  const updateProfile = useCallback(async (data: Partial<BorrowerProfileFormData>): Promise<BorrowerProfile | null> => {
    if (!walletAddress) {
      setError('Wallet not connected');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/borrower-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress,
          ...data,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update profile');
      }

      setProfile(result.profile);
      return result.profile;
    } catch (err) {
      console.error('Error updating borrower profile:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [walletAddress]);

  return {
    profile,
    isLoading,
    error,
    saveProfile,
    updateProfile,
    refetch: fetchProfile,
  };
}

// Hook to fetch a public profile by wallet address (for viewing loan details)
export function usePublicBorrowerProfile(walletAddress: string | undefined): {
  profile: BorrowerProfile | null;
  isLoading: boolean;
} {
  const [profile, setProfile] = useState<BorrowerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!walletAddress) {
      setProfile(null);
      return;
    }

    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/borrower-profile?wallet=${encodeURIComponent(walletAddress)}`);
        const data = await response.json();

        if (response.ok && data.profile) {
          setProfile(data.profile);
        } else {
          setProfile(null);
        }
      } catch (err) {
        console.error('Error fetching public borrower profile:', err);
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [walletAddress]);

  return { profile, isLoading };
}
