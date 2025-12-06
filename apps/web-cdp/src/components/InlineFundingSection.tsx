'use client';

import { useState } from 'react';
import { formatUnits } from 'viem';
import { getOnrampBuyUrl } from '@coinbase/onchainkit/fund';

interface InlineFundingSectionProps {
  requiredUSDC: bigint;
  requiredETH: bigint;
  currentUSDC: bigint;
  currentETH: bigint;
  walletAddress?: `0x${string}`;
  onFundingComplete: () => void;
}

export function InlineFundingSection({
  requiredUSDC,
  currentUSDC,
  walletAddress,
  onFundingComplete,
}: InlineFundingSectionProps) {
  const [isLoading, setIsLoading] = useState(false);

  const usdcNeeded = requiredUSDC > currentUSDC ? requiredUSDC - currentUSDC : 0n;

  // Calculate the USDC amount needed in fiat (USD)
  const usdcNeededFormatted = parseFloat(formatUnits(usdcNeeded, 6));
  const defaultAmount = Math.max(Math.ceil(usdcNeededFormatted), 10); // Min $10

  const handleBuyWithCoinbase = async () => {
    if (!walletAddress) {
      alert('Please connect your wallet first');
      return;
    }

    setIsLoading(true);

    try {
      console.log('[Funding] Generating session token for wallet:', walletAddress);

      // Generate session token from backend
      const sessionResponse = await fetch('/api/onramp/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          addresses: { [walletAddress]: ['base'] },
        }),
      });

      if (!sessionResponse.ok) {
        throw new Error('Failed to generate session token');
      }

      const { sessionToken } = await sessionResponse.json();

      console.log('[Funding] Session token generated, opening Coinbase onramp');

      // Get the Coinbase Pay onramp URL with session token
      const onrampURL = await getOnrampBuyUrl({
        projectId: process.env.NEXT_PUBLIC_CDP_PROJECT_ID || '',
        sessionToken,
        addresses: { [walletAddress]: ['base'] },
        assets: ['USDC'],
        presetFiatAmount: defaultAmount,
        fiatCurrency: 'USD',
      });

      setIsLoading(false);

      // Open in popup window
      const width = 500;
      const height = 700;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      const popup = window.open(
        onrampURL,
        'Coinbase Onramp',
        `width=${width},height=${height},left=${left},top=${top},popup=yes`
      );

      // Listen for popup close to refresh balances
      const checkPopup = setInterval(() => {
        if (popup && popup.closed) {
          clearInterval(checkPopup);
          console.log('[Funding] Onramp popup closed, refreshing balances');
          setTimeout(() => {
            onFundingComplete();
          }, 2000);
        }
      }, 500);
    } catch (error) {
      console.error('[Funding] Error opening Coinbase onramp:', error);
      setIsLoading(false);
      alert('Failed to open Coinbase Pay. Please try again.');
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl p-4">
      <button
        onClick={handleBuyWithCoinbase}
        disabled={isLoading || !walletAddress}
        className="w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold text-[15px] py-3.5 px-4 rounded-full transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Opening...</span>
          </>
        ) : (
          <span>Add ${defaultAmount} USDC</span>
        )}
      </button>
      <div className="flex items-center justify-center gap-1.5 mt-3">
        <span className="text-[11px] text-gray-400">Powered by</span>
        <img src="/logos/coinbase/SVG/Coinbase_Wordmark.svg" alt="Coinbase" className="h-3" />
      </div>
    </div>
  );
}
