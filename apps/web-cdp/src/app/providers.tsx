"use client";

import React, { useEffect } from "react";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "@/lib/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { PaymentProvider } from "@/providers/payment/PaymentProvider";
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { CDPReactProvider } from '@coinbase/cdp-react';
import { RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit';
import { baseSepolia } from 'wagmi/chains';
import '@rainbow-me/rainbowkit/styles.css';
import { clearProfileCache, debugProfileCache } from '@/hooks/useFarcasterProfile';

const queryClient = new QueryClient();

const SUBGRAPH_URL = process.env.NEXT_PUBLIC_SUBGRAPH_URL;
const CDP_API_KEY = process.env.CDP_API_KEY_ID || process.env.NEXT_PUBLIC_CDP_API_KEY;
const CDP_PROJECT_ID = process.env.NEXT_PUBLIC_CDP_PROJECT_ID;
const PAYMASTER_URL = process.env.NEXT_PUBLIC_PAYMASTER_URL;

if (!SUBGRAPH_URL) {
  console.warn("NEXT_PUBLIC_SUBGRAPH_URL is not set - using fallback");
}

if (!CDP_PROJECT_ID) {
  console.warn("NEXT_PUBLIC_CDP_PROJECT_ID is not set - CDP Embedded Wallets will not work");
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

  return (
    <CDPReactProvider
      config={{
        projectId: CDP_PROJECT_ID || '',
        ethereum: {
          createOnLogin: 'all', // Creates Smart Wallets for gasless transactions
        },
        appName: 'LendFriend',
        authMethods: ['email', 'sms', 'oauth:google', 'oauth:apple', 'oauth:x'],
      }}
    >
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider
            appInfo={{
              appName: 'LendFriend',
            }}
            theme={lightTheme({
              accentColor: '#29738F',
              accentColorForeground: 'white',
              borderRadius: 'large',
              fontStack: 'system',
            })}
          >
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
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </CDPReactProvider>
  );
}