"use client";

import React, { useEffect } from "react";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "@/lib/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { PaymentProvider } from "@/providers/payment/PaymentProvider";
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { baseSepolia } from 'wagmi/chains';
import { clearProfileCache, debugProfileCache } from '@/hooks/useFarcasterProfile';
import { sdk } from "@farcaster/miniapp-sdk";

// Call ready() immediately when module loads (before React hydration)
// This is critical for the splash screen to dismiss quickly
if (typeof window !== 'undefined') {
  sdk.actions.ready().catch(() => {
    // Silently ignore errors - expected outside Warpcast
  });
}

const queryClient = new QueryClient();

const SUBGRAPH_URL = process.env.NEXT_PUBLIC_SUBGRAPH_URL;
const CDP_API_KEY = process.env.CDP_API_KEY_ID || process.env.NEXT_PUBLIC_CDP_API_KEY;
const CDP_PROJECT_ID = process.env.NEXT_PUBLIC_CDP_PROJECT_ID;
const PAYMASTER_URL = process.env.NEXT_PUBLIC_PAYMASTER_URL;

if (!SUBGRAPH_URL) {
  console.warn("NEXT_PUBLIC_SUBGRAPH_URL is not set - using fallback");
}

// Only warn about CDP in development, not critical for mini app
if (!CDP_PROJECT_ID && process.env.NODE_ENV === 'development') {
  console.info("CDP_PROJECT_ID not set - Mini app will use SDK wallet instead");
}

if (!PAYMASTER_URL) {
  console.warn("NEXT_PUBLIC_PAYMASTER_URL is not set - Gasless transactions will fallback to user-paid gas");
}

const httpLink = createHttpLink({
  uri: SUBGRAPH_URL || "https://api.studio.thegraph.com/query/113071/subgraph/version/latest",
});

const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export function Providers({ children }: { children: React.ReactNode }) {
  // Expose debug utilities in development
  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      (window as any).debugFarcaster = {
        clearCache: clearProfileCache,
        debugCache: debugProfileCache,
        clearAll: () => clearProfileCache(),
      };
      console.log('[Debug] Farcaster debug utilities available via window.debugFarcaster:');
      console.log('  • clearCache(address) - Clear cache for a specific address');
      console.log('  • debugCache(address) - Check what\'s cached for an address');
      console.log('  • clearAll() - Clear all profile cache');
    }
  }, []);


  // For mini apps, use Farcaster's wagmi connector - no RainbowKit needed
  // The farcasterMiniApp connector auto-connects if user has wallet in Farcaster
  return (
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
            <PaymentProvider>
              {children}
            </PaymentProvider>
          </ApolloProvider>
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}