"use client";

import React from "react";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "@/lib/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApolloProvider } from "@apollo/client";
import { getClient } from "@/lib/apollo";

const queryClient = new QueryClient();
const apolloClient = getClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <ApolloProvider client={apolloClient}>
          <div>{children}</div>
        </ApolloProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}
