"use client";

import { generateOnRampURL } from '@coinbase/cbpay-js';
import { useState, useEffect, useRef } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter, useSearchParams } from 'next/navigation';
import { CreditCardIcon } from '@heroicons/react/24/outline';

const COINBASE_APP_ID = process.env.NEXT_PUBLIC_COINBASE_APP_ID;

type CardDonationButtonEnhancedProps = {
  campaignAddress: `0x${string}`;
  campaignName?: string;
  fiatAmount: number;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
  disabled: boolean;
};

export const CardDonationButtonEnhanced: React.FC<CardDonationButtonEnhancedProps> = ({
  campaignAddress,
  campaignName = 'this campaign',
  fiatAmount,
  onSuccess,
  onError,
  disabled,
}) => {
  const { user, login } = usePrivy();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isWaitingForReturn, setIsWaitingForReturn] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const popupRef = useRef<Window | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Detect mobile device
  const isMobile = typeof window !== 'undefined' && 
    /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent);

  // Check for return from Coinbase OnRamp
  useEffect(() => {
    const success = searchParams.get('success');
    const txHash = searchParams.get('txHash');
    
    if (success === 'true') {
      // Clear the URL parameters
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
      
      // Check if we were waiting for this return
      const pendingDonation = localStorage.getItem('pendingDonation');
      if (pendingDonation) {
        const { campaign, amount, timestamp } = JSON.parse(pendingDonation);
        
        // Verify it's recent (within last hour)
        if (Date.now() - timestamp < 3600000) {
          onSuccess(`Successfully donated $${amount} to ${campaignName}!`);
          localStorage.removeItem('pendingDonation');
          setIsWaitingForReturn(false);
        }
      }
      
      if (txHash) {
        onSuccess(`Donation completed! Transaction: ${txHash}`);
      }
    }
  }, [searchParams, onSuccess, campaignName]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
      if (popupRef.current && !popupRef.current.closed) {
        popupRef.current.close();
      }
    };
  }, []);

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
      // Save donation intent before redirect
      const donationIntent = {
        campaign: campaignAddress,
        campaignName,
        amount: fiatAmount,
        timestamp: Date.now(),
        userId: user.id
      };
      localStorage.setItem('pendingDonation', JSON.stringify(donationIntent));

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
        defaultPaymentMethod: 'CARD',
        redirectUrl: `${window.location.origin}${window.location.pathname}?success=true`
      });

      // Desktop: Try popup first
      if (!isMobile) {
        try {
          // Open in popup window
          const width = 480;
          const height = 720;
          const left = (window.screen.width - width) / 2;
          const top = (window.screen.height - height) / 2;
          
          popupRef.current = window.open(
            onrampUrl,
            'coinbase-onramp',
            `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
          );

          if (popupRef.current) {
            setIsWaitingForReturn(true);
            
            // Poll for popup closure
            pollIntervalRef.current = setInterval(() => {
              if (popupRef.current?.closed) {
                clearInterval(pollIntervalRef.current!);
                pollIntervalRef.current = null;
                handlePopupClosed();
              }
            }, 1000);

            onSuccess(`Payment window opened. Complete your donation in the popup.`);
            return;
          }
        } catch (e) {
          console.log('Popup blocked, falling back to redirect');
        }
      }

      // Mobile or popup blocked: Use redirect
      setIsWaitingForReturn(true);
      
      // Show instructions for mobile users
      if (isMobile) {
        onSuccess(`Redirecting to secure payment. You'll return here after payment.`);
      }
      
      // Redirect to Coinbase OnRamp
      window.location.href = onrampUrl;
      
    } catch (e: any) {
      console.error("Card payment setup failed", e);
      onError(e.message || "Unable to set up card payment. Please try another payment method or refresh the page.");
      setIsProcessing(false);
      setIsWaitingForReturn(false);
    }
  };

  const handlePopupClosed = async () => {
    setIsProcessing(false);
    setIsWaitingForReturn(false);
    
    // Check if donation was completed
    const pendingDonation = localStorage.getItem('pendingDonation');
    if (pendingDonation) {
      // In a real app, you'd check the blockchain here
      // For now, we'll just notify the user to check
      onSuccess('Payment window closed. If you completed the payment, it will appear shortly.');
    }
  };

  const cancelWaiting = () => {
    setIsWaitingForReturn(false);
    setIsProcessing(false);
    localStorage.removeItem('pendingDonation');
    
    if (popupRef.current && !popupRef.current.closed) {
      popupRef.current.close();
    }
    
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  };

  // Show waiting state
  if (isWaitingForReturn) {
    return (
      <div className="w-full space-y-3">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-800">
                Waiting for payment completion...
              </p>
              <p className="text-xs text-blue-600 mt-1">
                {isMobile 
                  ? "Complete your payment and you'll return here automatically."
                  : "Complete your payment in the popup window."}
              </p>
            </div>
          </div>
        </div>
        
        <button
          onClick={cancelWaiting}
          className="w-full text-sm text-gray-500 hover:text-gray-700 py-2"
        >
          Cancel and try another method
        </button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-2">
      <button
        onClick={handleCardPayment}
        disabled={disabled || isProcessing}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-4 rounded-lg disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <div className="flex items-center justify-center">
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing...
            </>
          ) : (
            <>
              <CreditCardIcon className="w-5 h-5 mr-2" />
              Donate ${fiatAmount} with Card
              {isMobile && (
                <span className="ml-2 text-xs opacity-90">→</span>
              )}
            </>
          )}
        </div>
      </button>
      
      {!isProcessing && (
        <div className="text-center">
          <p className="text-xs text-gray-500">
            {isMobile 
              ? "You'll be redirected to complete payment"
              : "Opens in a secure payment window"}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Powered by Coinbase • No crypto knowledge needed
          </p>
        </div>
      )}
    </div>
  );
};