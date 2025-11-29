"use client";

import React from 'react';
import { CoinbaseEmbedded } from '@/components/CoinbaseEmbedded';
import { useCDPAuth } from '@/hooks/useCDPAuth';

const PaymentsTestPage = () => {
  const { user } = useCDPAuth();

  const walletAddress = user?.wallet?.address;
  const isCoinbaseSandbox = !!process.env.NEXT_PUBLIC_COINBASE_SANDBOX_ENABLED;

  return (
    <main className="container mx-auto p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h1 className="text-3xl font-bold mb-2 text-gray-800">Coinbase On-Ramp: Embedded iFrame</h1>
          <p className="text-gray-600 mb-4">
            This page demonstrates the Coinbase On-Ramp SDK rendered directly within an iFrame. This provides a seamless, integrated experience for adding funds.
          </p>
          
          <div className="space-y-4 mb-6">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h2 className="font-semibold text-lg text-blue-800">Your Wallet Address:</h2>
              {walletAddress ? (
                <p className="font-mono text-sm text-blue-700 break-all">{walletAddress}</p>
              ) : (
                <p className="text-blue-700">Please log in to see your wallet address.</p>
              )}
            </div>
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h2 className="font-semibold text-lg text-yellow-800">Configuration Notes:</h2>
              <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1 mt-2">
                <li>The iFrame will only render if your `NEXT_PUBLIC_COINBASE_PAY_APP_ID` is set in `.env.local`.</li>
                <li>The widget is currently in **{isCoinbaseSandbox ? 'Sandbox Mode' : 'Production Mode'}**.</li>
                <li>For local development (iFrame may be blocked), ensure `NEXT_PUBLIC_COINBASE_SANDBOX_ENABLED=true` is set.</li>
                <li>For production, your domain must be whitelisted in the Coinbase Developer Platform settings to avoid the iFrame being blocked.</li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Live Demo</h2>
            <div className="p-4 border rounded-lg bg-gray-100 min-h-[600px] flex items-center justify-center">
                {walletAddress ? (
                    <CoinbaseEmbedded />
                ) : (
                    <div className="text-center">
                        <p className="text-lg font-semibold text-gray-700">Please Login</p>
                        <p className="text-gray-500">The Coinbase On-Ramp requires a wallet address to initialize.</p>
                    </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PaymentsTestPage; 