"use client";

import { generateOnRampURL } from '@coinbase/cbpay-js';
import React from 'react';
import { useCampaign } from '@/hooks/useCampaign';

type CoinbasePayButtonProps = {
    fiatAmount: number;
    campaignNumericId: string;
    onSuccess: (message: string) => void;
    onError: (message: string) => void;
};

const COINBASE_APP_ID = process.env.NEXT_PUBLIC_COINBASE_APP_ID;

export const CoinbasePayButton: React.FC<CoinbasePayButtonProps> = ({ 
    fiatAmount, 
    campaignNumericId, 
    onSuccess, 
    onError,
}) => {
    const { campaign, loading, error } = useCampaign(campaignNumericId);

    const handleCoinbasePay = () => {
        if (!COINBASE_APP_ID) {
            onError("Coinbase Pay is not configured.");
            console.error("NEXT_PUBLIC_COINBASE_APP_ID is not set.");
            return;
        }

        if (!campaign?.campaignAddress) {
            onError("Campaign details not loaded yet.");
            return;
        }

        const onrampUrl = generateOnRampURL({
            appId: COINBASE_APP_ID,
            addresses: {
                [campaign.campaignAddress]: ['base-sepolia']
            },
            assets: ['USDC'],
            defaultAsset: 'USDC',
            defaultNetwork: 'base-sepolia',
            presetFiatAmount: fiatAmount,
            fiatCurrency: 'USD',
            defaultExperience: 'buy',
            defaultPaymentMethod: 'CRYPTO_ACCOUNT',
            redirectUrl: `${window.location.origin}/campaign/${campaignNumericId}`
        });

        window.location.href = onrampUrl;
    };

    if (loading) {
        return (
            <button disabled className="w-full mt-2 bg-gray-300 text-white font-bold py-3 px-4 rounded-lg cursor-not-allowed">
                Loading...
            </button>
        );
    }

    if (error || !COINBASE_APP_ID) {
        return (
            <button disabled className="w-full mt-2 bg-gray-300 text-white font-bold py-3 px-4 rounded-lg cursor-not-allowed">
                {error ? "Error loading campaign" : "Coinbase Pay Unavailable"}
            </button>
        );
    }

    return (
        <button
            onClick={handleCoinbasePay}
            disabled={fiatAmount < 5}
            className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
            Pay with Coinbase
        </button>
    );
}; 