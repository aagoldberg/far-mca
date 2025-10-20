'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

interface FarcasterUser {
  fid: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
  bio?: string;
}

interface FarcasterContextType {
  user: FarcasterUser | null;
  isLoading: boolean;
}

const FarcasterContext = createContext<FarcasterContextType>({
  user: null,
  isLoading: true,
});

export function FarcasterProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FarcasterUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadContext = async () => {
      try {
        // sdk.context can be accessed directly or awaited
        const context = await sdk.context;

        if (context?.user) {
          setUser(context.user);
        }
      } catch (error) {
        console.debug('[FarcasterContext] Not running in Farcaster client:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadContext();
  }, []);

  return (
    <FarcasterContext.Provider value={{ user, isLoading }}>
      {children}
    </FarcasterContext.Provider>
  );
}

export function useFarcasterUser() {
  const context = useContext(FarcasterContext);
  if (context === undefined) {
    throw new Error('useFarcasterUser must be used within FarcasterProvider');
  }
  return context;
}
