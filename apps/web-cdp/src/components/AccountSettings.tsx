'use client';

import { useAccount } from 'wagmi';
import { useEvmAddress } from '@coinbase/cdp-hooks';
import { usePrivy } from '@privy-io/react-auth';
import { useBorrowerLoans, useLoans } from '@/hooks/useMicroLoan';
import { useState } from 'react';
import { DataExport } from './DataExport';
import { FarcasterProfileEdit } from './FarcasterProfileEdit';

export default function AccountSettings() {
  const { address: externalAddress, connector } = useAccount();
  const { evmAddress: cdpAddress } = useEvmAddress();
  const { user, logout } = usePrivy();

  // Prioritize external wallet address, fallback to CDP address
  const address = externalAddress || cdpAddress;
  const { loans: borrowedLoans } = useBorrowerLoans(address);
  const { loans: allLoans } = useLoans();

  // Calculate user stats
  const totalBorrowed = borrowedLoans?.reduce((sum, loan) => {
    return sum + Number(loan.principal);
  }, 0) || 0;

  const activeBorrowedLoans = borrowedLoans?.filter(loan => loan.active).length || 0;
  const completedBorrowedLoans = borrowedLoans?.filter(loan => loan.completed).length || 0;

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Address copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!address) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Wallet Not Connected</h2>
          <p className="text-gray-600">
            Please connect your wallet to view your account settings
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Account & Verification</h1>

      {/* Wallet Section */}
      <section className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Connected Wallet</h2>
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-1">Address</p>
            <div className="flex items-center gap-2">
              <p className="font-mono text-lg text-gray-900">{formatAddress(address)}</p>
              <button
                onClick={() => copyToClipboard(address)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                title="Copy full address"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
            {connector?.name && (
              <p className="text-sm text-gray-500 mt-1">
                Connected via {connector.name}
              </p>
            )}
          </div>
          <button
            onClick={() => logout()}
            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-lg transition-colors"
          >
            Disconnect
          </button>
        </div>
      </section>

      {/* Farcaster Profile Section */}
      <section className="mb-6">
        <FarcasterProfileEdit />
      </section>

      {/* Activity Stats Section */}
      <section className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Your Activity</h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Loans Created</p>
            <p className="text-3xl font-bold text-gray-900">{borrowedLoans?.length || 0}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Active Loans</p>
            <p className="text-3xl font-bold text-blue-600">{activeBorrowedLoans}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Completed Loans</p>
            <p className="text-3xl font-bold text-green-600">{completedBorrowedLoans}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Network Loans</p>
            <p className="text-3xl font-bold text-gray-900">{allLoans?.length || 0}</p>
          </div>
        </div>
      </section>

      {/* Verification Section */}
      <section className="bg-gradient-to-br from-blue-50 to-green-50 border border-gray-200 rounded-2xl p-6 mb-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Identity Verification</h2>
            <p className="text-sm text-gray-700 mb-4">
              Identity verification is coming soon. Verified users will unlock:
            </p>
            <ul className="space-y-2 text-sm text-gray-700 mb-4">
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Higher loan limits
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Better loan terms
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Verified badge on your loans
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Increased trust from lenders
              </li>
            </ul>
            <button
              disabled
              className="px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed font-medium"
            >
              Start Verification (Coming Soon)
            </button>
          </div>
        </div>
      </section>

      {/* Settings Section */}
      <section className="bg-white border border-gray-200 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Settings</h2>
        <div className="space-y-4">
          {/* Email Notifications */}
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <p className="font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-600">
                Receive updates about your loans and contributions
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-not-allowed">
              <input type="checkbox" disabled className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
          </div>

          {/* Privacy Mode */}
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <p className="font-medium text-gray-900">Privacy Mode</p>
              <p className="text-sm text-gray-600">
                Hide personal information from public views
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-not-allowed">
              <input type="checkbox" disabled className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
          </div>

          {/* Transaction History */}
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-gray-900">Transaction History Export</p>
              <p className="text-sm text-gray-600">
                Download your transaction history as CSV
              </p>
            </div>
            <button
              disabled
              className="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed font-medium"
            >
              Export
            </button>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-6 text-center">
          More settings and features coming soon
        </p>
      </section>

      {/* Data Export Section */}
      <section className="bg-white border border-gray-200 rounded-2xl p-6">
        <DataExport />
      </section>
    </div>
  );
}
