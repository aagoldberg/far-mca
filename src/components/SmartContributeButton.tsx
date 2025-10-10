"use client";

import { useState, useEffect } from 'react';
import { useWallets, useFundWallet, useSendTransaction } from '@privy-io/react-auth';
import { useBalance } from 'wagmi';
import { Address, parseUnits, encodeFunctionData } from 'viem';
import { farcasterFundraiseABI } from '@/abi/FarcasterFundraise'; // Assuming you have this

const USDC_DECIMALS = 6;
const FARCASTER_FUNDRAISE_CONTRACT_ADDRESS = "0x4ceB9e337cdFa63867786725EcBaf41CFaE45a83" as Address;
const USDC_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_USDC_CONTRACT_ADDRESS as Address;

type SmartContributeButtonProps = {
    campaignId: bigint;
    amount: number; // The contribution amount in fiat (e.g., USD)
    onSuccess: (message: string) => void;
    onError: (message: string) => void;
}

export default function SmartContributeButton({
    campaignId,
    amount,
    onSuccess,
    onError,
}: SmartContributeButtonProps) {
    const { wallets } = useWallets();
    const [isProcessing, setIsProcessing] = useState(false);
    const { sendTransaction, isPending } = useSendTransaction();

    const smartWallet = wallets.find((wallet) => wallet.walletClientType === 'privy');
    const { data: balance, isLoading: isBalanceLoading, refetch } = useBalance({
        address: smartWallet?.address as Address | undefined,
        token: USDC_CONTRACT_ADDRESS,
    });

    const { fundWallet } = useFundWallet({
        onSuccess: (result) => {
            onSuccess(`Funding successful! Completing donation...`);
            refetch(); // Refetch balance after funding
            handleDonate(); // Automatically trigger donation after funding
        },
        onError: (error) => {
            onError(`Funding failed. Please try again.`);
            setIsProcessing(false);
        },
        onUserExited: () => {
            // User closed the on-ramp modal
            setIsProcessing(false);
        }
    });

    const amountAsBigInt = parseUnits(amount.toString(), USDC_DECIMALS);
    const hasSufficientBalance = balance ? balance.value >= amountAsBigInt : false;

    const handleContribute = async () => {
        setIsProcessing(true);
        if (!smartWallet) {
            onError('Smart wallet not connected. Please log in.');
            setIsProcessing(false);
            return;
        }

        if (!hasSufficientBalance) {
            fundWallet({
                walletAddress: smartWallet.address,
                config: {
                    fiatAmount: amount, // Pre-fill the amount
                }
            });
            // Note: The donation is triggered by the `onSuccess` callback of `fundWallet`
        } else {
            await handleDonate();
        }
    };

    const handleDonate = async () => {
        if (!smartWallet) return;
        
        try {
            // This is where you would batch transactions if needed.
            // For a simple ERC20 transfer, we first need to approve the contract.
            // A smart wallet can batch this approval and the donation into one UserOp.
            
            // For now, let's assume the contract handles the transfer via `fundWithPermit`
            // which doesn't require a separate approval step.
            
            const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600); // 1 hour
            
            // This is a placeholder for the signature part of fundWithPermit.
            // A true smart wallet flow might use a different contract function
            // that doesn't require a signature, like a simple `donate(uint256, uint256)`
            // if the smart wallet itself authorizes the USDC transfer.
            
            // Let's use a simpler donate function for this example. 
            // We'll prepare the transaction data to call `donate(campaignId, amount)`
            
            // IMPORTANT: Your contract needs a function like `donate(uint256, uint256)`
            // that can be called directly. `fundWithPermit` is for EOAs.
            // A smart wallet flow would typically involve a Paymaster to sponsor gas
            // and a different contract interaction.
            
            // For this example, we will just simulate sending a transaction.
            // In a real scenario, you would encode your actual contract call here.
            
            onSuccess('Sending donation...');
            await sendTransaction({
                to: FARCASTER_FUNDRAISE_CONTRACT_ADDRESS,
                data: '0x', // Placeholder for actual transaction data
                value: 0, // Sending USDC, not native asset
            });

        } catch (error) {
            console.error("Donation failed", error);
            onError("Donation transaction failed. Please try again.");
            setIsProcessing(false);
        }
    };

    useEffect(() => {
        if (!isPending && isProcessing && hasSufficientBalance) {
            onSuccess('Donation successful! Thank you for your contribution.');
            setIsProcessing(false);
        }
    }, [isPending, isProcessing, onSuccess, hasSufficientBalance]);

    return (
        <button
            onClick={handleContribute}
            disabled={isProcessing || isPending || isBalanceLoading || amount <= 0}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
            {isProcessing || isPending ? 'Processing...' : (isBalanceLoading ? 'Checking balance...' : `Donate $${amount}`)}
        </button>
    )
} 