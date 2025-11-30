"use client";

import { useCDPAuth } from '@/hooks/useCDPAuth';
import { useState } from 'react';

interface PrivyFundingButtonProps {
  fiatAmount?: number;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}

// TODO: CDP Migration - This component needs CDP equivalents for:
// - useFundWallet: CDP has different funding mechanisms
// - useCreateWallet: CDP uses embedded wallets differently
// For now, this button is disabled until CDP funding is implemented
export function PrivyFundingButton({
  fiatAmount = 25,
  onSuccess,
  onError
}: PrivyFundingButtonProps) {
  const { user, authenticated } = useCDPAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleFundWallet = async () => {
    setIsLoading(true);
    onError?.('');

    try {
      let walletAddress: string;

      if (!authenticated || !user?.wallet) {
        // Create a guest wallet if user isn't authenticated
        onError?.('Creating guest wallet...');
        const wallet = await createWallet();
        walletAddress = wallet.address;
        onSuccess?.('Guest wallet created! You can fund it now.');
      } else {
        walletAddress = user.wallet.address;
      }

      // Fund the wallet (guest or authenticated)
      onError?.('Opening funding interface...');
      fundWallet(walletAddress);
      
    } catch (error: any) {
      setIsLoading(false);
      console.error('Funding error:', error);
      if (error.message?.includes('not enabled')) {
        onError?.('Funding not available on this network. Try using the faucet for testnet funds.');
      } else {
        onError?.(error.message || 'Failed to fund wallet');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFaucet = () => {
    window.open('https://faucet.quicknode.com/base/sepolia', '_blank');
    onSuccess?.('Faucet opened! Get free test ETH for Base Sepolia.');
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleFundWallet}
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Processing...' : '💳 Fund Wallet (Privy)'}
      </button>
      
      <button
        onClick={handleFaucet}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
      >
        🚰 Get Test ETH (Faucet)
      </button>
    </div>
  );
} 