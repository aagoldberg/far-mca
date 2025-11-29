'use client';

import { useEffect, useState } from 'react';
import { formatUnits } from 'viem';
import { getRecentDonations } from '@/lib/subgraph';

type Donation = {
  id: string;
  contributor: string;
  amount: string;
  timestamp: string;
  type: string;
  txHash?: string;
};

type DonationHistoryProps = {
  campaignId: string;
};

export default function DonationHistory({ campaignId }: DonationHistoryProps) {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDonations() {
      try {
        setLoading(true);
        const donationData = await getRecentDonations(campaignId);
        setDonations(donationData);
      } catch (err) {
        console.error('Error fetching donations:', err);
        setError('Failed to load donation history');
      } finally {
        setLoading(false);
      }
    }

    if (campaignId) {
      fetchDonations();
    }
  }, [campaignId]);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(parseInt(timestamp) * 1000).toLocaleDateString();
  };

  const formatAmount = (amount: string) => {
    return parseFloat(formatUnits(BigInt(amount), 6)).toFixed(2);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'wallet':
        return '🔗';
      case 'coinbase-pay':
        return '💳';
      default:
        return '💰';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'wallet':
        return 'Wallet';
      case 'coinbase-pay':
        return 'Coinbase Pay';
      default:
        return 'Direct Transfer';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Donations</h3>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Donations</h3>
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Recent Donations ({donations.length})
      </h3>
      
      {donations.length === 0 ? (
        <p className="text-gray-500 text-sm">No donations yet. Be the first to donate!</p>
      ) : (
        <div className="space-y-4">
          {donations.map((donation) => (
            <div key={donation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="text-xl">{getTypeIcon(donation.type)}</div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {formatAddress(donation.contributor)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {getTypeLabel(donation.type)} • {formatTimestamp(donation.timestamp)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-green-600">
                  +${formatAmount(donation.amount)} USDC
                </p>
                {donation.txHash && (
                  <a
                    href={`https://sepolia.basescan.org/tx/${donation.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    View Transaction
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}