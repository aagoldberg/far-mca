'use client';

import { useState, useEffect } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { useEvmAddress, useSendEvmTransaction, useCurrentUser } from '@coinbase/cdp-hooks';
import { parseUnits, formatUnits, encodeFunctionData, createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import Link from 'next/link';
import { useLoanData, useContribute } from '@/hooks/useMicroLoan';
import { useUSDCBalance, useUSDCApprove, useNeedsApproval } from '@/hooks/useUSDC';
import { USDC_DECIMALS } from '@/types/loan';
import { USDC_ADDRESS } from '@/lib/wagmi';
import TestUSDCABI from '@/abi/TestUSDC.json';
import MicroLoanABI from '@/abi/MicroLoan.json';
import { InlineFundingSection } from './InlineFundingSection';

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

    // Try to get the revert reason and decode it
    try {
      const tx = await publicClient.getTransaction({ hash: txHash as `0x${string}` });
      console.error('[CDP] Failed transaction details:', tx);

      // Try to simulate the failed transaction to get revert reason
      try {
        await publicClient.call({
          data: tx.input,
          to: tx.to,
          from: tx.from,
          value: tx.value,
          blockNumber: receipt.blockNumber - 1n,
        });
      } catch (simulationError: any) {
        console.error('[CDP] Revert simulation error:', simulationError.shortMessage || simulationError.message);

        // Check if it's a known contract error
        const errorMsg = simulationError.shortMessage || simulationError.message || '';
        if (errorMsg.includes('SafeERC20FailedOperation')) {
          throw new Error('USDC transfer failed. The USDC contract rejected the transfer. This usually means insufficient balance or allowance.');
        } else if (errorMsg.includes('GoalExceeded')) {
          throw new Error('This loan has been fully funded or your contribution would exceed the goal.');
        } else if (errorMsg.includes('FundraisingNotActive')) {
          throw new Error('Fundraising has ended for this loan.');
        }
      }
    } catch (e: any) {
      if (e.message.includes('USDC transfer') || e.message.includes('fully funded') || e.message.includes('Fundraising')) {
        throw e; // Re-throw our specific errors
      }
      console.error('[CDP] Could not fetch transaction details:', e);
    }

    throw new Error('Transaction failed on-chain. The blockchain rejected this transaction. Please try refreshing the page and checking your balance.');
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
  const [copied, setCopied] = useState(false);

  // Check for both external wallet (wagmi) and CDP embedded wallet
  const { address: externalAddress, isConnected: isExternalConnected } = useAccount();
  const { evmAddress: cdpAddress } = useEvmAddress();
  const { currentUser } = useCurrentUser();

  // CDP creates BOTH an EOA and Smart Account when createOnLogin: 'smart'
  // - evmAddress returns the Smart Account (for display)
  // - evmAccounts[0] is the EOA (for signing with useSendEvmTransaction)
  const cdpEoaAddress = (currentUser as any)?.evmAccounts?.[0] as `0x${string}` | undefined;

  // Use whichever wallet is available (Smart Account for display)
  const address = externalAddress || cdpAddress;
  const isConnected = isExternalConnected || !!cdpAddress;
  const isCdpWallet = !!cdpAddress && !isExternalConnected;

  const { loanData, isLoading: loanLoading } = useLoanData(loanAddress);
  const { balance: usdcBalance, balanceFormatted } = useUSDCBalance(address);

  // Get ETH balance for gas estimation
  const { data: ethBalance, refetch: refetchEthBalance } = useBalance({
    address: address,
  });

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

        if (!cdpEoaAddress) {
          throw new Error('CDP EOA address not found. Please disconnect and reconnect your wallet.');
        }

        const result = await sendCdpTransaction({
          transaction: {
            to: USDC_ADDRESS,
            data: approveData,
            value: 0n,
            gas: 100000n, // Gas limit for approve
            chainId: 84532, // Base Sepolia
            type: "eip1559" as const,
          },
          evmAccount: cdpEoaAddress, // Use CDP EOA for signing
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
        console.log('[CDP] Transaction details:', {
          to: loanAddress,
          amount: amountInUnits.toString(),
          from: cdpEoaAddress,
        });

        if (!cdpEoaAddress) {
          throw new Error('CDP EOA address not found. Please disconnect and reconnect your wallet.');
        }

        const result = await sendCdpTransaction({
          transaction: {
            to: loanAddress,
            data: contributeData,
            value: 0n,
            gas: 200000n, // Increased gas limit for contribute
            chainId: 84532, // Base Sepolia
            type: "eip1559" as const,
          },
          evmAccount: cdpEoaAddress, // Use CDP EOA for signing
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

  const handleFundingComplete = async () => {
    console.log('[Funding] Funding complete, rechecking balances');
    // Refetch balances
    await refetchEthBalance();
    // USDC balance will auto-refresh via the hook
    // The useEffect will automatically update needsFunding state
  };

  const handleFund = async () => {
    console.log('[Fund] Starting fund process. Needs approval:', needsApproval);
    console.log('[Fund] Current allowance:', currentAllowance?.toString());
    console.log('[Fund] Amount to contribute:', amountBigInt.toString());
    console.log('[Fund] Loan address (spender):', loanAddress);
    console.log('[Fund] User address (wagmi):', externalAddress);
    console.log('[Fund] User address (CDP):', cdpAddress);
    console.log('[Fund] Active wallet:', address);
    console.log('[Fund] Using CDP wallet:', isCdpWallet);
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

  // Preset amounts
  const presetAmounts = ['25', '50', '100', '250'];

  if (loanLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8" />
          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-3 h-64 bg-gray-200 rounded-2xl" />
            <div className="md:col-span-2 h-80 bg-gray-200 rounded-2xl" />
          </div>
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
    const shareText = `I just supported a community loan on LendFriend - 0% interest lending powered by trust`;

    const handleShare = (platform: string) => {
      let url = '';
      switch (platform) {
        case 'twitter':
          url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
          break;
        case 'warpcast':
          url = `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
          break;
      }
      if (url) window.open(url, '_blank', 'width=600,height=400');
    };

    const handleCopyLink = async () => {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    };

    return (
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="text-center">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="text-[24px] font-semibold text-gray-900 mb-2">
            Thank you!
          </h2>
          <p className="text-[32px] font-bold text-gray-900 mb-2">
            ${amount} USDC
          </p>
          <p className="text-[15px] text-gray-500 mb-8">
            Your contribution is now supporting this loan
          </p>

          {/* Share Section */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-6">
            <p className="text-[15px] font-medium text-gray-900 mb-4">
              Help spread the word
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => handleShare('twitter')}
                className="flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white text-[14px] font-medium py-2.5 px-5 rounded-full transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                Post
              </button>
              <button
                onClick={() => handleShare('warpcast')}
                className="flex items-center justify-center gap-2 bg-[#855DCD] hover:bg-[#7047B8] text-white text-[14px] font-medium py-2.5 px-5 rounded-full transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM12 18l-4-4h3V7h2v7h3l-4 4z"/>
                </svg>
                Cast
              </button>
              <button
                onClick={handleCopyLink}
                className="flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-gray-700 text-[14px] font-medium py-2.5 px-5 rounded-full transition-colors border border-gray-200"
              >
                {copied ? (
                  <>
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              href={`/loan/${loanAddress}`}
              className="block w-full bg-brand-500 hover:bg-brand-600 text-white text-center font-semibold py-3.5 px-6 rounded-full transition-colors"
            >
              View loan details
            </Link>
            <Link
              href="/"
              className="block w-full text-[15px] text-gray-500 hover:text-gray-900 text-center font-medium py-2 transition-colors"
            >
              Back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const remainingNeeded = loanData.principal - loanData.totalFunded;
  const maxContribution = remainingNeeded < usdcBalance ? remainingNeeded : usdcBalance;

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href={`/loan/${loanAddress}`}
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Back to loan"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-[22px] font-semibold text-gray-900">Fund this loan</h1>
      </div>

      {/* Amount Selection */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[14px] font-medium text-gray-700">Select amount</p>
          <p className="text-[13px] text-gray-500">Balance: <span className="text-gray-900 font-medium">${balanceFormatted}</span></p>
        </div>
        <div className="grid grid-cols-4 gap-2 mb-3">
          {presetAmounts.map((preset) => (
            <button
              key={preset}
              onClick={() => setAmount(preset)}
              disabled={step !== 'input'}
              className={`py-3 rounded-lg font-medium text-[15px] transition-all ${
                amount === preset
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } disabled:opacity-50`}
            >
              ${preset}
            </button>
          ))}
        </div>

        <div className="relative">
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
            $
          </span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            disabled={step !== 'input'}
            max={formatUnits(maxContribution, USDC_DECIMALS)}
            step="0.01"
            className="w-full pl-9 pr-20 py-4 text-xl font-medium border border-gray-200 rounded-xl focus:border-gray-400 focus:ring-0 outline-none disabled:bg-gray-50"
          />
          <button
            onClick={() => setAmount(formatUnits(maxContribution, USDC_DECIMALS))}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[13px] text-brand-500 hover:text-brand-600 font-medium"
            disabled={step !== 'input'}
          >
            Use max
          </button>
        </div>
      </div>

      {/* Inline Funding Section - Always visible for adding funds */}
      {step === 'input' && (
        <div className="mb-6">
          <InlineFundingSection
            requiredUSDC={amount && parseFloat(amount) > 0 ? parseUnits(amount, USDC_DECIMALS) : 0n}
            requiredETH={parseUnits('0.002', 18)}
            currentUSDC={usdcBalance}
            currentETH={ethBalance?.value || 0n}
            walletAddress={address}
            onFundingComplete={handleFundingComplete}
          />
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-50 border border-red-100 rounded-xl">
          <p className="text-[14px] text-red-600">{errorMessage}</p>
          {step === 'error' && (
            <button
              onClick={() => {
                setStep('input');
                setErrorMessage('');
              }}
              className="mt-2 text-[13px] text-red-700 hover:text-red-800 underline"
            >
              Try again
            </button>
          )}
        </div>
      )}

      {/* Summary */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <div className="flex justify-between text-[14px] mb-2">
          <span className="text-gray-600">You'll receive back</span>
          <span className="font-semibold text-gray-900">
            ${amount && parseFloat(amount) > 0 ? parseFloat(amount).toFixed(2) : '0.00'} USDC
          </span>
        </div>
        <p className="text-[12px] text-gray-500">
          0% interest • Full repayment when loan is complete
        </p>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleFund}
        disabled={!amount || parseFloat(amount) <= 0 || step !== 'input' || (amount && parseUnits(amount, USDC_DECIMALS) > usdcBalance)}
        className="w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold py-4 px-6 rounded-xl transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
      >
        {step === 'approve' && ((isApproving || isApproveTxConfirming) || isCdpPending) && 'Approving...'}
        {step === 'contribute' && ((isContributing || isContributeTxConfirming) || isCdpPending) && 'Confirming...'}
        {step === 'input' && amount && parseUnits(amount, USDC_DECIMALS) > usdcBalance && 'Insufficient balance'}
        {step === 'input' && (!amount || parseUnits(amount || '0', USDC_DECIMALS) <= usdcBalance) && 'Fund loan'}
      </button>

      {/* Transaction Status */}
      {step !== 'input' && step !== 'success' && step !== 'error' && (
        <p className="text-[13px] text-gray-500 text-center mt-3">
          {step === 'approve' && 'Approve the transaction in your wallet...'}
          {step === 'contribute' && 'Confirm the contribution...'}
        </p>
      )}
    </div>
  );
}
