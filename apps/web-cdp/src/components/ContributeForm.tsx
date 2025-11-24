"use client";

import { useState } from 'react';
import { useCDPAuth } from '@/hooks/useCDPAuth';
import { PaymentOptionsRefactored } from './PaymentOptionsRefactored';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
// import { BridgeButton } from './BridgeButton';

const suggestedAmounts = [5, 10, 25, 50, 100];

type ContributeFormProps = {
    campaignNumericId: string;
    onSuccess: (message: string) => void;
    onError: (message: string) => void;
};

export default function ContributeForm({
    campaignNumericId,
    onSuccess,
    onError,
}: ContributeFormProps) {
    const { login, user, ready } = useCDPAuth();
    const [amount, setAmount] = useState('5');
    const amountIsValid = (parseFloat(amount) || 0) >= 5;

    const handleAmountClick = (value: number) => {
        setAmount(value.toString());
    };

    if (!ready) {
        return (
            <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg max-w-lg mx-auto">
                <div className="text-center py-6">
                    <div className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 max-w-lg mx-auto">
            {/* User status bar */}
            {user ? (
                <div className="px-6 py-4 bg-green-50 border-b border-green-100 rounded-t-2xl">
                    <div className="flex items-center justify-center">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <p className="text-sm font-medium text-green-800">
                                Logged in as <span className="font-mono">{user.wallet?.address.slice(0, 6)}...{user.wallet?.address.slice(-4)}</span>
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 rounded-t-2xl">
                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Have an account?{' '}
                            <button 
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    login();
                                }} 
                                className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                            >
                                Log In
                            </button>
                        </p>
                    </div>
                </div>
            )}

            <div className="p-6 space-y-6">
                {/* Amount selection */}
                <div>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-4">
                        {suggestedAmounts.map((val) => (
                            <button
                                key={val}
                                type="button"
                                onClick={() => handleAmountClick(val)}
                                className={`py-2.5 px-3 rounded-xl font-semibold transition-all text-sm ${
                                    amount === val.toString() 
                                    ? 'bg-gray-900 text-white shadow-sm scale-105' 
                                    : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                }`}
                            >
                                ${val}
                            </button>
                        ))}
                    </div>

                    <div className="relative flex items-center p-4 border-2 border-gray-200 rounded-xl focus-within:border-blue-500 transition-all bg-gray-50">
                        <div className="flex flex-col mr-4">
                            <span className="font-bold text-xl text-gray-800">$</span>
                            <span className="text-xs font-semibold text-gray-500 uppercase">USD</span>
                        </div>
                        <div className="flex-1 flex justify-end items-baseline overflow-hidden">
                            <input 
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="5"
                                className="w-full min-w-0 text-right text-5xl font-bold tracking-tighter text-gray-900 bg-transparent border-none outline-none focus:ring-0 p-0 placeholder-gray-300"
                            />
                            <span className="text-5xl font-bold tracking-tight text-gray-300">.00</span>
                        </div>
                    </div>
                    {!amountIsValid && (
                        <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            Minimum donation is $5.00
                        </p>
                    )}
                </div>

                {/* Payment options */}
                <div>
                    <PaymentOptionsRefactored
                        campaignNumericId={campaignNumericId}
                        fiatAmount={parseFloat(amount) || 0}
                        onSuccess={onSuccess}
                        onError={onError}
                    />
                </div>
            </div>

            {/* <div className="text-center my-6">
                <p className="text-sm text-gray-500 mb-2">Need funds on Base?</p>
                <BridgeButton />
            </div> */}
        </div>
    );
} 