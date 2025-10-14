import { createConfig, http } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'
import { farcasterMiniApp } from '@farcaster/miniapp-wagmi-connector'
import { injected } from 'wagmi/connectors'

export const wagmiConfig = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(
      process.env.NEXT_PUBLIC_RPC_URL || 'https://sepolia.base.org',
      {
        timeout: 10000, // 10 second timeout
        retryCount: 3,
        retryDelay: 1000,
      }
    ),
  },
  connectors: [
    farcasterMiniApp(),
    injected({ target: 'metaMask' }), // For testing with MetaMask
  ],
})

// New MicroLoan contract addresses
export const MICROLOAN_FACTORY_ADDRESS = process.env.NEXT_PUBLIC_MICROLOAN_FACTORY_ADDRESS as `0x${string}` || '0x0000000000000000000000000000000000000000';
export const USDC_ADDRESS = process.env.NEXT_PUBLIC_USDC_ADDRESS as `0x${string}` || '0x0000000000000000000000000000000000000000';

// Legacy RBF Campaign addresses (deprecated, keeping for reference)
export const CAMPAIGN_FACTORY_ADDRESS = process.env.NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDRESS as `0x${string}` || '0x0000000000000000000000000000000000000000';
export const USDC_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_USDC_CONTRACT_ADDRESS as `0x${string}` || '0x0000000000000000000000000000000000000000';
