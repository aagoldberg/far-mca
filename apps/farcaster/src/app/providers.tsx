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
  useEffect(() => {
    // Call ready() as soon as possible
    // Using setTimeout to ensure it runs after initial render
    const timer = setTimeout(() => {
      try {
        sdk.actions.ready();
        console.log('Farcaster Mini App ready signal sent');
      } catch (error) {
        console.error('Error sending ready signal:', error);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

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
