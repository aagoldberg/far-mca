'use client';

import { useState } from 'react';
import { useBalance } from 'wagmi';
import { useEvmAddress } from '@coinbase/cdp-hooks';
import { formatUnits } from 'viem';
import Link from 'next/link';

const USDC_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_USDC_ADDRESS as `0x${string}`;

export function WalletBalance({ forceDesktopView = false }: { forceDesktopView?: boolean }) {
  const { evmAddress: walletAddress } = useEvmAddress();
  const [showTooltip, setShowTooltip] = useState(false);

  // Get ETH balance
  const { data: ethBalance, isLoading: ethLoading } = useBalance({
    address: walletAddress,
  });

  // Get USDC balance
  const { data: usdcBalance, isLoading: usdcLoading } = useBalance({
    address: walletAddress,
    token: USDC_CONTRACT_ADDRESS,
  });

  if (!walletAddress) return null;

  const isLoading = ethLoading || usdcLoading;

  const formatBalance = (balance: bigint | undefined, decimals: number) => {
    if (!balance) return '0.00';
    const formatted = formatUnits(balance, decimals);
    const num = parseFloat(formatted);
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num < 0.01 && num > 0 ? '<0.01' : num.toFixed(2);
  };

  const usdcFormatted = formatBalance(usdcBalance?.value, 6);

  // Desktop view component - just shows USDC balance
  const DesktopView = () => (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 pl-3 pr-3 py-2 rounded-full cursor-default transition-colors">
        {/* USDC Icon */}
        <div className="w-5 h-5 rounded-full bg-[#2775CA] flex items-center justify-center">
          <span className="text-white text-[10px] font-bold">$</span>
        </div>
        <span className="text-[14px] font-semibold text-gray-900">
          {isLoading ? (
            <span className="text-gray-400">...</span>
          ) : (
            usdcFormatted
          )}
        </span>
      </div>

      {/* Tooltip with full balances */}
      {showTooltip && (
        <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 p-3 z-50 min-w-[180px]">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-gray-500">USDC</span>
              <span className="text-[13px] font-semibold text-gray-900">
                ${formatUnits(usdcBalance?.value || 0n, 6)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-gray-500">ETH</span>
              <span className="text-[13px] font-semibold text-gray-900">
                {parseFloat(formatUnits(ethBalance?.value || 0n, 18)).toFixed(4)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Mobile view component
  const MobileView = () => (
    <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full">
      <div className="w-4 h-4 rounded-full bg-[#2775CA] flex items-center justify-center">
        <span className="text-white text-[8px] font-bold">$</span>
      </div>
      <span className="text-[13px] font-semibold text-gray-900">
        {isLoading ? '...' : usdcFormatted}
      </span>
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
