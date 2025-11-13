import { http, createConfig } from 'wagmi'
import { baseSepolia, base } from 'wagmi/chains'
import { coinbaseWallet } from 'wagmi/connectors'

export const wagmiConfig = createConfig({
  chains: [baseSepolia, base],
  connectors: [
    coinbaseWallet({
      appName: 'CDP Auto-Repayment Demo',
      preference: 'smartWalletOnly', // Force smart wallets only
    }),
  ],
  ssr: true,
  transports: {
    [baseSepolia.id]: http(),
    [base.id]: http(),
  },
})
