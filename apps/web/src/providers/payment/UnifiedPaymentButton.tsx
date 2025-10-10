"use client";

import React from 'react';
import { usePaymentProvider } from './PaymentProvider';
import { PaymentButtonProps, PaymentMethod } from './types';
import { PrivyFundingButton } from './privy/PrivyFundingButton';

// Import existing Coinbase components (we'll wrap them)
import { CardDonationButton } from '@/components/CardDonationButton';
import { CoinbasePayButton } from '@/components/CoinbasePayButton';

export function UnifiedPaymentButton(props: PaymentButtonProps) {
  const { provider } = usePaymentProvider();
  
  // If provider is Privy, use the Privy funding button
  if (provider.name === 'privy') {
    return <PrivyFundingButton {...props} />;
  }
  
  // If provider is Coinbase, use the appropriate existing button
  if (provider.name === 'coinbase') {
    if (props.method === 'card') {
      return (
        <CardDonationButton
          campaignAddress={props.campaignAddress}
          fiatAmount={props.fiatAmount}
          onSuccess={props.onSuccess || (() => {})}
          onError={props.onError || (() => {})}
          disabled={props.disabled || false}
        />
      );
    }
    
    if (props.method === 'exchange') {
      return (
        <CoinbasePayButton
          campaignNumericId={props.campaignNumericId}
          fiatAmount={props.fiatAmount}
          onSuccess={props.onSuccess || (() => {})}
          onError={props.onError || (() => {})}
        />
      );
    }
  }
  
  // Fallback
  return (
    <button
      disabled
      className="w-full mt-2 bg-gray-300 text-white font-bold py-3 px-4 rounded-lg cursor-not-allowed"
    >
      Payment method not available
    </button>
  );
}