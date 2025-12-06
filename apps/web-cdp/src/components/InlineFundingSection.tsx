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

type PaymentMethod = 'card' | 'applepay' | 'googlepay' | 'bank' | 'coinbase' | 'paypal' | 'wallet';

export function InlineFundingSection({
  requiredUSDC,
  currentUSDC,
  walletAddress,
  onFundingComplete,
}: InlineFundingSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('card');

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

  // Payment method config
  const paymentMethods: { id: PaymentMethod; label: string; icon: React.ReactNode }[] = [
    {
      id: 'paypal',
      label: 'PayPal',
      icon: <img src="/logos/paypal/Monogram/PayPal-Monogram-FullColor-RGB.png" alt="PayPal" className="h-7 w-auto" />,
    },
    {
      id: 'coinbase',
      label: 'Coinbase',
      icon: <img src="/logos/coinbase/blue_c.svg" alt="Coinbase" className="h-7 w-auto" />,
    },
    {
      id: 'googlepay',
      label: 'Google Pay',
      icon: <img src="/logos/google/g.png" alt="Google Pay" className="h-7 w-auto" />,
    },
    {
      id: 'applepay',
      label: 'Apple Pay',
      icon: <img src="/logos/apple/apple.png" alt="Apple Pay" className="h-6 w-auto" />,
    },
    {
      id: 'bank',
      label: 'Bank transfer',
      icon: (
        <svg className="w-7 h-7 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
        </svg>
      ),
    },
    {
      id: 'card',
      label: 'Credit or debit',
      icon: (
        <svg className="w-7 h-7 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
    },
    {
      id: 'wallet',
      label: 'Wallet',
      icon: (
        <svg className="w-7 h-7 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
        </svg>
      ),
    },
  ];

  return (
    <div className="border border-gray-200 rounded-xl">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-[15px] font-semibold text-gray-900">
          Payment method
        </h3>
      </div>

      {/* Payment Method Selection - GoFundMe style */}
      <div className="divide-y divide-gray-100">
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            onClick={() => setSelectedPaymentMethod(method.id)}
            className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors"
          >
            {/* Radio button */}
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
              selectedPaymentMethod === method.id
                ? 'border-brand-500 bg-brand-500'
                : 'border-gray-300'
            }`}>
              {selectedPaymentMethod === method.id && (
                <div className="w-2.5 h-2.5 rounded-full bg-white" />
              )}
            </div>

            {/* Icon */}
            <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
              {method.icon}
            </div>

            {/* Label */}
            <span className="text-[16px] font-medium text-gray-900">{method.label}</span>
          </button>
        ))}
      </div>

      {/* Buy Button */}
      <div className="p-4 border-t border-gray-200">
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
        <p className="text-[11px] text-gray-400 text-center mt-2">
          Powered by Coinbase
        </p>
      </div>
    </div>
  );
}
