"use client";

import React from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider } from "@privy-io/wagmi";
import { privyConfig } from "@/lib/privy";
import { wagmiConfig } from "@/lib/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { PaymentProvider } from "@/providers/payment/PaymentProvider";

const queryClient = new QueryClient();

const SUBGRAPH_URL = process.env.NEXT_PUBLIC_SUBGRAPH_URL;
const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

if (!SUBGRAPH_URL) {
  console.warn("NEXT_PUBLIC_SUBGRAPH_URL is not set - using fallback");
}

if (!PRIVY_APP_ID) {
  console.warn("NEXT_PUBLIC_PRIVY_APP_ID is not set - authentication will be disabled");
}

const httpLink = createHttpLink({
  uri: SUBGRAPH_URL || "https://api.studio.thegraph.com/query/113071/subgraph/version/latest",
});

const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export function Providers({ children }: { children: React.ReactNode }) {
  // If Privy is not configured, render without auth
  if (!PRIVY_APP_ID) {
    return (
      <QueryClientProvider client={queryClient}>
        <ApolloProvider client={apolloClient}>
          <div className="border-t-4 border-yellow-500">
            <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2 text-sm text-yellow-800">
              ⚠️ Authentication disabled - Configure NEXT_PUBLIC_PRIVY_APP_ID in .env.local to enable wallet connection
            </div>
            {children}
          </div>
        </ApolloProvider>
      </QueryClientProvider>
    );
  }

  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={privyConfig}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          <ApolloProvider client={apolloClient}>
            <PaymentProvider>
              <div>{children}</div>
            </PaymentProvider>
          </ApolloProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}