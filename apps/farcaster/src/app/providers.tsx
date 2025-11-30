"use client";

import React, { useEffect } from "react";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "@/lib/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApolloProvider } from "@apollo/client";
import { getClient } from "@/lib/apollo";
import { sdk } from "@farcaster/miniapp-sdk";
import { ToastProvider } from "@/contexts/ToastContext";
import { FarcasterProvider } from "@/contexts/FarcasterContext";
import ToastContainer from "@/components/Toast";
import { CDPReactProvider } from '@coinbase/cdp-react';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { baseSepolia } from 'wagmi/chains';
import { detectPlatform } from '@/lib/platform';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      retryDelay: 1000,
      refetchOnWindowFocus: false,
    },
  },
});
const apolloClient = getClient();

// Environment variables for CDP
const CDP_API_KEY = process.env.NEXT_PUBLIC_CDP_API_KEY;
const CDP_PROJECT_ID = process.env.NEXT_PUBLIC_CDP_PROJECT_ID;
const PAYMASTER_URL = process.env.NEXT_PUBLIC_PAYMASTER_URL;

export function Providers({ children }: { children: React.ReactNode }) {
  const [platform, setPlatform] = React.useState<ReturnType<typeof detectPlatform> | null>(null);

  useEffect(() => {
    // Detect platform on mount
    const platformInfo = detectPlatform();
    setPlatform(platformInfo);
    console.log('[Providers] Platform detected:', platformInfo.platform);

    // Initialize platform-specific SDKs
    if (platformInfo.isFarcaster) {
      // Call ready() for Farcaster mini app
      try {
        sdk.actions.ready();
        console.log('[Providers] Farcaster Mini App ready signal sent');
      } catch (error) {
        console.error('[Providers] Error sending Farcaster ready signal:', error);
      }
    } else if (platformInfo.isBaseApp) {
      // Base App initialization would go here
      console.log('[Providers] Running in Base App context');
    }
  }, []);

  // Conditional provider wrapping based on platform
  const content = (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={CDP_API_KEY}
          projectId={CDP_PROJECT_ID}
          chain={baseSepolia}
          config={{
            appearance: {
              mode: 'light',
            },
            paymaster: PAYMASTER_URL ? {
              url: PAYMASTER_URL,
            } : undefined,
          }}
        >
          <ApolloProvider client={apolloClient}>
            {children}
            <ToastContainer />
          </ApolloProvider>
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );

  // For Base App, wrap with CDP provider
  if (platform?.isBaseApp && CDP_PROJECT_ID) {
    return (
      <CDPReactProvider
        config={{
          projectId: CDP_PROJECT_ID,
          ethereum: {
            createOnLogin: 'smart', // Creates Smart Accounts for gasless
            enableSpendPermissions: true,
          },
          appName: 'LendFriend',
          authMethods: ['email', 'sms', 'oauth:google', 'oauth:apple'],
        }}
      >
        <FarcasterProvider>
          <ToastProvider>
            {content}
          </ToastProvider>
        </FarcasterProvider>
      </CDPReactProvider>
    );
  }

  // For Farcaster or web, use existing provider structure
  return (
    <FarcasterProvider>
      <ToastProvider>
        {content}
      </ToastProvider>
    </FarcasterProvider>
  );
}
