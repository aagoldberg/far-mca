"use client";

import { useState, useEffect, useCallback } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { parseUnits, encodeFunctionData, createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";
import { campaignABI } from "@/abi/Campaign";
import { erc20Abi } from "viem";
import { createSmartAccountClient } from "permissionless";
import { createPimlicoClient } from "permissionless/clients/pimlico";
import { toLightSmartAccount } from "permissionless/accounts";
import { entryPoint07Address } from "viem/account-abstraction";

const USDC_CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_USDC_CONTRACT_ADDRESS as `0x${string}`;
const PIMLICO_API_KEY = process.env.NEXT_PUBLIC_PIMLICO_API_KEY;

type SmartDonationButtonProps = {
  fiatAmount: number;
  campaignAddress: `0x${string}`;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
};

export const SmartDonationButton: React.FC<SmartDonationButtonProps> = ({
  fiatAmount,
  campaignAddress,
  onSuccess,
  onError,
}) => {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  const [smartAccountClient, setSmartAccountClient] = useState<any | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const pimlicoClient = createPimlicoClient({
    transport: http(
      `https://api.pimlico.io/v2/base-sepolia/rpc?apikey=${PIMLICO_API_KEY}`
    ),
  });

  const setupSmartAccount = useCallback(async () => {
    if (!isConnected || !walletClient || !address || !PIMLICO_API_KEY) return;

    setStatusMessage("Initializing Smart Wallet...");

    const publicClient = createPublicClient({
      chain: baseSepolia,
      transport: http("https://sepolia.base.org"),
    });

    const owner = walletClient;

    const lightAccount = await toLightSmartAccount({
      entryPoint: {
        address: entryPoint07Address,
        version: "0.7",
      },
      client: publicClient,
      owner,
      version: "2.0.0",
    });

    const client = createSmartAccountClient({
      account: lightAccount,
      chain: baseSepolia,
      bundlerTransport: http(
        `https://api.pimlico.io/v2/base-sepolia/rpc?apikey=${PIMLICO_API_KEY}`
      ),
      paymaster: pimlicoClient,
      userOperation: {
        estimateFeesPerGas: async () => {
          return (await pimlicoClient.getUserOperationGasPrice()).fast;
        },
      },
    });

    setSmartAccountClient(client);
    setStatusMessage("");
  }, [isConnected, walletClient, address]);

  useEffect(() => {
    setupSmartAccount();
  }, [setupSmartAccount]);

  const handleSmartAccountDonate = async () => {
    if (!smartAccountClient || !smartAccountClient.account) {
      onError("Smart account not ready.");
      return;
    }

    if (!USDC_CONTRACT_ADDRESS) {
      onError(
        "USDC contract address is not configured. Please check your environment variables."
      );
      return;
    }

    if (!campaignAddress) {
      onError("Campaign address is not available.");
      return;
    }

    setIsProcessing(true);
    setStatusMessage("Preparing transaction...");

    try {
      const amountToDonate = parseUnits(fiatAmount.toString(), 6);

      setStatusMessage("Sending transaction...");

      const txHash = await smartAccountClient.sendTransaction({
        account: smartAccountClient.account,
        calls: [
          {
            to: USDC_CONTRACT_ADDRESS,
            data: encodeFunctionData({
              abi: erc20Abi,
              functionName: "approve",
              args: [campaignAddress, amountToDonate],
            }),
            value: 0n,
          },
          {
            to: campaignAddress,
            data: encodeFunctionData({
              abi: campaignABI,
              functionName: "donate",
              args: [amountToDonate],
            }),
            value: 0n,
          },
        ],
      });

      setStatusMessage("Waiting for confirmation...");
      // Here you would typically wait for the transaction receipt
      setStatusMessage("");
      onSuccess(`Donation sent successfully! TxHash: ${txHash}`);
    } catch (e: any) {
      console.error("Donation failed", e);
      onError(e.message || "An unexpected error occurred.");
    } finally {
      setIsProcessing(false);
    }
  };

  const buttonText = isProcessing
    ? statusMessage
    : `Donate ${fiatAmount} USDC (1-Click)`;

  if (!isConnected) {
    return (
      <div className="w-full mt-2 text-center text-gray-500">
        Please connect your wallet to continue.
      </div>
    );
  }

  if (!smartAccountClient) {
    return (
      <button
        disabled
        className="w-full mt-2 bg-gray-400 text-white font-bold py-3 px-4 rounded-lg cursor-not-allowed"
      >
        {statusMessage || "Initializing Smart Wallet..."}
      </button>
    );
  }

  return (
    <button
      onClick={handleSmartAccountDonate}
      disabled={isProcessing}
      className="w-full mt-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
    >
      {buttonText}
    </button>
  );
}; 