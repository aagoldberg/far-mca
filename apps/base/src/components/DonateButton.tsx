"use client";

import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useState } from "react";
import { encodeFunctionData, parseUnits } from "viem";
import { campaignABI } from "@/abi/Campaign";
import { erc20Abi } from "viem";

const USDC_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_USDC_CONTRACT_ADDRESS as `0x${string}`;

type DonateButtonProps = {
  campaignAddress: `0x${string}`;
  fiatAmount: number;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
  disabled: boolean;
};

export const DonateButton: React.FC<DonateButtonProps> = ({
  campaignAddress,
  fiatAmount,
  onSuccess,
  onError,
  disabled,
}) => {
  const { pay } = usePrivy();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDonate = async () => {
    setIsProcessing(true);
    try {
      if (typeof pay !== 'function') {
        console.error("Privy 'pay' function not available. Check provider config and dashboard settings.");
        throw new Error("Payments are currently unavailable.");
      }
      
      const amountToDonate = parseUnits(fiatAmount.toString(), 6);

      const a = await pay({
        currency: "USDC", // The currency the user will pay with
        amount: fiatAmount,
        execute: [
          {
            target: USDC_CONTRACT_ADDRESS,
            value: 0,
            data: encodeFunctionData({
              abi: erc20Abi,
              functionName: "approve",
              args: [campaignAddress, amountToDonate],
            }),
            chainId: 84532,
          },
          {
            target: campaignAddress,
            value: 0,
            data: encodeFunctionData({
              abi: campaignABI,
              functionName: "donate",
              args: [amountToDonate],
            }),
            chainId: 84532,
          },
        ],
      });
      console.log('a', a)
      onSuccess(`Donation processed successfully!`);
    } catch (e: any) {
      console.error("Payment failed", e);
      onError(e.message || "An unexpected error occurred during payment.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <button
      onClick={handleDonate}
      disabled={disabled || isProcessing}
      className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
    >
      {isProcessing ? "Processing..." : `Donate ${fiatAmount} USD`}
    </button>
  );
}; 