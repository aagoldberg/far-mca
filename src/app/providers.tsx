"use client";

import React from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider } from "@privy-io/wagmi";
import { privyConfig } from "@/lib/privy";
import { wagmiConfig } from "@/lib/wagmi"; 
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { PaymentProvider } from "@/providers/payment/PaymentProvider";

const queryClient = new QueryClient();

const SUBGRAPH_URL = process.env.NEXT_PUBLIC_SUBGRAPH_URL;

if (!SUBGRAPH_URL) {
  console.error("NEXT_PUBLIC_SUBGRAPH_URL is not set");
  // Use a fallback URL instead of throwing
}

const apolloClient = new ApolloClient({
  uri: SUBGRAPH_URL || "https://api.studio.thegraph.com/query/113071/subgraph/version/latest",
  cache: new InMemoryCache(),
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
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