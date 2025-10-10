"use client";

import { useState, useEffect } from 'react';
import { useAccount, useSignTypedData, useWriteContract } from 'wagmi';
import { initOnRamp } from '@coinbase/cbpay-js';
import { parseUnits, slice } from 'viem';
import { campaignABI } from '../abi/Campaign'; // Assuming ABI is stored here

// Custom hook to manage the onramp instance
const useCoinbaseOnramp = () => {
    // Using `any` as a temporary workaround for persistent type inference issues.
    // TODO: Revisit and add a more specific type for the onramp instance.
    const [onrampInstance, setOnrampInstance] = useState<any | null>(null);

    useEffect(() => {
        if (onrampInstance) return; // Prevent re-initialization

        initOnRamp({
            appId: process.env.NEXT_PUBLIC_COINBASE_APP_ID || 'default-app-id',
            widgetParameters: {
                destinationWallets: [{
                    address: "0x",
                    blockchains: ["base"],
                    assets: ["USDC"],
                }],
            },
            onSuccess: () => console.log('Onramp successful'),
            onExit: () => console.log('Onramp exited'),
            onEvent: (event) => console.log('Onramp event:', event),
        }, (instance, error) => {
            if (error) {
                console.error("Failed to initialize Coinbase Onramp:", error);
                return;
            }
            setOnrampInstance(instance);
        });

        return () => {
            onrampInstance?.destroy();
        };
    }, [onrampInstance]);

    return onrampInstance;
};

const useDonation = (campaignAddress: string, usdcAddress: string) => {
    const { address } = useAccount();
    const { writeContractAsync } = useWriteContract();
    const { signTypedDataAsync } = useSignTypedData();

    const [isPending, setIsPending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const donateWithPermit = async (amount: string) => {
        setIsPending(true);
        setError(null);
        try {
            const numericAmount = parseUnits(amount, 6); // USDC has 6 decimals
            const permitDeadline = BigInt(Math.floor(Date.now() / 1000) + 3600); // 1 hour from now

            // 1. Sign the permit message
            const signature = await signTypedDataAsync({
                domain: {
                    name: 'USDC', // This needs to match the name in the USDC contract
                    version: '1', // Check the USDC contract for the correct version
                    chainId: 84532, // Base Sepolia
                    verifyingContract: usdcAddress as `0x${string}`,
                },
                types: {
                    Permit: [
                        { name: 'owner', type: 'address' },
                        { name: 'spender', type: 'address' },
                        { name: 'value', type: 'uint256' },
                        { name: 'nonce', type: 'uint256' }, // Nonce needs to be fetched from the USDC contract
                        { name: 'deadline', type: 'uint256' },
                    ],
                },
                primaryType: 'Permit',
                message: {
                    owner: address!,
                    spender: campaignAddress as `0x${string}`,
                    value: numericAmount,
                    nonce: 0n, // Placeholder: THIS MUST BE REPLACED with the user's actual USDC nonce
                    deadline: permitDeadline,
                },
            });

            const r = slice(signature, 0, 32);
            const s = slice(signature, 32, 64);
            const v = parseInt(slice(signature, 64, 65).substring(2), 16);


            // 2. Call the donateWithPermit function on the campaign contract
            await writeContractAsync({
                address: campaignAddress as `0x${string}`,
                abi: campaignABI,
                functionName: 'donateWithPermit',
                args: [
                    address!,
                    numericAmount,
                    permitDeadline,
                    v,
                    r,
                    s,
                ],
            });

            setIsSuccess(true);
        } catch (e) {
            setError(e as Error);
            console.error(e);
        } finally {
            setIsPending(false);
        }
    };

    return { donateWithPermit, isPending, isSuccess, error };
};

type DonationFormProps = {
    campaignAddress: string;
    usdcAddress: string;
};

export function DonationForm({ campaignAddress, usdcAddress }: DonationFormProps) {
    const { isConnected } = useAccount();
    const [amount, setAmount] = useState("10");
    const onramp = useCoinbaseOnramp();
    const { donateWithPermit, isPending, isSuccess, error } = useDonation(campaignAddress, usdcAddress);

    const handleDonate = async (e: React.FormEvent) => {
        e.preventDefault();
        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            alert("Please enter a valid amount.");
            return;
        }
        
        if (isConnected) {
            await donateWithPermit(amount);
        } else {
            if (!onramp) {
                alert("Coinbase Onramp is not ready. Please try again in a moment.");
                return;
            }
            onramp.open({
                destinationWallets: [{
                    address: campaignAddress,
                    blockchains: ["base"],
                    assets: ["USDC"],
                }],
            });
        }
    };

    return (
        <form onSubmit={handleDonate} className="p-6 border rounded-lg bg-white shadow-md max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Make a Donation</h2>
            
            <div className="mb-4">
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                    Amount (USDC)
                </label>
                <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-900 focus:border-gray-900"
                    placeholder="10.00"
                    disabled={isPending}
                />
            </div>

            <button
                type="submit"
                disabled={isPending || (!isConnected && !onramp)}
                className="w-full bg-gray-900 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
            >
                {isPending ? "Processing..." : (isConnected ? "Donate (1-Click)" : "Donate with Card / Coinbase")}
            </button>

            {isSuccess && (
                <p className="mt-4 text-center text-green-600">
                    Thank you for your generous donation!
                </p>
            )}
            {error && (
                 <p className="mt-4 text-center text-red-600">
                    Error: {error.message}
                </p>
            )}
             {!isConnected && (
                <p className="mt-4 text-xs text-center text-gray-500">
                    You'll be guided through the Coinbase Onramp process. No account needed.
                </p>
            )}
        </form>
    );
} 