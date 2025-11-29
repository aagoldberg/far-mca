"use client";

import { useState, useEffect, ComponentType } from 'react';
import { useCDPAuth } from '@/hooks/useCDPAuth';
import { useCDPWallets } from '@/hooks/useCDPWallets';
import { ConnectedWallet } from '@/types/wallet';
import Image from 'next/image';
import { BanknotesIcon, CreditCardIcon as OutlineCreditCardIcon } from '@heroicons/react/24/outline';

import { usePaymentProvider } from '@/providers/payment/PaymentProvider';
import { UnifiedPaymentButton } from '@/providers/payment/UnifiedPaymentButton';
import { WalletDonationButton } from './WalletDonationButton';
import { useCampaign } from '@/hooks/useCampaign';

const ApplePayIcon = ({ className }: { className?: string }) => (
    <Image src="/apple-pay-mark.svg" alt="Apple Pay" width={48} height={20} className={className} />
);

type PaymentOptionsProps = {
  campaignNumericId: string;
  fiatAmount: number;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
};

export function PaymentOptionsRefactored({ campaignNumericId, fiatAmount, onSuccess, onError }: PaymentOptionsProps) {
    const { user, authenticated, login, logout } = useCDPAuth();
    const { wallets } = useCDPWallets();
    const { provider, isSandboxMode } = usePaymentProvider();
    const { campaign, loading: isCampaignLoading, error: campaignError } = useCampaign(campaignNumericId);

    const [selectedOption, setSelectedOption] = useState<string | null>('card');
    const [selectedEoaWallet, setSelectedEoaWallet] = useState<ConnectedWallet | null>(null);
    const [availableOptions, setAvailableOptions] = useState<any[]>([]);

    const handleOnchainWalletSelect = () => {
        setSelectedOption('wallet');

        if (!authenticated) {
            setTimeout(() => login(), 0); // Defer login to avoid React key conflicts
            return;
        }
        
        const eoaWallet = wallets.find(wallet => wallet.walletClientType !== 'privy');
        if (eoaWallet) {
            setSelectedEoaWallet(eoaWallet);
        } else {
            setSelectedEoaWallet(null);
        }
    };
    
    useEffect(() => {
        if (authenticated && wallets.length > 0 && !selectedEoaWallet) {
            const eoaWallet = wallets.find(wallet => wallet.walletClientType !== 'privy');
            if (eoaWallet) {
                setSelectedEoaWallet(eoaWallet);
                setSelectedOption('wallet');
            }
        }
    }, [authenticated, wallets, selectedEoaWallet]);

    useEffect(() => {
        const CoinbaseIcon = () => (
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="#0052FF"/>
                <path d="M9 9h6v6H9V9z" fill="white"/>
            </svg>
        );

        // Build options based on provider capabilities
        const baseOptions: { id: string; name: string; Icon: any }[] = [];
        
        // Card option (supported by both providers)
        if (provider.isMethodSupported('card')) {
            baseOptions.push({ id: 'card', name: 'Card', Icon: OutlineCreditCardIcon });
        }
        
        // Exchange option (Coinbase account or exchange transfer)
        if (provider.isMethodSupported('exchange')) {
            const exchangeName = provider.name === 'coinbase' ? 'Coinbase' : 'Exchange';
            baseOptions.push({ id: 'exchange', name: exchangeName, Icon: CoinbaseIcon });
        }
        
        // Wallet option is always available (direct transfer)
        baseOptions.push({ id: 'wallet', name: 'Onchain Wallet', Icon: BanknotesIcon });

        setAvailableOptions(baseOptions);
    }, [provider]);

    const renderSelectedPaymentComponent = () => {
        if (isCampaignLoading) {
            return (
                <div className="w-full mt-6 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
            );
        }
    
        if (campaignError || !campaign?.campaignAddress) {
            return (
                <div className="w-full mt-6 text-center text-red-600 bg-red-50 p-3 rounded-lg">
                    Could not load campaign details. Please refresh the page.
                </div>
            );
        }

        // Handle wallet option (unchanged - direct transfer)
        if (selectedOption === 'wallet') {
            if (!authenticated) {
                return (
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            login();
                        }}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                    >
                        Connect Wallet to Donate
                    </button>
                );
            }
            return (
                <>
                    <WalletDonationButton
                        wallet={selectedEoaWallet}
                        campaignAddress={campaign.campaignAddress}
                        fiatAmount={fiatAmount}
                        onSuccess={onSuccess}
                        onError={onError}
                    />
                    <button
                        onClick={() => {
                          logout();
                          setSelectedEoaWallet(null);
                          setSelectedOption('card');
                        }}
                        className="w-full mt-2 text-sm text-gray-500 hover:text-gray-700"
                    >
                        Logout
                    </button>
                </>
            );
        }

        // Use unified payment button for card and exchange
        if (selectedOption === 'card' || selectedOption === 'exchange') {
            return (
                <UnifiedPaymentButton
                    method={selectedOption as 'card' | 'exchange'}
                    campaignAddress={campaign.campaignAddress}
                    campaignNumericId={campaignNumericId}
                    fiatAmount={fiatAmount}
                    onSuccess={onSuccess}
                    onError={onError}
                    disabled={fiatAmount < 5}
                />
            );
        }

        return null;
    };

    return (
        <div className="space-y-4">
            {/* Show sandbox mode indicator if active */}
            {isSandboxMode && (
                <div className="bg-amber-100 text-amber-800 text-sm py-2 px-4 rounded-lg text-center">
                    🧪 Sandbox Mode - Using {provider.displayName}
                </div>
            )}
            
            <fieldset>
                <legend className="sr-only">Payment method</legend>
                <div className="space-y-3">
                    {availableOptions.map((option) => (
                        <div
                            key={option.id}
                            onClick={option.id === 'wallet' ? handleOnchainWalletSelect : () => setSelectedOption(option.id)}
                            className={`relative flex items-center p-4 rounded-xl cursor-pointer transition-all ${
                                selectedOption === option.id 
                                    ? 'bg-blue-50 border-2 border-blue-500 shadow-sm' 
                                    : 'bg-white border-2 border-gray-200 hover:border-gray-300 hover:shadow-sm'
                            }`}
                        >
                            <div className="flex-shrink-0">
                                <option.Icon className={`h-6 w-6 ${
                                    selectedOption === option.id ? 'text-blue-600' : 'text-gray-500'
                                }`} aria-hidden="true" />
                            </div>
                            <div className="ml-4 flex-1">
                                <label className={`font-semibold text-base cursor-pointer ${
                                    selectedOption === option.id ? 'text-blue-900' : 'text-gray-900'
                                }`}>{option.name}</label>
                            </div>
                            <div className="flex-shrink-0">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                    selectedOption === option.id 
                                        ? 'border-blue-500 bg-blue-500' 
                                        : 'border-gray-300 bg-white'
                                }`}>
                                    {selectedOption === option.id && (
                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </fieldset>

            <div className="pt-2">
                {renderSelectedPaymentComponent()}
            </div>
        </div>
    );
}