"use client";

import { useState, useEffect } from "react";
import { useSimpleSmartAccount } from "@/contexts/SimpleSmartAccountContext";
import { parseEther, encodeFunctionData, BaseError } from "viem";
import { farcasterFundraiseABI } from "@/abi/FarcasterFundraise";
import { baseSepolia } from "viem/chains";
import { initOnRamp, CBPayInstanceType } from "@coinbase/cbpay-js";

const USDC_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_USDC_CONTRACT_ADDRESS as `0x${string}`;
const FUNDRAISER_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_FARCASTER_FUNDRAISE_CONTRACT_ADDRESS as `0x${string}`;

export const CoinbaseDonate = ({ campaignId }: { campaignId: string }) => {
  const { sendSponsoredTransaction, smartAccount, publicClient } =
    useSimpleSmartAccount();
  const [amount, setAmount] = useState("1");
  const [onrampInstance, setOnrampInstance] = useState<
    CBPayInstanceType | undefined
  >();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleDonate = async () => {
    if (!smartAccount || !sendSponsoredTransaction || !publicClient) return;
    setLoading(true);
    setMessage("");


    initOnRamp(
      {
        appId: process.env.NEXT_PUBLIC_COINBASE_APP_ID!,
        target: "#cbpay-container",
        widgetParameters: {
          destinationWallets: [
            {
              address: smartAccount.address,
              blockchains: ["base-sepolia"],
              assets: ["USDC"],
            },
          ],
          presetFiatAmount: parseFloat(amount),
        },
        onSuccess: async () => {
          setMessage("Purchase successful! Now sending your donation...");
          

          try {
            const donationAmount = parseEther(amount);

            // Approve the fundraiser to spend USDC
            const approveData = encodeFunctionData({
              abi: [
                {
                  inputs: [
                    { name: "spender", type: "address" },
                    { name: "value", type: "uint256" },
                  ],
                  name: "approve",
                  outputs: [{ name: "", type: "bool" }],
                  stateMutability: "nonpayable",
                  type: "function",
                },
              ],
              functionName: "approve",
              args: [FUNDRAISER_CONTRACT_ADDRESS, donationAmount],
            });

            const approveTxHash = await sendSponsoredTransaction({
              account: smartAccount,
              to: USDC_CONTRACT_ADDRESS,
              data: approveData,
              chain: baseSepolia,
            });

            setMessage("Approval sent, waiting for confirmation...");
            await publicClient.waitForTransactionReceipt({
              hash: approveTxHash!,
            });

            // Call the fundCampaign function
            const donateData = encodeFunctionData({
              abi: farcasterFundraiseABI,
              functionName: "fundCampaign",
              args: [BigInt(campaignId), donationAmount],
            });

            const donateTxHash = await sendSponsoredTransaction({
              account: smartAccount,
              to: FUNDRAISER_CONTRACT_ADDRESS,
              data: donateData,
              chain: baseSepolia,
            });

            setMessage(`Donation sent! Thank you! Tx: ${donateTxHash}`);
          } catch (e) {
            const error = e as BaseError;
            console.error(error);
            setMessage(`Donation Error: ${error.shortMessage}`);
          } finally {
            setLoading(false);
          }
        },
        onExit: () => {
          setLoading(false);
          setMessage("Purchase cancelled.");
        },
      },
      (error: Error | null, instance) => {
        if (instance) {
          setOnrampInstance(instance);
          instance.open();
        }
      }
    );
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-bold mb-2">
One-Click Donate
      </h3>
      <div id="cbpay-container"></div>
      <div className="flex items-center gap-2 mb-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="p-2 border rounded w-full"
          placeholder="Amount in USD"
        />
        <button
          onClick={handleDonate}
          disabled={!smartAccount || loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
        >
          {loading ? "Processing..." : "Donate with Coinbase"}
        </button>
      </div>
      {message && <p className="text-sm break-all">{message}</p>}
    </div>
  );
}; 