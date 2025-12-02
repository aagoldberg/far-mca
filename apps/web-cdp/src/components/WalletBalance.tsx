'use client';

import { useEffect, useState } from 'react';
import { useBalance, usePublicClient, useWalletClient } from 'wagmi';
import { useEvmAddress } from '@coinbase/cdp-hooks';
import { formatUnits } from 'viem';

const USDC_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_USDC_ADDRESS as `0x${string}`;

export function WalletBalance({ forceDesktopView = false }: { forceDesktopView?: boolean }) {
  const { evmAddress: walletAddress } = useEvmAddress();
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
    <div className="flex items-center gap-4 text-sm">
      {/* ETH Balance */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg">
          <span className="text-slate-500 font-medium">ETH</span>
          <span className="font-semibold text-slate-800">
            {isLoading ? (
              <span className="text-slate-400">...</span>
            ) : (
              formatBalance(ethBalance?.value, 18)
            )}
          </span>
        </div>
        <button
          onClick={requestEth}
          disabled={isRequestingEth}
          className="w-5 h-5 flex items-center justify-center text-xs text-teal-600 hover:text-white hover:bg-teal-600 font-bold border border-teal-300 hover:border-teal-600 rounded disabled:text-gray-400 disabled:border-gray-300 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
          title="Get test ETH"
        >
          {isRequestingEth ? '·' : '+'}
        </button>
      </div>

      {/* USDC Balance */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg">
          <span className="text-slate-500 font-medium">USDC</span>
          <span className="font-semibold text-slate-800">
            {isLoading ? (
              <span className="text-slate-400">...</span>
            ) : (
              formatBalance(usdcBalance?.value, 6)
            )}
          </span>
        </div>
        <button
          onClick={mintTestUSDC}
          disabled={isMinting}
          className="w-5 h-5 flex items-center justify-center text-xs text-teal-600 hover:text-white hover:bg-teal-600 font-bold border border-teal-300 hover:border-teal-600 rounded disabled:text-gray-400 disabled:border-gray-300 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
          title="Get test USDC"
        >
          {isMinting ? '·' : '+'}
        </button>
      </div>
    </div>
  );

  // Mobile view component
  const MobileView = () => (
    <div className="flex items-center gap-3 text-xs">
      <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md">
        <span className="text-slate-500">ETH</span>
        <span className="font-semibold text-slate-800">
          {isLoading ? '...' : formatBalance(ethBalance?.value, 18)}
        </span>
      </div>
      <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md">
        <span className="text-slate-500">USDC</span>
        <span className="font-semibold text-slate-800">
          {isLoading ? '...' : formatBalance(usdcBalance?.value, 6)}
        </span>
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