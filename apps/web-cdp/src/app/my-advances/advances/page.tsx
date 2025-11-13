'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { WagmiProvider } from '@/lib/wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import BorrowerAdvances from '@/components/BorrowerAdvances';
import Navbar from '@/components/Navbar';

const queryClient = new QueryClient();

export default function AdvancesPage() {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        appearance: {
          theme: 'light',
          accentColor: '#3B9B7F',
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <BorrowerAdvances />
          </div>
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
