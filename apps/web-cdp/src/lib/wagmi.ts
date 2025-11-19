'use client';

import { http } from "wagmi";
import { base, baseSepolia, optimism } from "wagmi/chains";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { coinbaseWallet } from "wagmi/connectors";

const alchemyRpcUrl = process.env.NEXT_PUBLIC_RPC_URL;

if (!alchemyRpcUrl) {
  console.warn(`[Config Warning] NEXT_PUBLIC_RPC_URL is not set. Falling back to public RPC, which may be unreliable.`);
}

export const wagmiConfig = getDefaultConfig({
  appName: "LendFriend",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "YOUR_PROJECT_ID",
  chains: [baseSepolia, base, optimism],
  ssr: true,
  transports: {
    [baseSepolia.id]: http(alchemyRpcUrl, {
      timeout: 10000,
      retryCount: 3,
      retryDelay: 1000,
    }),
    [base.id]: http(),
    [optimism.id]: http(), // Public RPC for Optimism (only used for Farcaster signatures)
  },
});

// Re-export constants from constants.ts for convenience
export {
  MICROLOAN_FACTORY_ADDRESS,
  USDC_ADDRESS,
  CAMPAIGN_FACTORY_ADDRESS,
  USDC_CONTRACT_ADDRESS,
} from './constants';
