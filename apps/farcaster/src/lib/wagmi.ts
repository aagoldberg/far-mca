import { createConfig, http } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'

export const wagmiConfig = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(
      process.env.NEXT_PUBLIC_RPC_URL || 'https://sepolia.base.org'
    ),
  },
})

export const CAMPAIGN_FACTORY_ADDRESS = process.env.NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDRESS as `0x${string}` || '0x0000000000000000000000000000000000000000';
export const USDC_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_USDC_CONTRACT_ADDRESS as `0x${string}` || '0x0000000000000000000000000000000000000000';
