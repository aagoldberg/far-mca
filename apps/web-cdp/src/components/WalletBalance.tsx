'use client';

import { useEffect, useState } from 'react';
import { useBalance, usePublicClient, useWalletClient } from 'wagmi';
import { useEvmAddress } from '@coinbase/cdp-hooks';
import { formatUnits } from 'viem';

const USDC_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_USDC_ADDRESS as `0x${string}`;

export function WalletBalance({ forceDesktopView = false }: { forceDesktopView?: boolean }) {
  const evmAddress = useEvmAddress();
  const walletAddress = (typeof evmAddress === 'string' ? evmAddress : undefined) as `0x${string}` | undefined;
  const [isMinting, setIsMinting] = useState(false);
  const [isRequestingEth, setIsRequestingEth] = useState(false);
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  // Get ETH balance
  const { data: ethBalance, isLoading: ethLoading, refetch: refetchEth } = useBalance({
    address: walletAddress,
  });

  // Get USDC balance
  const { data: usdcBalance, isLoading: usdcLoading, refetch: refetchUsdc } = useBalance({
    address: walletAddress,
    token: USDC_CONTRACT_ADDRESS,
  });

  if (!walletAddress) return null;

  const isLoading = ethLoading || usdcLoading;

  const formatBalance = (balance: bigint | undefined, decimals: number) => {
    if (!balance) return '0.00';
    const formatted = formatUnits(balance, decimals);
    const num = parseFloat(formatted);
    return num < 0.01 && num > 0 ? '<0.01' : num.toFixed(2);
  };

  // Faucet URLs - Circle faucet for USDC, Alchemy for ETH
  const ethFaucetUrl = `https://www.alchemy.com/faucets/base-sepolia`;
  const usdcFaucetUrl = `https://faucet.circle.com/`;

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
  };

  const requestEth = async () => {
    if (!walletAddress) {
      alert('Please connect your wallet first');
      return;
    }

    setIsRequestingEth(true);
    try {
      const response = await fetch('/api/faucet-eth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientAddress: walletAddress }),
      });

      const data = await response.json();

      if (data.success) {
        console.log(`Successfully received ${data.amount} ETH!`);
        // Refetch balance multiple times to overcome caching
        setTimeout(() => refetchEth(), 2000);
        setTimeout(() => refetchEth(), 4000);
        setTimeout(() => refetchEth(), 6000);
      } else {
        console.error('Failed to get ETH:', data.error);
        console.error('ETH faucet failed:', data.error);
        // Toast notification would be better than alert
        alert(data.error || 'Failed to get ETH. Please try again.');
      }
    } catch (error: any) {
      console.error('Faucet error:', error);
      alert('Failed to request ETH from faucet. Please check your connection and try again.');
    } finally {
      setIsRequestingEth(false);
    }
  };

  const mintTestUSDC = async () => {
    if (!walletAddress) {
      alert('Please connect your wallet first');
      return;
    }

    setIsMinting(true);
    try {
      const response = await fetch('/api/faucet-usdc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientAddress: walletAddress }),
      });

      const data = await response.json();

      if (data.success) {
        console.log(`Successfully received ${data.amount} USDC!`);
        // Refetch balance multiple times to overcome caching
        setTimeout(() => refetchUsdc(), 2000);
        setTimeout(() => refetchUsdc(), 4000);
        setTimeout(() => refetchUsdc(), 6000);
      } else {
        console.error('Failed to get USDC:', data.error);
        console.error('USDC faucet failed:', data.error);
        alert(data.error || 'Failed to get USDC. Please try again.');
      }
    } catch (error: any) {
      console.error('Faucet error:', error);
      alert('Failed to request USDC from faucet. Please check your connection and try again.');
    } finally {
      setIsMinting(false);
    }
  };

  // Desktop view component
  const DesktopView = () => (
    <div className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm min-w-max">
      <div className="font-medium text-gray-900 mb-2">Test Balances</div>
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-gray-600 w-10">ETH:</span>
          <span className="font-medium text-gray-900 min-w-12">
            {isLoading ? (
              <div className="w-12 h-4 bg-gray-200 rounded animate-pulse" />
            ) : (
              formatBalance(ethBalance?.value, 18)
            )}
          </span>
          <button 
            onClick={requestEth}
            disabled={isRequestingEth}
            className="text-blue-600 hover:text-blue-800 hover:underline text-xs disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {isRequestingEth ? 'sending...' : 'get more'}
          </button>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-600 w-10">USDC:</span>
          <span className="font-medium text-gray-900 min-w-12">
            {isLoading ? (
              <div className="w-12 h-4 bg-gray-200 rounded animate-pulse" />
            ) : (
              formatBalance(usdcBalance?.value, 6)
            )}
          </span>
          <button 
            onClick={mintTestUSDC}
            disabled={isMinting}
            className="text-blue-600 hover:text-blue-800 hover:underline text-xs disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {isMinting ? 'minting...' : 'get more'}
          </button>
        </div>
      </div>
    </div>
  );

  // Mobile view component
  const MobileView = () => (
    <div className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-xs">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <span className="text-gray-600">Ξ</span>
          <span className="font-medium text-gray-900">
            {isLoading ? '...' : formatBalance(ethBalance?.value, 18)}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-gray-600">$</span>
          <span className="font-medium text-gray-900">
            {isLoading ? '...' : formatBalance(usdcBalance?.value, 6)}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop view - show on desktop or when forced */}
      <div className={forceDesktopView ? "block" : "hidden md:block"}>
        <DesktopView />
      </div>

      {/* Mobile view - only show on mobile when not forced to desktop */}
      {!forceDesktopView && (
        <div className="md:hidden">
          <MobileView />
        </div>
      )}
    </>
  );
}