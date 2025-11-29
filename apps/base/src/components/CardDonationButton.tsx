"use client";

import { generateOnRampURL } from '@coinbase/cbpay-js';
import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";

const COINBASE_APP_ID = process.env.NEXT_PUBLIC_COINBASE_APP_ID;

type CardDonationButtonProps = {
  campaignAddress: `0x${string}`;
  fiatAmount: number;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
  disabled: boolean;
};

export const CardDonationButton: React.FC<CardDonationButtonProps> = ({
  campaignAddress,
  fiatAmount,
  onSuccess,
  onError,
  disabled,
}) => {
  const { user, login } = usePrivy();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCardPayment = async () => {
    if (!COINBASE_APP_ID) {
      onError("Card payments are temporarily unavailable. Please try Coinbase or wallet payment instead.");
      console.error("NEXT_PUBLIC_COINBASE_APP_ID is not set.");
      return;
    }

    // If user is not logged in, prompt them to login first
    if (!user) {
      login();
      return;
    }

    setIsProcessing(true);
    try {
      // Generate Coinbase OnRamp URL with card payment method
      const onrampUrl = generateOnRampURL({
        appId: COINBASE_APP_ID,
        addresses: {
          [campaignAddress]: ['base-sepolia']
        },
        assets: ['USDC'],
        defaultAsset: 'USDC',
        defaultNetwork: 'base-sepolia',
        presetFiatAmount: fiatAmount,
        fiatCurrency: 'USD',
        defaultExperience: 'buy',
        defaultPaymentMethod: 'CARD', // This forces card payment
        redirectUrl: `${window.location.origin}${window.location.pathname}?success=true`
      });

      // Redirect to Coinbase OnRamp
      window.location.href = onrampUrl;
      
      // Note: Success will be handled when user returns to the redirect URL
      onSuccess(`Redirecting to secure payment...`);
    } catch (e: any) {
      console.error("Card payment setup failed", e);
      onError(e.message || "Unable to set up card payment. Please try another payment method or refresh the page.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <button
      onClick={handleCardPayment}
      disabled={disabled || isProcessing}
      className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
    >
      {isProcessing ? "Processing..." : `Donate $${fiatAmount} with Card`}
    </button>
  );
}; 