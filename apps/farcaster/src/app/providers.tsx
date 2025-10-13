"use client";

import React, { useEffect, useState } from "react";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "@/lib/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApolloProvider } from "@apollo/client";
import { getClient } from "@/lib/apollo";
import { sdk } from "@farcaster/miniapp-sdk";

const queryClient = new QueryClient();
const apolloClient = getClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initializeSDK = async () => {
      try {
        // Wait for SDK context to be ready
        await sdk.context;
        setIsReady(true);
        console.log('Farcaster Mini App SDK context loaded');
      } catch (error) {
        console.error('Error loading Farcaster SDK:', error);
        // Even if SDK fails, render the app (for non-Farcaster environments)
        setIsReady(true);
      }
    };

    initializeSDK();
  }, []);

  // Call ready() after UI is fully rendered
  useEffect(() => {
    if (isReady) {
      // Use requestAnimationFrame to ensure DOM is painted
      requestAnimationFrame(() => {
        try {
          sdk.actions.ready();
          console.log('Farcaster Mini App ready signal sent');
        } catch (error) {
          console.error('Error sending ready signal:', error);
        }
      });
    }
  }, [isReady]);

  // Don't block rendering - show content immediately
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ApolloProvider client={apolloClient}>
          {children}
        </ApolloProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
