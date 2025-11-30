'use client';

import { http, createConfig } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { farcasterMiniApp } from "@farcaster/miniapp-wagmi-connector";

const alchemyRpcUrl = process.env.NEXT_PUBLIC_RPC_URL;

if (!alchemyRpcUrl) {
  console.warn(`[Config Warning] NEXT_PUBLIC_RPC_URL is not set. Falling back to public RPC, which may be unreliable.`);
}

// Use Farcaster Mini App connector for seamless wallet integration
// If user has a connected wallet in Farcaster, isConnected will be true automatically
export const wagmiConfig = createConfig({
  chains: [baseSepolia, base],
  transports: {
    [baseSepolia.id]: http(alchemyRpcUrl, {
      timeout: 10000,
      retryCount: 3,
      retryDelay: 1000,
    }),
    [base.id]: http(),
  },
  connectors: [farcasterMiniApp()],
  ssr: true,
});

// Re-export constants from constants.ts for convenience
export {
  MICROLOAN_FACTORY_ADDRESS,
  USDC_ADDRESS,
  CAMPAIGN_FACTORY_ADDRESS,
  USDC_CONTRACT_ADDRESS,
} from './constants';
