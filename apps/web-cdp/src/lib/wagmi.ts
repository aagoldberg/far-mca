import { http } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { coinbaseWallet } from "wagmi/connectors";

const alchemyRpcUrl = process.env.NEXT_PUBLIC_RPC_URL;

if (!alchemyRpcUrl) {
  console.warn(`[Config Warning] NEXT_PUBLIC_RPC_URL is not set. Falling back to public RPC, which may be unreliable.`);
}

export const wagmiConfig = getDefaultConfig({
  appName: "LendFriend",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "YOUR_PROJECT_ID",
  chains: [baseSepolia, base],
  ssr: true,
  transports: {
    [baseSepolia.id]: http(alchemyRpcUrl, {
      timeout: 10000,
      retryCount: 3,
      retryDelay: 1000,
    }),
    [base.id]: http(),
  },
});

// New MicroLoan contract addresses
export const MICROLOAN_FACTORY_ADDRESS = process.env.NEXT_PUBLIC_MICROLOAN_FACTORY_ADDRESS as `0x${string}` || '0x0000000000000000000000000000000000000000';
export const USDC_ADDRESS = process.env.NEXT_PUBLIC_USDC_ADDRESS as `0x${string}` || '0x0000000000000000000000000000000000000000';

// Legacy RBF Campaign addresses (deprecated, keeping for reference)
export const CAMPAIGN_FACTORY_ADDRESS = process.env.NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDRESS as `0x${string}` || '0x0000000000000000000000000000000000000000';
export const USDC_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_USDC_ADDRESS as `0x${string}` || '0x2d04a1dF447A9265Bc936747f1CEe7126e99aaFe';
