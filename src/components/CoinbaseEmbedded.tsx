"use client";

import React from 'react';
import { useAccount } from 'wagmi';

const FARCASTER_FUNDRAISE_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_FARCASTER_FUNDRAISE_CONTRACT_ADDRESS as `0x${string}`;
const COINBASE_APP_ID = process.env.NEXT_PUBLIC_COINBASE_APP_ID;
const ENABLE_SANDBOX = process.env.NEXT_PUBLIC_ENABLE_COINBASE_SANDBOX === 'true';

export const CoinbaseEmbedded = () => {
    const { address } = useAccount();

    if (!COINBASE_APP_ID) {
        return <p className="text-red-600">Error: Coinbase App ID is not configured.</p>;
    }
    
    if (!address) {
        return <p className="text-gray-600">Please connect your wallet to use the on-ramp.</p>;
    }

    const baseUrl = ENABLE_SANDBOX 
        ? 'https://pay-sandbox.coinbase.com' 
        : 'https://pay.coinbase.com';

    // Construct the URL with all necessary parameters for the iFrame
    const widgetUrl = new URL(baseUrl);
    widgetUrl.searchParams.set('appId', COINBASE_APP_ID);
    widgetUrl.searchParams.set('destinationWallets', JSON.stringify([{
        address: FARCASTER_FUNDRAISE_CONTRACT_ADDRESS,
        blockchains: [ENABLE_SANDBOX ? 'base' : 'base'], // Use mainnet for sandbox as required
    }]));
    widgetUrl.searchParams.set('defaultAsset', 'USDC');
    widgetUrl.searchParams.set('defaultNetwork', ENABLE_SANDBOX ? 'base' : 'base');

    return (
        <iframe
            src={widgetUrl.toString()}
            style={{
                width: '100%',
                height: '600px',
                border: 'none',
                borderRadius: '8px',
            }}
            title="Coinbase On-Ramp"
        />
    );
}; 