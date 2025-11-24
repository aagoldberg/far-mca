'use client';

import { WagmiProvider } from '@/lib/wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import BorrowerAdvances from '@/components/BorrowerAdvances';
import Navbar from '@/components/Navbar';

const queryClient = new QueryClient();

export default function AdvancesPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <BorrowerAdvances />
        </div>
      </WagmiProvider>
    </QueryClientProvider>
  );
}
