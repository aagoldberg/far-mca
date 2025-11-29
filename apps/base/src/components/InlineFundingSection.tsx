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
  requiredETH,
  currentUSDC,
  currentETH,
  walletAddress,
  onFundingComplete,
}: InlineFundingSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'faucet' | 'onramp'>('faucet');

  const usdcNeeded = requiredUSDC > currentUSDC ? requiredUSDC - currentUSDC : 0n;
  const ethNeeded = requiredETH > currentETH ? requiredETH - currentETH : 0n;

  const handleGetTestTokens = async () => {
    if (!walletAddress) return;

    setIsLoading(true);
    try {
      // Call both faucets in parallel
      const [usdcResult, ethResult] = await Promise.all([
        fetch('/api/faucet-usdc', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ recipientAddress: walletAddress }),
        }),
        fetch('/api/faucet-eth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ recipientAddress: walletAddress }),
        }),
      ]);

      const usdcData = await usdcResult.json();
      const ethData = await ethResult.json();

      if (usdcData.success && ethData.success) {
        console.log('[Funding] Test tokens received successfully');
        // Wait for balances to update, then notify parent
        setTimeout(() => {
          onFundingComplete();
        }, 3000);
      } else {
        console.error('[Funding] Faucet error:', { usdcData, ethData });
      }
    } catch (error) {
      console.error('[Funding] Failed to get test tokens:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate the USDC amount needed in fiat (USD)
  const usdcNeededFormatted = parseFloat(formatUnits(usdcNeeded, 6));
  const defaultAmount = Math.max(Math.ceil(usdcNeededFormatted), 10); // Min $10

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'coinbase' | 'card' | 'applepay' | 'googlepay' | 'paypal' | 'bank'>('card');

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
    <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6 mb-6">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Add Funds to Continue
          </h3>
          <p className="text-sm text-gray-600">
            You need more funds in your wallet to complete this transaction
          </p>
        </div>
      </div>

      {/* Balance Summary */}
      <div className="bg-white rounded-xl p-4 mb-4">
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <p className="text-xs text-gray-500 mb-1">Current Balance</p>
            <p className="text-sm font-medium text-gray-900">
              {formatUnits(currentUSDC, 6)} USDC
            </p>
            <p className="text-xs text-gray-600">
              {formatUnits(currentETH, 18)} ETH
            </p>
          </div>
          {usdcNeeded > 0n || ethNeeded > 0n ? (
            <div>
              <p className="text-xs text-gray-500 mb-1">Amount Needed</p>
              <p className="text-sm font-semibold text-red-600">
                +{formatUnits(usdcNeeded, 6)} USDC
              </p>
              <p className="text-xs text-gray-600">
                +{formatUnits(ethNeeded, 18)} ETH (gas)
              </p>
            </div>
          ) : (
            <div>
              <p className="text-xs text-gray-500 mb-1">Recommended Balance</p>
              <p className="text-sm font-medium text-gray-700">
                10+ USDC
              </p>
              <p className="text-xs text-gray-600">
                0.002+ ETH (gas)
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Funding Options */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-700">Choose funding method:</p>

        {/* Testnet Option - Faucet */}
        <button
          onClick={() => setSelectedMethod('faucet')}
          className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
            selectedMethod === 'faucet'
              ? 'border-[#3B9B7F] bg-green-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              selectedMethod === 'faucet' ? 'border-[#3B9B7F]' : 'border-gray-300'
            }`}>
              {selectedMethod === 'faucet' && (
                <div className="w-3 h-3 bg-[#3B9B7F] rounded-full" />
              )}
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">🪙 Get Test Tokens</p>
              <p className="text-xs text-gray-500">Free testnet USDC + ETH</p>
            </div>
          </div>
          <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
            Testnet
          </span>
        </button>

        {/* Mainnet Option - Onramp */}
        <button
          onClick={() => setSelectedMethod('onramp')}
          className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
            selectedMethod === 'onramp'
              ? 'border-[#3B9B7F] bg-green-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              selectedMethod === 'onramp' ? 'border-[#3B9B7F]' : 'border-gray-300'
            }`}>
              {selectedMethod === 'onramp' && (
                <div className="w-3 h-3 bg-[#3B9B7F] rounded-full" />
              )}
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">💳 Buy with Card</p>
              <p className="text-xs text-gray-500">Via Coinbase Pay</p>
            </div>
          </div>
          <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
            Mainnet
          </span>
        </button>

        {/* Action Section */}
        {selectedMethod === 'faucet' ? (
          <button
            onClick={handleGetTestTokens}
            disabled={isLoading || !walletAddress}
            className="w-full bg-[#3B9B7F] hover:bg-[#2E7D68] text-white font-semibold py-3 px-6 rounded-xl transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Getting Test Tokens...</span>
              </>
            ) : (
              <span>Get Test Tokens</span>
            )}
          </button>
        ) : (
          <div className="space-y-2">
            {/* Debit/Credit Card */}
            <button
              onClick={() => setSelectedPaymentMethod('card')}
              className={`w-full flex items-center justify-center gap-3 p-4 rounded-xl border transition-all ${
                selectedPaymentMethod === 'card'
                  ? 'border-[#3B9B7F] bg-green-50'
                  : 'border-gray-200 bg-white hover:bg-gray-50'
              }`}
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <span className="font-medium text-gray-900">Card</span>
            </button>

            {/* Google Pay */}
            <button
              onClick={() => setSelectedPaymentMethod('googlepay')}
              className={`w-full flex items-center justify-center gap-3 p-4 rounded-xl border transition-all ${
                selectedPaymentMethod === 'googlepay'
                  ? 'border-[#3B9B7F] bg-green-50'
                  : 'border-gray-200 bg-white hover:bg-gray-50'
              }`}
            >
              <svg className="h-6" viewBox="0 0 48 20" fill="none">
                <path d="M23.7 10c0 5.2-4 9-9 9s-9-3.8-9-9 4-9 9-9c2.4 0 4.5.9 6.2 2.3l-2.5 2.4c-1-.9-2.3-1.5-3.7-1.5-3 0-5.5 2.5-5.5 5.8s2.5 5.8 5.5 5.8c2 0 3.3-.8 4.2-1.9.7-.9 1.2-2.2 1.3-3.9h-5.5V7.2h8.8c.1.5.2 1 .2 1.6v1.2z" fill="#4285F4"/>
                <path d="M47.8 7.2h-7.5v3.7h6.8c-.3 2-2.3 5.8-6.8 5.8-4.1 0-7.5-3.4-7.5-7.5s3.4-7.5 7.5-7.5c2.3 0 3.9 1 4.8 1.9l2.9-2.8c-1.9-1.8-4.3-2.8-7.7-2.8C34 .2 29 5.2 29 10.2s5 10 11.3 10c6.5 0 10.8-4.6 10.8-11 0-.7-.1-1.3-.2-1.8z" fill="#EA4335"/>
                <path d="M27 10c0-5.5-4.5-10-10-10S7 4.5 7 10s4.5 10 10 10 10-4.5 10-10zm-3.5 0c0 3.6-2.9 6.5-6.5 6.5s-6.5-2.9-6.5-6.5S13.4 3.5 17 3.5s6.5 2.9 6.5 6.5z" fill="#FBBC04"/>
                <path d="M17 6.5c-1.9 0-3.5 1.6-3.5 3.5s1.6 3.5 3.5 3.5 3.5-1.6 3.5-3.5-1.6-3.5-3.5-3.5z" fill="#34A853"/>
              </svg>
              <span className="font-medium text-gray-900">Google</span>
            </button>

            {/* Apple Pay */}
            <button
              onClick={() => setSelectedPaymentMethod('applepay')}
              className={`w-full flex items-center justify-center gap-3 p-4 rounded-xl border transition-all ${
                selectedPaymentMethod === 'applepay'
                  ? 'border-[#3B9B7F] bg-green-50'
                  : 'border-gray-200 bg-white hover:bg-gray-50'
              }`}
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="black">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              <span className="font-medium text-gray-900">Apple</span>
            </button>

            {/* PayPal */}
            <button
              onClick={() => setSelectedPaymentMethod('paypal')}
              className={`w-full flex items-center justify-center gap-3 p-4 rounded-xl border transition-all ${
                selectedPaymentMethod === 'paypal'
                  ? 'border-[#3B9B7F] bg-green-50'
                  : 'border-gray-200 bg-white hover:bg-gray-50'
              }`}
            >
              <svg className="h-6" viewBox="0 0 100 32" fill="#003087">
                <path d="M12 4.917h-7.5l-4.5 22.5h6l1.5-7.5h4.5c6 0 9-3 10.5-7.5s-1.5-7.5-7.5-7.5h-3zm-1.5 12h-3l1.5-7.5h3c3 0 4.5 1.5 4.5 3.75s-3 3.75-6 3.75z"/>
                <path d="M35.5 11.417c-3-1.5-7.5-1.5-10.5 0s-4.5 4.5-4.5 7.5 1.5 6 4.5 7.5 7.5 1.5 10.5 0 4.5-4.5 4.5-7.5-1.5-6-4.5-7.5zm-7.5 10.5c-1.5 0-3-1.5-3-3s1.5-3 3-3 3 1.5 3 3-1.5 3-3 3z"/>
              </svg>
              <span className="font-medium text-gray-900">PayPal</span>
            </button>

            {/* Coinbase */}
            <button
              onClick={() => setSelectedPaymentMethod('coinbase')}
              className={`w-full flex items-center justify-center gap-3 p-4 rounded-xl border transition-all ${
                selectedPaymentMethod === 'coinbase'
                  ? 'border-[#3B9B7F] bg-green-50'
                  : 'border-gray-200 bg-white hover:bg-gray-50'
              }`}
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#0052FF">
                <path d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12zm0-6c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z"/>
              </svg>
              <span className="font-medium text-gray-900">Coinbase</span>
            </button>

            {/* Bank Transfer */}
            <button
              onClick={() => setSelectedPaymentMethod('bank')}
              className={`w-full flex items-center justify-center gap-3 p-4 rounded-xl border transition-all ${
                selectedPaymentMethod === 'bank'
                  ? 'border-[#3B9B7F] bg-green-50'
                  : 'border-gray-200 bg-white hover:bg-gray-50'
              }`}
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
              </svg>
              <span className="font-medium text-gray-900">Bank Transfer</span>
            </button>

            {/* Continue Button */}
            <button
              onClick={handleBuyWithCoinbase}
              disabled={isLoading || !walletAddress}
              className="w-full bg-[#3B9B7F] hover:bg-[#2E7D68] text-white font-semibold py-3.5 px-6 rounded-xl transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Opening payment...</span>
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center mt-2">
              Amount: ${defaultAmount} USDC
            </p>
          </div>
        )}

        {isLoading && (
          <p className="text-xs text-gray-500 text-center">
            Tokens will appear in your wallet in a few seconds...
          </p>
        )}
      </div>
    </div>
  );
}
