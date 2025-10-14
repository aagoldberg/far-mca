'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { WagmiProvider } from '@/lib/wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AccountSettings from '@/components/AccountSettings';
import Navbar from '@/components/Navbar';

const queryClient = new QueryClient();

export default function AccountPage() {
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
            <AccountSettings />
          </div>
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
