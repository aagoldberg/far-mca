import type { PrivyClientConfig } from "@privy-io/react-auth";
import { baseSepolia } from "viem/chains";

export const privyConfig: PrivyClientConfig = {
  loginMethods: ["wallet", "email", "sms", "google", "apple", "twitter", "farcaster"],
  appearance: {
    theme: "light",
    accentColor: "#29738F", // Match your app's brand color
    logo: "https://everybit.matters/logo.png", // Add your logo
    showWalletLoginFirst: false, // Show social/email first for better mobile UX
    walletChainType: "ethereum-and-solana",
  },
  embeddedWallets: {
    createOnLogin: "users-without-wallets",
    requireUserPasswordOnCreate: false, // Better mobile UX
    noPromptOnSignature: true, // Reduce friction on mobile
  },
  defaultChain: baseSepolia,
  supportedChains: [baseSepolia],
  fundingMethodConfig: {
    moonpay: {
      useSandbox: true, // Use sandbox for testing
    },
  },
  // Mobile-optimized login flow
  loginMethodsAndOrder: {
    primary: ["google", "apple", "email"], // Mobile-friendly options first
    secondary: ["sms", "twitter", "farcaster", "wallet"], // Advanced options second
  },
  mfa: {
    noPromptOnMfaRequired: false, // Better security
  },
  // @ts-ignore
  walletConnect: {
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string,
  },
};