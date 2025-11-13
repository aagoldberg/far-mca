import { createConfig, http } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { coinbaseWallet } from "wagmi/connectors";

const alchemyRpcUrl = process.env.NEXT_PUBLIC_RPC_URL;

if (!alchemyRpcUrl) {
  console.warn(`[Config Warning] NEXT_PUBLIC_RPC_URL is not set. Falling back to public RPC, which may be unreliable.`);
}

export const wagmiConfig = createConfig({
  chains: [baseSepolia, base],
  connectors: [
    coinbaseWallet({
      appName: "LendFriend",
      appLogoUrl: "https://everybit.matters/logo.png",
      preference: "smartWalletOnly", // Use Smart Wallet (email/Google/Apple), not extension
      version: "4",
    }),
  ],
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
