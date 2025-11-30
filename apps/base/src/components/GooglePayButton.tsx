"use client";

import React from 'react';

export const GooglePayButton: React.FC<{
  fiatAmount: number;
  onSuccess: () => void;
}> = ({ fiatAmount, onSuccess }) => {

  const handlePayment = () => {
    console.log(`Google Pay button clicked. Amount: ${fiatAmount}`);
    // Here you would integrate with the Google Pay API
    // For now, we'll simulate a successful payment
    alert('Simulating Google Pay payment...');
    onSuccess();
  };

  return (
    <button
      onClick={handlePayment}
      className="w-full bg-black text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors"
    >
      <img src="/google-pay-mark.svg" alt="Google Pay" className="h-6 mr-2" />
    </button>
  );
}; 