"use client";

import React, { createContext, useContext, useMemo } from 'react';
import { PaymentProviderFactory } from './factory';
import { IPaymentProvider, PaymentParams, PaymentResult } from './types';

interface PaymentContextValue {
  provider: IPaymentProvider;
  initiatePayment: (params: PaymentParams) => Promise<PaymentResult>;
  isSandboxMode: boolean;
  providerName: string;
}

const PaymentContext = createContext<PaymentContextValue | null>(null);

export function PaymentProvider({ children }: { children: React.ReactNode }) {
  const contextValue = useMemo(() => {
    const provider = PaymentProviderFactory.getProvider();
    
    return {
      provider,
      initiatePayment: (params: PaymentParams) => provider.initiatePayment(params),
      isSandboxMode: provider.isSandboxMode(),
      providerName: provider.displayName,
    };
  }, []);
  
  return (
    <PaymentContext.Provider value={contextValue}>
      {children}
    </PaymentContext.Provider>
  );
}

export function usePaymentProvider() {
  const context = useContext(PaymentContext);
  
  if (!context) {
    throw new Error('usePaymentProvider must be used within PaymentProvider');
  }
  
  return context;
}