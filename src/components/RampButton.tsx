"use client";

import { RampInstantSDK, RampInstantEvent } from '@ramp-network/ramp-instant-sdk';
import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";

// TODO: Replace with your own Ramp API Key
const RAMP_API_KEY = process.env.NEXT_PUBLIC_RAMP_API_KEY || 'YOUR_API_KEY';

// A simple wrapper for the Ramp SDK instance
type RampInstance = {
  show: () => void;
  // The Ramp SDK doesn't have a formal 'destroy' method in the same way,
  // as a new instance is created for each use. We can add a no-op here
  // for consistent cleanup logic in our useEffect hook.
  destroy: () => void; 
};

export const RampButton: React.FC<{
  fiatAmount?: number;
  onSuccess?: () => void;
  onExit?: () => void;
}> = ({ fiatAmount, onSuccess, onExit }) => {
  const { user } = usePrivy();
  const [error, setError] = useState<string | null>(null);
  const [isRampReady, setIsRampReady] = useState(false);

  // We don't store the ramp instance in state because it's meant to be
  // created fresh each time the button is clicked. We just need to know
  // if the environment is ready for it.
  useEffect(() => {
    // Basic readiness check. In a real app, you might check for browser compatibility etc.
    if (user?.wallet?.address) {
      setIsRampReady(true);
    } else {
      setIsRampReady(false);
    }
  }, [user?.wallet?.address]);

  const handleClick = () => {
    if (!isRampReady || !user?.wallet?.address) {
      if (!user?.wallet?.address) {
          setError('Wallet is not ready yet. Please wait a moment.');
      } else {
          setError('Ramp is not ready. Please try again.');
      }
      return;
    }

    if (RAMP_API_KEY === 'YOUR_API_KEY') {
        setError('Ramp is not configured. Please add your API Key.');
        return;
    }

    const rampInstance = new RampInstantSDK({
      hostAppName: 'Fundraise',
      hostLogoUrl: 'https://yourdapp.com/yourlogo.png', // TODO: Replace with your logo URL
      hostApiKey: RAMP_API_KEY,
      userAddress: user.wallet.address,
      swapAsset: 'BASE_USDC', // Specify USDC on Base network
      fiatValue: fiatAmount?.toString(), // The amount in fiat currency
      // More configuration options can be added here based on Ramp's docs.
    })
      .on('*', (event: RampInstantEvent) => {
        console.log('Ramp Event:', event);
        if (event.type === 'WIDGET_CLOSE') {
          onExit?.();
        }
        if (event.type === 'PURCHASE_CREATED') {
          // This is a good point to consider the "success" event
          onSuccess?.();
        }
      })
      .show();
  };
  
  if (error) {
    return <div className="text-red-500 text-sm py-3 px-4 text-center">{error}</div>;
  }

  return (
    <button 
      onClick={handleClick} 
      disabled={!isRampReady}
      // Ramp's branding guidelines might suggest a different color
      className="w-full bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-cyan-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
    >
      Buy with Ramp
    </button>
  );
}; 