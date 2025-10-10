"use client";

import { useState } from 'react';
import { useFundWallet, usePrivy } from '@privy-io/react-auth';
import { parseUnits } from 'viem';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { PaymentButtonProps } from '../types';
import { campaignABI } from '@/abi/Campaign';
import { isSandboxMode, simulateSandboxDelay, generateMockTransaction } from '@/config/sandbox';

const USDC_ADDRESS = process.env.NEXT_PUBLIC_USDC_CONTRACT_ADDRESS as `0x${string}`;
const USDC_DECIMALS = 6;

export function PrivyFundingButton({
  method,
  campaignAddress,
  fiatAmount,
  disabled,
  onSuccess,
  onError,
}: PaymentButtonProps) {
  const { user, login } = usePrivy();
  const { address } = useAccount();
  const { fundWallet } = useFundWallet();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { writeContractAsync } = useWriteContract();
  
  const handleFunding = async () => {
    try {
      // Ensure user is logged in
      if (!user || !address) {
        login();
        return;
      }
      
      setIsProcessing(true);
      
      // In sandbox mode, simulate the entire flow
      if (isSandboxMode()) {
        await simulateSandboxDelay('privy');
        
        const mockTx = generateMockTransaction(fiatAmount, 'privy');
        onSuccess?.(`[SANDBOX] Wallet funded and donation completed! Mock TX: ${mockTx?.transactionHash?.slice(0, 10)}...`);
        setIsProcessing(false);
        return;
      }
      
      // Production flow: Fund wallet then donate
      try {
        // Step 1: Fund the wallet with USDC
        const fundingResult = await fundWallet(address);
        
        // Check if funding was successful
        if (!fundingResult || fundingResult.status === 'exited') {
          onError?.('Funding cancelled');
          setIsProcessing(false);
          return;
        }
        
        // Step 2: After funding, make the donation
        const amountInUSDC = parseUnits(fiatAmount.toString(), USDC_DECIMALS);
        
        // Call the donate function on the campaign contract
        const txHash = await writeContractAsync({
          address: campaignAddress,
          abi: campaignABI,
          functionName: 'donate',
          args: [amountInUSDC],
        });
        
        onSuccess?.(`Donation successful! Transaction: ${txHash}`);
      } catch (fundingError: any) {
        console.error('Funding error:', fundingError);
        onError?.(fundingError.message || 'Funding failed');
      }
      
    } catch (error: any) {
      console.error('Privy funding error:', error);
      onError?.(error.message || 'Funding failed');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const getButtonText = () => {
    if (isProcessing) return 'Processing...';
    if (!user) return 'Connect to Donate';
    
    const methodText = method === 'card' ? 'Card' : 'Exchange';
    return `Donate $${fiatAmount} via ${methodText}`;
  };
  
  return (
    <button
      onClick={handleFunding}
      disabled={disabled || isProcessing || fiatAmount < 5}
      className="w-full mt-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
    >
      {getButtonText()}
    </button>
  );
}