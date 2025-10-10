"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";

// The official Robinhood Connect SDK is expected to be loaded via a script tag,
// similar to other payment providers. This global declaration simulates the
// presence of the SDK's entry point on the `window` object.
declare global {
  interface Window {
    RobinhoodConnect: {
      init: (options: RobinhoodConnectOptions) => Promise<RobinhoodConnectInstance>;
    };
  }
}

// These types are placeholders based on common on-ramp SDK patterns.
// The actual types should be verified with the official documentation.
interface RobinhoodConnectOptions {
  clientId: string;
  onSuccess: (result: any) => void;
  onExit: () => void;
  // Other options like wallet address, default amount, etc. would go here.
}

interface RobinhoodConnectInstance {
  open: (options?: { fiatAmount?: number }) => void;
  destroy: () => void;
}

// TODO: Replace with your own Robinhood Connect Client ID from their developer portal.
const ROBINHOOD_CLIENT_ID = process.env.NEXT_PUBLIC_ROBINHOOD_CLIENT_ID || 'YOUR_CLIENT_ID';

// TODO: The official script URL must be obtained from Robinhood's developer documentation.
const ROBINHOOD_SDK_URL = "https://connect.robinhood.com/v1/connect.js";

export const RobinhoodConnectButton: React.FC<{
  fiatAmount?: number;
  onSuccess?: () => void;
}> = ({ fiatAmount, onSuccess }) => {
  const { user } = usePrivy();
  const [connectInstance, setConnectInstance] = useState<RobinhoodConnectInstance | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSdkReady, setIsSdkReady] = useState(false);

  useEffect(() => {
    if (window.RobinhoodConnect) {
      setIsSdkReady(true);
      return;
    }

    const script = document.createElement("script");
    script.src = ROBINHOOD_SDK_URL;
    script.async = true;
    script.onload = () => {
      console.log("Robinhood Connect SDK loaded.");
      setIsSdkReady(true);
    };
    script.onerror = () => {
      console.error("Failed to load Robinhood Connect SDK.");
      setError("Could not load Robinhood services. Please try again later.");
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!isSdkReady || !user?.wallet?.address) {
      if (connectInstance) {
        connectInstance.destroy();
        setConnectInstance(null);
      }
      return;
    }

    console.log(`Initializing Robinhood Connect for address: ${user.wallet.address}`);

    // This is a presumed initialization flow based on industry standards.
    // The actual implementation details must be confirmed with official documentation.
    window.RobinhoodConnect.init({
      clientId: ROBINHOOD_CLIENT_ID,
      onSuccess: (result) => {
        console.log("Robinhood Connect: Success", result);
        onSuccess?.();
      },
      onExit: () => {
        console.log("Robinhood Connect: Exit");
      },
    })
    .then(setConnectInstance)
    .catch(err => {
        console.error("Failed to initialize Robinhood Connect:", err);
        setError("Failed to initialize Robinhood Connect.");
    });

    return () => {
      connectInstance?.destroy();
    };
  }, [isSdkReady, user?.wallet?.address, onSuccess]);

  const handleClick = () => {
    if (connectInstance) {
      connectInstance.open({ fiatAmount });
    } else if (ROBINHOOD_CLIENT_ID === 'YOUR_CLIENT_ID') {
        setError('Robinhood Connect is not configured. Please add your Client ID.');
    } else if (!user?.wallet?.address) {
        setError('Wallet is not ready yet. Please wait a moment.');
    } else {
        setError('Robinhood Connect is not ready. Please wait a moment and try again.');
    }
  };

  if (error) {
    return <div className="text-red-500 text-sm py-3 px-4 text-center">{error}</div>;
  }
  
  return (
    <button
      onClick={handleClick}
      disabled={!connectInstance}
      className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
    >
      Buy with Robinhood
    </button>
  );
}; 