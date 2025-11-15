'use client';

import { useState } from 'react';
import { formatUnits } from 'viem';

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

  const handleBuyWithCard = () => {
    // TODO: Implement Coinbase onramp for mainnet
    console.log('[Funding] Onramp not yet implemented for mainnet');
    alert('Mainnet onramp coming soon! For now, use testnet with faucets.');
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
          <div>
            <p className="text-xs text-gray-500 mb-1">Amount Needed</p>
            <p className="text-sm font-semibold text-red-600">
              +{formatUnits(usdcNeeded, 6)} USDC
            </p>
            <p className="text-xs text-gray-600">
              +{formatUnits(ethNeeded, 18)} ETH (gas)
            </p>
          </div>
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

        {/* Mainnet Option - Onramp (Future) */}
        <button
          onClick={() => setSelectedMethod('onramp')}
          disabled
          className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
        >
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
            <div className="text-left">
              <p className="font-medium text-gray-900">💳 Buy with Card</p>
              <p className="text-xs text-gray-500">Via Coinbase (Coming Soon)</p>
            </div>
          </div>
          <span className="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-1 rounded">
            Mainnet
          </span>
        </button>

        {/* Action Button */}
        <button
          onClick={selectedMethod === 'faucet' ? handleGetTestTokens : handleBuyWithCard}
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
            <span>{selectedMethod === 'faucet' ? 'Get Test Tokens' : 'Buy with Card'}</span>
          )}
        </button>

        {isLoading && (
          <p className="text-xs text-gray-500 text-center">
            Tokens will appear in your wallet in a few seconds...
          </p>
        )}
      </div>
    </div>
  );
}
