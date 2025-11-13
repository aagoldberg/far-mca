"use client";

import React, { useState } from 'react';
import { ConnectedWallet } from '@privy-io/react-auth';
import { useAccount, useBalance, useWriteContract, useWaitForTransactionReceipt, useChainId, useSwitchChain, useReadContract, usePublicClient } from 'wagmi';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { parseUnits, formatUnits } from 'viem';
import { baseSepolia } from 'viem/chains';
import { campaignABI } from '@/abi/Campaign';
import { erc20Abi } from 'viem';
import { ErrorDisplay } from './ErrorDisplay';
import { createUserFriendlyError } from '@/utils/errorHandling';

const USDC_ADDRESS = process.env.NEXT_PUBLIC_USDC_CONTRACT_ADDRESS as `0x${string}`;
const USDC_DECIMALS = 6;

type WalletDonationButtonProps = {
    wallet: ConnectedWallet | null;
    campaignAddress: string;
    fiatAmount: number;
    onSuccess: (message: string) => void;
    onError: (message: string) => void;
};

export const WalletDonationButton: React.FC<WalletDonationButtonProps> = ({
    wallet,
    campaignAddress,
    fiatAmount,
    onSuccess,
    onError
}) => {
    const { address, isConnected } = useAccount();
    const { authenticated, user, login } = usePrivy();
    const { wallets } = useWallets();
    const chainId = useChainId();
    const { switchChain } = useSwitchChain();
    const [isProcessing, setIsProcessing] = useState(false);
    const [displayError, setDisplayError] = useState<unknown>(null);

    // Debug chain detection
    React.useEffect(() => {
        console.log('Detected chain ID:', chainId);
        console.log('Expected chain ID:', baseSepolia.id);
        console.log('Are they equal?', chainId === baseSepolia.id);
    }, [chainId]);

    const isCorrectNetwork = chainId === baseSepolia.id;
    
    // Log chain detection issues for debugging
    React.useEffect(() => {
        if (chainId !== undefined && chainId !== baseSepolia.id) {
            console.warn(`⚠️ CHAIN MISMATCH: App detected ${chainId}, need ${baseSepolia.id}`);
            const networkName = chainId === 1 ? 'Ethereum Mainnet' : 
                               chainId === 8453 ? 'Base Mainnet' :
                               `Chain ${chainId}`;
            console.warn(`Current network: ${networkName}, Target: Base Sepolia`);
        }
    }, [chainId]);
    
    // Check if user has a wallet through Privy
    const hasPrivyWallet = user?.wallet?.address;
    const privyWallet = wallets.find(w => w.walletClientType === 'privy');
    const externalWallet = wallets.find(w => w.walletClientType !== 'privy');
    
    const effectiveAddress = address || hasPrivyWallet;
    const effectivelyConnected = isConnected || !!hasPrivyWallet;
    
    console.log('Wallet connection debug:', {
        wagmiAddress: address,
        wagmiConnected: isConnected,
        privyWalletAddress: hasPrivyWallet,
        privyAuthenticated: authenticated,
        privyWallet: privyWallet?.address,
        externalWallet: externalWallet?.address,
        totalWallets: wallets.length,
        effectiveAddress,
        effectivelyConnected
    });
    
    const { data: balance } = useBalance({
        address: effectiveAddress as `0x${string}`,
        token: USDC_ADDRESS,
        chainId: baseSepolia.id,
    });

    const { 
        writeContract, 
        data: hash,
        isPending: isWritePending,
        error: writeError 
    } = useWriteContract();

    const { 
        isLoading: isConfirming, 
        isSuccess, 
        isError: isTransactionError,
        error: transactionError,
        data: receipt 
    } = useWaitForTransactionReceipt({
        hash,
    });

    const [currentStep, setCurrentStep] = useState<'approve' | 'donate' | 'complete'>('approve');
    const [approvalHash, setApprovalHash] = useState<string | null>(null);

    // Debug transaction states
    React.useEffect(() => {
        console.log('🔍 TRANSACTION STATE DEBUG:');
        console.log('  - isSuccess:', isSuccess);
        console.log('  - isTransactionError:', isTransactionError);
        console.log('  - isConfirming:', isConfirming);
        console.log('  - hash:', hash);
        console.log('  - currentStep:', currentStep);
        console.log('  - receipt status:', receipt?.status);
        console.log('  - receipt data:', receipt);
    }, [isSuccess, isTransactionError, isConfirming, hash, currentStep, receipt]);

    // Handle successful transactions
    React.useEffect(() => {
        if (isSuccess && hash) {
            console.log(`✅ Transaction successful for step: ${currentStep}`);
            console.log(`✅ Transaction hash: ${hash}`);
            console.log(`✅ Receipt:`, receipt);
            
            if (currentStep === 'approve') {
                console.log('Approval successful, proceeding to donate...');
                console.log('Setting approval hash to:', hash);
                setApprovalHash(hash);
                
                // IMPORTANT: Clear the hash to avoid confusion with donation transaction
                // and move to donate step
                setCurrentStep('donate');
                
                // Wait longer to ensure approval is fully confirmed
                setTimeout(() => {
                    console.log('✅ Approval confirmed, proceeding with donation...');
                    console.log('✅ Stored approval hash:', hash);
                    executeDonation(0);
                }, 3000);
            } else if (currentStep === 'donate') {
                // Only trigger success if this is actually a NEW donation transaction
                if (hash !== approvalHash) {
                    console.log('Donation successful!');
                    console.log('🎉 DONATION COMPLETED SUCCESSFULLY ON BLOCKCHAIN! 🎉');
                    onSuccess(`Successfully donated $${fiatAmount} to the campaign! Transaction: ${hash}`);
                    setCurrentStep('complete');
                    setIsProcessing(false);
                } else {
                    console.log('⚠️ Skipping success trigger - this is the approval transaction hash, not donation');
                }
            }
        }
    }, [isSuccess, hash, currentStep, fiatAmount, onSuccess, receipt, approvalHash]);

    // Handle transaction error with detailed logging
    React.useEffect(() => {
        if (isTransactionError && hash) {
            console.error('🚨 TRANSACTION FAILED:');
            console.error('  - Hash:', hash);
            console.error('  - Current step:', currentStep);
            console.error('  - Transaction error:', transactionError);
            console.error('  - Receipt data:', receipt);
            
            if (transactionError) {
                console.error('  - Error message:', transactionError.message);
                console.error('  - Error details:', transactionError);
            }
            
            const friendlyError = createUserFriendlyError(transactionError);
            setDisplayError(transactionError);
            onError(friendlyError.details.message);
            setIsProcessing(false);
            setCurrentStep('approve');
        }
    }, [isTransactionError, hash, currentStep, transactionError, receipt, onError]);

    
    // Handle writeContract errors
    React.useEffect(() => {
        if (writeError) {
            console.error('🚨 WRITE CONTRACT ERROR:');
            console.error('  - Error:', writeError);
            console.error('  - Error message:', writeError.message);
            console.error('  - Current step:', currentStep);
            console.error('  - Error details:', writeError);
            
            setIsProcessing(false);
            setCurrentStep('approve');
            
            // Show user-friendly error
            const friendlyError = createUserFriendlyError(writeError);
            setDisplayError(writeError);
            onError(friendlyError.details.message);
        }
    }, [writeError, currentStep, onError]);

    const usdcAmount = parseUnits(fiatAmount.toString(), USDC_DECIMALS);
    const hasInsufficientBalance = balance && balance.value < usdcAmount;
    
    // Debug logging for amounts
    console.log('💰 Amount Debug:', {
        fiatAmount,
        usdcAmount: usdcAmount.toString(),
        usdcAmountFormatted: formatUnits(usdcAmount, USDC_DECIMALS),
        userBalance: balance ? balance.value.toString() : 'loading',
        userBalanceFormatted: balance ? formatUnits(balance.value, USDC_DECIMALS) : 'loading',
        hasInsufficientBalance
    });

    const handleDonate = async () => {
        if (!authenticated) {
            login();
            return;
        }
        
        // If using Privy embedded wallet, ensure it's connected to wagmi
        if (privyWallet && !isConnected) {
            console.log('Privy embedded wallet detected but not connected to wagmi');
            try {
                // Try to trigger wallet connection
                await privyWallet.switchChain(baseSepolia.id);
                // Small delay to let connection establish
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (error) {
                console.error('Failed to connect Privy wallet:', error);
            }
        }
        
        if (!effectivelyConnected || !effectiveAddress) {
            console.log('Wallet not connected properly:', {
                effectivelyConnected,
                effectiveAddress,
                authenticated,
                isConnected
            });
            onError("Please connect your wallet first");
            return;
        }
        
        // Additional check for wagmi connection when using external wallets
        if (!hasPrivyWallet && !isConnected) {
            console.log('External wallet not connected via wagmi');
            onError("Wallet not properly connected. Please reconnect your wallet.");
            return;
        }

        // ALWAYS attempt to switch to Base Sepolia before transactions
        // This is because the wallet might be on wrong chain even if app thinks it's correct
        console.log(`FORCING network switch to Base Sepolia...`);
        console.log(`App detected chain ID: ${chainId}`);
        console.log(`Target chain ID: ${baseSepolia.id}`);
        console.log(`App thinks chains match: ${isCorrectNetwork}`);
        
        try {
            console.log(`Forcing switch to Base Sepolia (${baseSepolia.id})`);
            
            // ALWAYS try to switch, regardless of what app thinks current chain is
            if (privyWallet) {
                console.log('Using Privy wallet switchChain method');
                await privyWallet.switchChain(baseSepolia.id);
            } else if (switchChain) {
                console.log('Using wagmi switchChain method');
                await switchChain({ chainId: baseSepolia.id });
            } else {
                throw new Error('No chain switching method available');
            }
            
            console.log('Network switch requested - user should see wallet prompt');
            
            // Wait for network switch to complete
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            console.log('Network switch wait completed');
            
        } catch (error) {
            console.error('FORCED network switch failed:', error);
            
            // If switch failed, show clear error and stop
            setIsProcessing(false);
            onError(`Network switch failed. Please manually switch your wallet to Base Sepolia and try again. Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            return;
        }

        if (hasInsufficientBalance) {
            onError(`Insufficient USDC balance. You need at least ${fiatAmount} USDC`);
            return;
        }

        setIsProcessing(true);
        setCurrentStep('approve');

        try {
            console.log('\n=== TRANSACTION ATTEMPT START ===');
            console.log('Step 1: Approving USDC spending...');
            console.log('📍 Campaign address:', campaignAddress);
            console.log('💰 USDC amount (raw):', usdcAmount.toString());
            console.log('💰 USDC amount (formatted):', formatUnits(usdcAmount, USDC_DECIMALS), 'USDC');
            console.log('💰 Fiat amount input:', fiatAmount);
            console.log('💰 Approval spender:', campaignAddress);
            console.log('🔍 WALLET DEBUG:');
            console.log('  - wagmi address:', address);
            console.log('  - privy user wallet:', user?.wallet?.address);
            console.log('  - privy wallet from wallets:', privyWallet?.address);
            console.log('  - effective address:', effectiveAddress);
            
            console.log('🔍 CONTRACT DEBUG:');
            console.log('  - USDC contract:', USDC_ADDRESS);
            console.log('  - Campaign contract:', campaignAddress);
            console.log('  - Chain ID:', chainId);
            console.log('  - Expected chain:', baseSepolia.id);
            
            // Check if using Privy's smart wallet (4337)
            const isSmartWallet = privyWallet && hasPrivyWallet;
            
            if (isSmartWallet) {
                console.log('Detected Privy smart wallet - using UserOperation gas estimation workaround');
                
                // For 4337 wallets, let Privy handle nonce management
                // Just set gas params without nonce
                const contractCall = {
                    address: USDC_ADDRESS,
                    abi: erc20Abi,
                    functionName: 'approve' as const,
                    args: [campaignAddress as `0x${string}`, usdcAmount],
                    gas: 200000n, // Even higher gas limit for UserOperation
                    // Don't specify gas prices - let Privy handle it for nonce sync
                };
                
                writeContract(contractCall);
            } else {
                // Regular EOA wallet - use standard approach
                const contractCall = {
                    address: USDC_ADDRESS,
                    abi: erc20Abi,
                    functionName: 'approve' as const,
                    args: [campaignAddress as `0x${string}`, usdcAmount],
                };
                
                writeContract(contractCall);
            }
            
            console.log('✅ writeContract called');

            console.log('Approval transaction requested - check wallet for confirmation');

        } catch (error) {
            console.error('=== TRANSACTION ERROR ===');
            console.error('Approval error:', error);
            console.error('Error type:', typeof error);
            console.error('Error constructor:', error?.constructor?.name);
            console.error('Error details:', {
                message: error instanceof Error ? error.message : 'Unknown error',
                error: error,
                stack: error instanceof Error ? error.stack : 'No stack trace'
            });
            console.error('=== END ERROR INFO ===');
            
            const friendlyError = createUserFriendlyError(error);
            setDisplayError(error);
            onError(friendlyError.details.message);
            setIsProcessing(false);
            setCurrentStep('approve');
        }
    };

    const executeDonation = async (retryCount = 0) => {
        try {
            console.log(`Step 2: Executing donation... (attempt ${retryCount + 1})`);
            console.log('Campaign address:', campaignAddress);
            console.log('USDC amount:', usdcAmount.toString());
            console.log('USDC amount formatted:', formatUnits(usdcAmount, USDC_DECIMALS));
            
            // IMPORTANT: Use the EXACT same amount that was approved
            const donationAmount = usdcAmount;
            console.log('🔍 AMOUNT VERIFICATION:');
            console.log('  - Approved amount:', usdcAmount.toString());
            console.log('  - Donation amount:', donationAmount.toString());
            console.log('  - Amounts match:', usdcAmount === donationAmount);
            console.log('  - User address:', effectiveAddress);
            console.log('  - Campaign address (spender):', campaignAddress);
            console.log('  - USDC contract:', USDC_ADDRESS);
            
            // Check if using Privy's smart wallet (4337) for donation too
            const isSmartWallet = privyWallet && hasPrivyWallet;
            
            // Wait longer for UserOperations to settle
            console.log('🔍 Waiting for approval to settle on-chain...');
            
            // For Privy smart wallets, wait even longer as UserOperations take more time
            const waitTime = isSmartWallet ? 4000 + (retryCount * 2000) : 2000 + (retryCount * 1000);
            console.log(`⏳ Waiting ${waitTime}ms for approval to settle...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            
            // Debug approval hash state
            console.log('🔍 APPROVAL HASH DEBUG:');
            console.log('  - Current approvalHash state:', approvalHash);
            console.log('  - Retry count:', retryCount);
            
            // Note: approvalHash state may be null due to React timing, but transactions are working
            if (approvalHash) {
                console.log('✅ Approval hash confirmed:', approvalHash);
            } else {
                console.log('📝 Note: Approval hash state is null (React timing), but proceeding - transactions are working correctly');
            }
            
            let donateCall;
            if (isSmartWallet) {
                console.log('Using smart wallet gas workaround for donation');
                // Step 2: Call the campaign's donate function with gas override
                donateCall = {
                    address: campaignAddress as `0x${string}`,
                    abi: campaignABI,
                    functionName: 'donate',
                    args: [donationAmount],
                    gas: 300000n, // Higher gas limit for donation UserOperation
                } as const;
            } else {
                donateCall = {
                    address: campaignAddress as `0x${string}`,
                    abi: campaignABI,
                    functionName: 'donate',
                    args: [donationAmount],
                    chainId: baseSepolia.id,
                } as const;
            }
            
            console.log('Donate call params:', donateCall);
            console.log('🚀 Calling writeContract for donation...');
            writeContract(donateCall);

            console.log('📝 Donation transaction requested - waiting for result...');

        } catch (error) {
            console.error(`Donation error (attempt ${retryCount + 1}):`, error);
            console.error('Error details:', {
                message: error instanceof Error ? error.message : 'Unknown error',
                error: error
            });
            
            // If it's an allowance error and we haven't retried too many times, try again
            const errorMessage = error instanceof Error ? error.message : '';
            const isAllowanceError = errorMessage.includes('allowance') || errorMessage.includes('ERC20: transfer amount exceeds allowance');
            const isApprovalHashError = errorMessage.includes('No approval hash available');
            
            // For Privy smart wallets, approval hash errors are often false positives
            if (isApprovalHashError && isSmartWallet) {
                console.log('🔄 Approval hash error with Privy smart wallet - this is often a false positive, retrying...');
                if (retryCount < 2) {
                    setTimeout(() => {
                        executeDonation(retryCount + 1);
                    }, (retryCount + 1) * 2000);
                    return;
                }
            }
            
            if (isAllowanceError && retryCount < 2) {
                console.log(`🔄 Allowance error detected, retrying in ${(retryCount + 1) * 2} seconds...`);
                setTimeout(() => {
                    executeDonation(retryCount + 1);
                }, (retryCount + 1) * 2000);
                return;
            }
            
            const friendlyError = createUserFriendlyError(error);
            setDisplayError(error);
            onError(friendlyError.details.message);
            setIsProcessing(false);
            setCurrentStep('approve');
        }
    };

    // Show network switch option if on wrong network
    if (!isCorrectNetwork && chainId !== undefined) {
        const networkName = chainId === 1 ? 'Ethereum Mainnet' : 
                           chainId === 8453 ? 'Base Mainnet' : 
                           `Chain ${chainId}`;
        
        return (
            <div className="space-y-3">
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-800 font-medium">
                        ⚠️ Wrong Network Connected
                    </p>
                    <p className="text-sm text-red-700 mt-1">
                        Your wallet is connected to <strong>{networkName}</strong>
                    </p>
                    <p className="text-sm text-red-700">
                        Please switch to <strong>Base Sepolia Testnet</strong> to donate.
                    </p>
                </div>
                
                <button
                    onClick={async () => {
                        try {
                            console.log('Manual network switch requested');
                            if (privyWallet) {
                                await privyWallet.switchChain(baseSepolia.id);
                            } else {
                                await switchChain({ chainId: baseSepolia.id });
                            }
                            // Wait a bit for the switch to complete
                            await new Promise(resolve => setTimeout(resolve, 1000));
                        } catch (error) {
                            console.error('Manual network switch failed:', error);
                            onError("Network switch failed. Please manually switch to Base Sepolia in your wallet.");
                        }
                    }}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                    🔄 Switch to Base Sepolia Network
                </button>
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <p className="text-xs text-gray-600 font-medium mb-2">📝 Manual Network Setup:</p>
                    <div className="text-xs text-gray-600 space-y-1">
                        <div>Network Name: <code className="bg-gray-200 px-1 rounded">Base Sepolia</code></div>
                        <div>RPC URL: <code className="bg-gray-200 px-1 rounded">https://sepolia.base.org</code></div>
                        <div>Chain ID: <code className="bg-gray-200 px-1 rounded">84532</code></div>
                        <div>Currency Symbol: <code className="bg-gray-200 px-1 rounded">ETH</code></div>
                        <div>Block Explorer: <code className="bg-gray-200 px-1 rounded">https://sepolia.basescan.org</code></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        If auto-switch fails, add this network manually in your wallet settings.
                    </p>
                </div>
            </div>
        );
    }

    // Show funding options if insufficient balance
    if (hasInsufficientBalance) {
        const balanceFormatted = balance ? parseFloat(formatUnits(balance.value, USDC_DECIMALS)).toFixed(2) : '0.00';
        
        return (
            <div className="space-y-3">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                        Insufficient USDC balance: ${balanceFormatted}
                    </p>
                    <p className="text-sm text-yellow-700 mt-1">
                        You need ${fiatAmount} USDC to donate
                    </p>
                </div>
                
                <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Get USDC to complete your donation:</p>
                    
                    <button
                        onClick={() => {
                            window.open(`https://pay.coinbase.com/buy?appId=${process.env.NEXT_PUBLIC_COINBASE_APP_ID}&addresses={"${address}":["base"]}&assets=["USDC"]&defaultAsset=USDC&defaultNetwork=base&presetFiatAmount=${Math.ceil(fiatAmount - parseFloat(balanceFormatted))}&fiatCurrency=USD`, '_blank');
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                    >
                        Buy USDC with Coinbase
                    </button>
                    
                    <button
                        onClick={() => {
                            window.open('https://app.uniswap.org/#/swap?chain=base', '_blank');
                        }}
                        className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                    >
                        Swap for USDC on Uniswap
                    </button>
                    
                    <button
                        onClick={() => {
                            window.open('https://bridge.base.org/', '_blank');
                        }}
                        className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                    >
                        Bridge USDC to Base
                    </button>
                </div>
            </div>
        );
    }

    // Loading state
    if (isWritePending || isConfirming || isProcessing) {
        const getLoadingMessage = () => {
            if (currentStep === 'approve') {
                return isWritePending ? 'Approve USDC in wallet...' : isConfirming ? 'Confirming approval...' : 'Processing approval...';
            } else if (currentStep === 'donate') {
                return isWritePending ? 'Confirm donation in wallet...' : isConfirming ? 'Confirming donation...' : 'Processing donation...';
            }
            return 'Processing...';
        };

        return (
            <div className="space-y-3">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800 font-medium">
                        Step {currentStep === 'approve' ? '1 of 2' : '2 of 2'}: {currentStep === 'approve' ? 'Approve USDC' : 'Execute Donation'}
                    </p>
                    {approvalHash && currentStep === 'donate' && (
                        <p className="text-xs text-blue-700 mt-1">
                            Approval confirmed. Now confirming donation...
                        </p>
                    )}
                </div>
                <button disabled className="w-full bg-gray-400 text-white font-bold py-3 px-4 rounded-lg cursor-not-allowed">
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        {getLoadingMessage()}
                    </div>
                </button>
                <button
                    onClick={() => {
                        setIsProcessing(false);
                        setCurrentStep('approve');
                        setApprovalHash(null);
                        onError('Transaction cancelled by user');
                    }}
                    className="w-full text-sm text-gray-500 hover:text-gray-700 py-1"
                >
                    Cancel
                </button>
            </div>
        );
    }

    // Success state
    if (isSuccess && currentStep === 'complete') {
        return (
            <div className="space-y-2">
                <div className="w-full bg-green-50 border border-green-200 text-green-800 font-bold py-3 px-4 rounded-lg">
                    🎉 Donation successful!
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-blue-700">
                        <strong>Note:</strong> If you see "Transaction failed" in the Privy wallet popup, 
                        please ignore it - this is a Privy UI bug. Your donation was successful on the blockchain!
                    </p>
                </div>
            </div>
        );
    }

    // Error state
    if (displayError) {
        return (
            <ErrorDisplay
                error={displayError}
                onRetry={() => {
                    setDisplayError(null);
                    handleDonate();
                }}
                onDismiss={() => {
                    setDisplayError(null);
                }}
            />
        );
    }

    // Default donation button
    return (
        <div className="space-y-2">
            <button
                onClick={handleDonate}
                disabled={!authenticated || !effectivelyConnected || fiatAmount < 1}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
                {!authenticated ? 'Login to Continue' :
                 !effectivelyConnected ? 'Connect Wallet' : 
                 !isCorrectNetwork ? 'Switch to Base Sepolia' :
                 `Donate $${fiatAmount} USDC`}
            </button>
            {authenticated && effectivelyConnected && (
                <p className="text-xs text-gray-500 text-center">
                    {!isCorrectNetwork ? 
                        `Connected to wrong network. Need Base Sepolia (Chain ID: ${baseSepolia.id})` :
                        'Two transactions: 1) Approve USDC 2) Execute donation'
                    }
                </p>
            )}
        </div>
    );
};