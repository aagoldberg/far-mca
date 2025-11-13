"use client";

import React from "react";
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

const queryClient = new QueryClient();

const SUBGRAPH_URL = process.env.NEXT_PUBLIC_SUBGRAPH_URL;
const CDP_API_KEY = process.env.CDP_API_KEY_ID || process.env.NEXT_PUBLIC_CDP_API_KEY;
const CDP_PROJECT_ID = process.env.NEXT_PUBLIC_CDP_PROJECT_ID;

if (!SUBGRAPH_URL) {
  console.warn("NEXT_PUBLIC_SUBGRAPH_URL is not set - using fallback");
}

if (!CDP_PROJECT_ID) {
  console.warn("NEXT_PUBLIC_CDP_PROJECT_ID is not set - CDP Embedded Wallets will not work");
}

const httpLink = createHttpLink({
  uri: SUBGRAPH_URL || "https://api.studio.thegraph.com/query/113071/subgraph/version/latest",
});

const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CDPReactProvider
      config={{
        projectId: CDP_PROJECT_ID || '',
        ethereum: {
          createOnLogin: 'eoa',
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
              chain={baseSepolia}
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