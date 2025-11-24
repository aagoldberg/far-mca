'use client';

import { WagmiProvider } from '@/lib/wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AccountSettings from '@/components/AccountSettings';
import Navbar from '@/components/Navbar';

const queryClient = new QueryClient();

export default function AccountPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <AccountSettings />
        </div>
      </WagmiProvider>
    </QueryClientProvider>
  );
}
