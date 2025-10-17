"use client";

import React, { useEffect } from "react";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "@/lib/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApolloProvider } from "@apollo/client";
import { getClient } from "@/lib/apollo";
import { sdk } from "@farcaster/miniapp-sdk";
import { ToastProvider } from "@/contexts/ToastContext";
import ToastContainer from "@/components/Toast";

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

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Call ready() on first mount - this is the standard pattern
    // The SDK expects this to be called once the app UI is ready
    try {
      sdk.actions.ready();
      console.log('[Providers] Farcaster Mini App ready signal sent');
    } catch (error) {
      console.error('[Providers] Error sending ready signal:', error);
    }
  }, []); // Empty deps = run once on mount

  return (
    <ToastProvider>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <ApolloProvider client={apolloClient}>
            {children}
            <ToastContainer />
          </ApolloProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ToastProvider>
  );
}
