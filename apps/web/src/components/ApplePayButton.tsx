"use client";

import React from 'react';

export const ApplePayButton: React.FC<{
  fiatAmount: number;
  onSuccess: () => void;
}> = ({ fiatAmount, onSuccess }) => {

  const handlePayment = () => {
    console.log(`Apple Pay button clicked. Amount: ${fiatAmount}`);
    // Here you would integrate with the Apple Pay JS API
    // For now, we'll simulate a successful payment
    alert('Simulating Apple Pay payment...');
    onSuccess();
  };

  return (
    <button
      onClick={handlePayment}
      className="w-full bg-black text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors"
    >
      <span className="mr-2"></span> Pay
    </button>
  );
}; 