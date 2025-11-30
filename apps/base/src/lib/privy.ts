import type { PrivyClientConfig } from "@privy-io/react-auth";
import { baseSepolia } from "viem/chains";

export const privyConfig: PrivyClientConfig = {
  loginMethods: ["wallet", "email", "google", "apple"],
  appearance: {
    theme: "light",
    accentColor: "#29738F",
    logo: "https://everybit.matters/logo.png",
    showWalletLoginFirst: true, // Show wallet first
    walletChainType: "ethereum-only",
  },
  embeddedWallets: {
    createOnLogin: "all-users", // Create embedded wallet for all users
    requireUserPasswordOnCreate: false,
    noPromptOnSignature: true,
  },
  defaultChain: baseSepolia,
  supportedChains: [baseSepolia],
  mfa: {
    noPromptOnMfaRequired: false, // Better security
  },
  // @ts-ignore
  walletConnect: {
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string,
  },
};