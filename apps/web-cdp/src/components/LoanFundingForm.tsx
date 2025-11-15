'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useEvmAddress, useSendEvmTransaction } from '@coinbase/cdp-hooks';
import { parseUnits, formatUnits, encodeFunctionData, createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import Link from 'next/link';
import { useLoanData, useContribute } from '@/hooks/useMicroLoan';
import { useUSDCBalance, useUSDCApprove, useNeedsApproval } from '@/hooks/useUSDC';
import { USDC_DECIMALS } from '@/types/loan';
import { USDC_ADDRESS } from '@/lib/wagmi';
import TestUSDCABI from '@/abi/TestUSDC.json';
import MicroLoanABI from '@/abi/MicroLoan.json';

// Helper function to wait for transaction confirmation
const waitForTransactionReceipt = async (txHash: string) => {
  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(process.env.NEXT_PUBLIC_RPC_URL || 'https://sepolia.base.org'),
  });

  console.log('[CDP] Polling for transaction receipt:', txHash);

  const receipt = await publicClient.waitForTransactionReceipt({
    hash: txHash as `0x${string}`,
    timeout: 60000, // 60 second timeout
  });

  if (receipt.status === 'reverted') {
    console.error('[CDP] Transaction reverted. Receipt:', receipt);

    // Try to get the revert reason
    try {
      const tx = await publicClient.getTransaction({ hash: txHash as `0x${string}` });
      console.error('[CDP] Failed transaction details:', tx);
    } catch (e) {
      console.error('[CDP] Could not fetch transaction details:', e);
    }

    throw new Error('Transaction failed on-chain. This could be due to insufficient balance, insufficient allowance, or the loan being fully funded.');
  }

  return receipt;
};

interface LoanFundingFormProps {
  loanAddress: `0x${string}`;
}

export default function LoanFundingForm({ loanAddress }: LoanFundingFormProps) {
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<'input' | 'approve' | 'contribute' | 'success' | 'error'>('input');
  const [errorMessage, setErrorMessage] = useState('');

  // Check for both external wallet (wagmi) and CDP embedded wallet
  const { address: externalAddress, isConnected: isExternalConnected } = useAccount();
  const { evmAddress: cdpAddress } = useEvmAddress();

  // Use whichever wallet is available
  const address = externalAddress || cdpAddress;
  const isConnected = isExternalConnected || !!cdpAddress;
  const isCdpWallet = !!cdpAddress && !isExternalConnected;

  const { loanData, isLoading: loanLoading } = useLoanData(loanAddress);
  const { balance: usdcBalance, balanceFormatted } = useUSDCBalance(address);

  // CDP transaction hooks
  const { sendEvmTransaction: sendCdpTransaction, isPending: isCdpPending } = useSendEvmTransaction();

  // Check if approval needed
  const amountBigInt = amount ? parseUnits(amount, USDC_DECIMALS) : 0n;
  const { needsApproval, currentAllowance } = useNeedsApproval(
    address,
    loanAddress,
    amountBigInt
  );

  // Contract interactions
  const {
    approve,
    isPending: isApproving,
    isConfirming: isApproveTxConfirming,
    isSuccess: isApproveSuccess,
    error: approveError
  } = useUSDCApprove();

  const {
    contribute,
    isPending: isContributing,
    isConfirming: isContributeTxConfirming,
    isSuccess: isContributeSuccess,
    error: contributeError
  } = useContribute();

  // Handle approval success -> move to contribute
  useEffect(() => {
    if (isApproveSuccess && step === 'approve') {
      handleContribute();
    }
  }, [isApproveSuccess]);

  // Handle contribute success
  useEffect(() => {
    if (isContributeSuccess && step === 'contribute') {
      setStep('success');
    }
  }, [isContributeSuccess]);

  // Helper function to parse error messages
  const parseErrorMessage = (error: any): string => {
    const errorStr = error?.message || String(error);
    console.log('[Error] Raw error:', errorStr);

    // User rejected transaction
    if (errorStr.includes('User rejected') ||
        errorStr.includes('User denied') ||
        errorStr.includes('user rejected') ||
        errorStr.includes('denied transaction')) {
      return 'Transaction cancelled. Please try again when you\'re ready.';
    }

    // Contract-specific errors
    if (errorStr.includes('GoalExceeded')) {
      return 'This loan has already been fully funded or your contribution would exceed the goal. Please refresh the page.';
    }

    if (errorStr.includes('FundraisingNotActive') || errorStr.includes('FundraisingEnded')) {
      return 'Fundraising for this loan has ended. Please refresh the page.';
    }

    if (errorStr.includes('InvalidAmount')) {
      return 'Invalid contribution amount. Please try a different amount.';
    }

    if (errorStr.includes('SafeERC20FailedOperation') || errorStr.includes('ERC20')) {
      return 'Token transfer failed. Please ensure you have sufficient USDC balance and approval.';
    }

    // Insufficient balance
    if (errorStr.includes('insufficient') || errorStr.includes('balance')) {
      return 'Insufficient balance. Please add more funds to your wallet.';
    }

    // Gas estimation failed
    if (errorStr.includes('gas') || errorStr.includes('execution reverted')) {
      return 'Transaction would fail. Please check your balance and try a smaller amount.';
    }

    // Default error message
    return 'Transaction failed. Please try again.';
  };

  // Handle errors
  useEffect(() => {
    if (approveError) {
      setStep('error');
      setErrorMessage(parseErrorMessage(approveError));
    }
  }, [approveError]);

  useEffect(() => {
    if (contributeError) {
      setStep('error');
      setErrorMessage(parseErrorMessage(contributeError));
    }
  }, [contributeError]);

  const handleApprove = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setErrorMessage('Please enter a valid amount');
      return;
    }

    if (!address) {
      setErrorMessage('Please connect your wallet');
      return;
    }

    const amountInUnits = parseUnits(amount, USDC_DECIMALS);

    // Check balance
    if (amountInUnits > usdcBalance) {
      setErrorMessage('Insufficient USDC balance');
      return;
    }

    // Check loan can accept this much
    if (loanData && loanData.totalFunded + amountInUnits > loanData.principal) {
      setErrorMessage('Amount exceeds remaining funding needed');
      return;
    }

    try {
      setStep('approve');
      setErrorMessage('');

      if (isCdpWallet) {
        // Use CDP transaction for approval
        const approveData = encodeFunctionData({
          abi: TestUSDCABI.abi,
          functionName: 'approve',
          args: [loanAddress, amountInUnits],
        });

        console.log('[CDP] Sending approval transaction...');
        const result = await sendCdpTransaction({
          transaction: {
            to: USDC_ADDRESS,
            data: approveData,
            value: 0n,
            gas: 100000n, // Gas limit for approve
            chainId: 84532, // Base Sepolia
            type: "eip1559" as const,
          },
          evmAccount: cdpAddress as `0x${string}`,
          network: 'base-sepolia',
        });

        console.log('[CDP] Approval transaction sent:', result);

        // Wait for transaction to be mined on-chain
        if (result?.transactionHash) {
          console.log('[CDP] Waiting for approval confirmation...');
          // Wait for the transaction to be confirmed (poll for receipt)
          await waitForTransactionReceipt(result.transactionHash);
          console.log('[CDP] Approval confirmed on-chain');
        }

        // Auto-proceed to contribute
        handleContribute();
      } else {
        // Use wagmi for external wallets
        await approve(loanAddress, amountInUnits, false);
      }
    } catch (error: any) {
      console.error('[Approve] Error:', error);
      setStep('error');
      setErrorMessage(parseErrorMessage(error));
    }
  };

  const handleContribute = async () => {
    try {
      setStep('contribute');
      setErrorMessage('');
      const amountInUnits = parseUnits(amount, USDC_DECIMALS);

      if (isCdpWallet) {
        // Use CDP transaction for contribution
        const contributeData = encodeFunctionData({
          abi: MicroLoanABI.abi,
          functionName: 'contribute',
          args: [amountInUnits],
        });

        console.log('[CDP] Sending contribution transaction...');
        const result = await sendCdpTransaction({
          transaction: {
            to: loanAddress,
            data: contributeData,
            value: 0n,
            gas: 150000n, // Gas limit for contribute
            chainId: 84532, // Base Sepolia
            type: "eip1559" as const,
          },
          evmAccount: cdpAddress as `0x${string}`,
          network: 'base-sepolia',
        });

        console.log('[CDP] Contribution transaction sent:', result);

        // Wait for transaction to be mined on-chain
        if (result?.transactionHash) {
          console.log('[CDP] Waiting for contribution confirmation...');
          await waitForTransactionReceipt(result.transactionHash);
          console.log('[CDP] Contribution confirmed on-chain');
        }

        // Show success only after blockchain confirmation
        setStep('success');
      } else {
        // Use wagmi for external wallets
        await contribute(loanAddress, amountInUnits);
      }
    } catch (error: any) {
      console.error('[Contribute] Error:', error);
      setStep('error');
      setErrorMessage(parseErrorMessage(error));
    }
  };

  const handleFund = async () => {
    console.log('[Fund] Starting fund process. Needs approval:', needsApproval);
    console.log('[Fund] Current allowance:', currentAllowance?.toString());
    console.log('[Fund] Amount to contribute:', amountBigInt.toString());
    console.log('[Fund] Loan address (spender):', loanAddress);
    console.log('[Fund] User address:', address);
    console.log('[Fund] Loan state - Total funded:', loanData?.totalFunded.toString(), 'Principal:', loanData?.principal.toString());
    console.log('[Fund] Remaining needed:', (loanData?.principal && loanData?.totalFunded) ? (loanData.principal - loanData.totalFunded).toString() : 'unknown');

    // Fetch real-time on-chain state before transaction
    try {
      const publicClient = createPublicClient({
        chain: baseSepolia,
        transport: http(process.env.NEXT_PUBLIC_RPC_URL || 'https://sepolia.base.org'),
      });

      // Check actual on-chain USDC balance
      const onChainBalance = await publicClient.readContract({
        address: USDC_ADDRESS,
        abi: TestUSDCABI.abi,
        functionName: 'balanceOf',
        args: [address],
      }) as bigint;

      // Check actual on-chain loan state
      const [onChainTotalFunded, onChainPrincipal, onChainFundraisingActive] = await Promise.all([
        publicClient.readContract({
          address: loanAddress,
          abi: MicroLoanABI.abi,
          functionName: 'totalFunded',
        }) as Promise<bigint>,
        publicClient.readContract({
          address: loanAddress,
          abi: MicroLoanABI.abi,
          functionName: 'principal',
        }) as Promise<bigint>,
        publicClient.readContract({
          address: loanAddress,
          abi: MicroLoanABI.abi,
          functionName: 'fundraisingActive',
        }) as Promise<boolean>,
      ]);

      console.log('[Fund] On-chain USDC balance:', onChainBalance.toString());
      console.log('[Fund] On-chain loan total funded:', onChainTotalFunded.toString());
      console.log('[Fund] On-chain loan principal:', onChainPrincipal.toString());
      console.log('[Fund] On-chain fundraising active:', onChainFundraisingActive);

      // Check if USDC balance is sufficient
      if (onChainBalance < amountBigInt) {
        setStep('error');
        setErrorMessage(`Insufficient USDC balance. You have ${formatUnits(onChainBalance, USDC_DECIMALS)} USDC but trying to contribute ${amount} USDC.`);
        return;
      }

      // Check if loan is already fully funded
      if (onChainTotalFunded >= onChainPrincipal) {
        setStep('error');
        setErrorMessage('This loan has already been fully funded! Please refresh the page.');
        return;
      }

      // Check if contribution would exceed goal
      if (onChainTotalFunded + amountBigInt > onChainPrincipal) {
        const remaining = onChainPrincipal - onChainTotalFunded;
        setStep('error');
        setErrorMessage(`This loan only needs ${formatUnits(remaining, USDC_DECIMALS)} USDC more. Please reduce your contribution amount.`);
        return;
      }

      // Check if fundraising is still active
      if (!onChainFundraisingActive) {
        setStep('error');
        setErrorMessage('Fundraising for this loan is no longer active. Please refresh the page.');
        return;
      }
    } catch (error) {
      console.error('[Fund] Error checking on-chain state:', error);
      // Continue anyway - let the transaction fail if there's an issue
    }

    if (needsApproval) {
      console.log('[Fund] Approval required, calling handleApprove');
      await handleApprove();
    } else {
      console.log('[Fund] No approval needed, proceeding to contribute');
      await handleContribute();
    }
  };

  if (loanLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-6" />
          <div className="h-48 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!loanData) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <p className="text-red-500 mb-4">Loan not found</p>
        <Link href="/" className="text-[#3B9B7F] hover:underline">
          ← Back to loans
        </Link>
      </div>
    );
  }

  if (!loanData.fundraisingActive) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link href={`/loan/${loanAddress}`} className="inline-flex items-center text-[#3B9B7F] hover:text-[#2E7D68] mb-6">
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to loan
        </Link>

        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Fundraising Closed</h2>
          <p className="text-gray-600">
            This loan is no longer accepting contributions
          </p>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link href={`/loan/${loanAddress}`} className="inline-flex items-center text-[#3B9B7F] hover:text-[#2E7D68] mb-6">
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to loan
        </Link>

        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Wallet Not Connected</h2>
          <p className="text-gray-600">
            Please sign in to fund this loan
          </p>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    const shareUrl = `${window.location.origin}/loan/${loanAddress}`;
    const shareText = `I just supported this amazing loan on LendFriend! Join me in making a difference 🙏`;

    const handleShare = (platform: string) => {
      let url = '';
      switch (platform) {
        case 'twitter':
          url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
          break;
        case 'facebook':
          url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
          break;
        case 'linkedin':
          url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
          break;
        case 'warpcast':
          url = `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
          break;
        case 'whatsapp':
          url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
          break;
        case 'telegram':
          url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
          break;
      }
      if (url) window.open(url, '_blank', 'width=600,height=400');
    };

    const handleCopyLink = async () => {
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    };

    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <div className="text-center mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Contribution Successful
            </h2>
            <p className="text-lg text-gray-700 mb-2">
              ${amount} USDC
            </p>
            <p className="text-sm text-gray-500">
              Your contribution has been confirmed and is now supporting this loan
            </p>
          </div>

          {/* Share Section */}
          <div className="bg-gray-50 rounded-xl p-5 mb-6">
            <h3 className="text-base font-semibold text-gray-900 mb-2">
              Help This Loan Reach Its Goal
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Share with your network to help fund this loan faster
            </p>

            {/* Social Share Buttons Grid */}
            <div className="grid grid-cols-2 gap-2.5 mb-3">
              {/* Twitter/X */}
              <button
                onClick={() => handleShare('twitter')}
                className="flex items-center justify-center gap-1.5 bg-black hover:bg-gray-800 text-white text-sm font-medium py-2.5 px-3 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span>X/Twitter</span>
              </button>

              {/* Farcaster */}
              <button
                onClick={() => handleShare('warpcast')}
                className="flex items-center justify-center gap-1.5 bg-[#855DCD] hover:bg-[#7047B8] text-white text-sm font-medium py-2.5 px-3 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM12 18l-4-4h3V7h2v7h3l-4 4z"/>
                </svg>
                <span>Farcaster</span>
              </button>

              {/* Facebook */}
              <button
                onClick={() => handleShare('facebook')}
                className="flex items-center justify-center gap-1.5 bg-[#1877F2] hover:bg-[#0C63D4] text-white text-sm font-medium py-2.5 px-3 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook</span>
              </button>

              {/* LinkedIn */}
              <button
                onClick={() => handleShare('linkedin')}
                className="flex items-center justify-center gap-1.5 bg-[#0A66C2] hover:bg-[#004182] text-white text-sm font-medium py-2.5 px-3 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span>LinkedIn</span>
              </button>

              {/* WhatsApp */}
              <button
                onClick={() => handleShare('whatsapp')}
                className="flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#1EBE57] text-white text-sm font-medium py-2.5 px-3 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <span>WhatsApp</span>
              </button>

              {/* Telegram */}
              <button
                onClick={() => handleShare('telegram')}
                className="flex items-center justify-center gap-1.5 bg-[#229ED9] hover:bg-[#0C8ACF] text-white text-sm font-medium py-2.5 px-3 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
                <span>Telegram</span>
              </button>
            </div>

            {/* Copy Link Button */}
            <button
              onClick={handleCopyLink}
              className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium py-2.5 px-4 rounded-lg transition-colors border border-gray-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Copy Link</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5">
            <Link
              href={`/loan/${loanAddress}`}
              className="block w-full bg-[#3B9B7F] hover:bg-[#2E7D68] text-white text-center font-semibold py-3.5 px-6 rounded-xl transition-colors duration-200"
            >
              View Loan Details
            </Link>
            <Link
              href="/"
              className="block w-full bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 text-center font-medium py-3.5 px-6 rounded-xl transition-colors duration-200"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const remainingNeeded = loanData.principal - loanData.totalFunded;
  const maxContribution = remainingNeeded < usdcBalance ? remainingNeeded : usdcBalance;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <Link href={`/loan/${loanAddress}`} className="inline-flex items-center text-[#3B9B7F] hover:text-[#2E7D68] mb-6">
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to loan
      </Link>

      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
        Lend a Hand
      </h1>
      <p className="text-gray-600 mb-6">
        Your interest-free loan helps a neighbor's dream become reality. Together, we lift each other up.
      </p>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount (USDC)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">
              $
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              disabled={step !== 'input'}
              max={formatUnits(maxContribution, USDC_DECIMALS)}
              step="0.01"
              className="w-full pl-8 pr-4 py-4 text-2xl font-semibold border-2 border-gray-300 rounded-xl focus:border-[#3B9B7F] focus:ring-0 outline-none disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>
          <div className="flex justify-between items-center mt-2 text-sm">
            <p className="text-gray-500">
              Balance: {balanceFormatted}
            </p>
            <button
              onClick={() => setAmount(formatUnits(maxContribution, USDC_DECIMALS))}
              className="text-[#3B9B7F] hover:text-[#2E7D68] font-medium"
              disabled={step !== 'input'}
            >
              Max
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Remaining needed: ${formatUnits(remainingNeeded, USDC_DECIMALS)} USDC
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-600">{errorMessage}</p>
            {step === 'error' && (
              <button
                onClick={() => {
                  setStep('input');
                  setErrorMessage('');
                }}
                className="mt-2 text-sm text-red-700 hover:text-red-800 underline"
              >
                Try again
              </button>
            )}
          </div>
        )}

        <button
          onClick={handleFund}
          disabled={!amount || parseFloat(amount) <= 0 || step !== 'input'}
          className="w-full bg-[#3B9B7F] hover:bg-[#2E7D68] text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {step === 'approve' && ((isApproving || isApproveTxConfirming) || isCdpPending) && 'Approving USDC...'}
          {step === 'contribute' && ((isContributing || isContributeTxConfirming) || isCdpPending) && 'Confirming contribution...'}
          {step === 'input' && (needsApproval ? 'Approve & Fund Loan' : 'Fund Loan')}
        </button>

        {step !== 'input' && step !== 'success' && step !== 'error' && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-sm text-blue-700 text-center">
              {step === 'approve' && 'Please approve USDC spending in your wallet...'}
              {step === 'contribute' && 'Please confirm the contribution in your wallet...'}
            </p>
          </div>
        )}
      </div>

      <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
          Zero-Interest Model
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Interest Rate</span>
            <span className="font-medium text-green-600">0%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Repayment Multiple</span>
            <span className="font-medium text-gray-900">1.0x</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-green-200">
            <span className="text-gray-600">You'll receive back</span>
            <span className="font-semibold text-[#3B9B7F]">
              ${amount && parseFloat(amount) > 0
                ? parseFloat(amount).toFixed(2)
                : '0.00'} USDC
            </span>
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-4 italic">
          This is lending with heart. Your generosity helps someone build their future, and you'll receive every dollar back - no interest charged, just community care.
        </p>
      </div>
    </div>
  );
}
