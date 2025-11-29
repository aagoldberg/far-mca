'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useIsSignedIn } from '@coinbase/cdp-hooks';
import { useFarcasterAccount } from '@/hooks/useFarcasterAccount';
import { useBorrowerLoans } from '@/hooks/useMicroLoan';
import {
  generateAccountDataExport,
  generateExitPackage,
  downloadJSON,
  downloadFile,
  type ExportData,
} from '@/lib/dataExport';

export function DataExport() {
  const { address: externalAddress } = useAccount();
  const { isSignedIn } = useIsSignedIn();
  const { farcasterAccount } = useFarcasterAccount();
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  // Determine wallet address and type
  const walletAddress = externalAddress;
  const walletType: 'cdp-embedded' | 'external' = isSignedIn ? 'cdp-embedded' : 'external';

  // Get user's loans
  const { loanAddresses } = useBorrowerLoans(walletAddress);

  // We'll need to fetch full loan data - for now just pass addresses
  const borrowedLoans = loanAddresses || [];

  if (!walletAddress) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          Connect your wallet to export your data
        </p>
      </div>
    );
  }

  const handleDownloadJSON = async () => {
    setIsExporting(true);
    try {
      const exportData = generateAccountDataExport(
        walletAddress,
        walletType,
        farcasterAccount,
        borrowedLoans as any[]
      );

      const timestamp = new Date().toISOString().split('T')[0];
      downloadJSON(exportData, `lendfriend-data-${timestamp}.json`);

      setExportComplete(true);
      setTimeout(() => setExportComplete(false), 3000);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadExitPackage = async () => {
    setIsExporting(true);
    try {
      const exportData = generateAccountDataExport(
        walletAddress,
        walletType,
        farcasterAccount,
        borrowedLoans as any[]
      );

      const zipBlob = await generateExitPackage(exportData);
      const timestamp = new Date().toISOString().split('T')[0];
      downloadFile(zipBlob, `lendfriend-exit-package-${timestamp}.zip`);

      setExportComplete(true);
      setTimeout(() => setExportComplete(false), 3000);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to generate exit package. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Data Export & Sovereignty</h2>
        <p className="text-sm text-gray-600">
          Download all your data. We believe in no lock-in.
        </p>
      </div>

      {/* No Lock-In Promise */}
      <div className="bg-gradient-to-br from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">No Lock-In Guarantee</h3>
            <p className="text-sm text-gray-700">
              Your data is yours, always. Export everything at any time, migrate to another platform,
              or access your loans directly on-chain even if LendFriend disappears.
            </p>
          </div>
        </div>
      </div>

      {/* Account Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-600 mb-1">Wallet Type</p>
          <p className="text-sm font-semibold text-gray-900">
            {walletType === 'cdp-embedded' ? 'CDP Wallet' : 'External Wallet'}
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-600 mb-1">Loans Created</p>
          <p className="text-sm font-semibold text-gray-900">{borrowedLoans.length}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-600 mb-1">Farcaster</p>
          <p className="text-sm font-semibold text-gray-900">
            {farcasterAccount ? `@${farcasterAccount.username}` : 'Not connected'}
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-600 mb-1">FID</p>
          <p className="text-sm font-semibold text-gray-900">
            {farcasterAccount ? `#${farcasterAccount.fid}` : 'N/A'}
          </p>
        </div>
      </div>

      {/* Export Options */}
      <div className="space-y-4">
        {/* Quick JSON Export */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">Account Data (JSON)</h3>
              <p className="text-sm text-gray-600 mb-3">
                Download your complete account data as a JSON file. Includes wallet info,
                Farcaster account, and all loan contract addresses.
              </p>
              <button
                onClick={handleDownloadJSON}
                disabled={isExporting}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                {isExporting ? 'Exporting...' : 'Download JSON'}
              </button>
            </div>
            <div className="text-gray-400">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Complete Exit Package */}
        <div className="border border-green-300 rounded-lg p-4 bg-green-50">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                Complete Exit Package (ZIP)
                <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">Recommended</span>
              </h3>
              <p className="text-sm text-gray-700 mb-3">
                Everything you need to leave LendFriend and maintain full control:
              </p>
              <ul className="text-sm text-gray-700 space-y-1 mb-4 ml-4">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Account data (JSON)
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Loan contract addresses
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Migration guide (step-by-step)
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Emergency recovery instructions
                </li>
              </ul>
              <button
                onClick={handleDownloadExitPackage}
                disabled={isExporting}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                {isExporting ? 'Generating...' : 'Download Exit Package'}
              </button>
            </div>
            <div className="text-green-600">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {exportComplete && (
        <div className="bg-green-50 border border-green-300 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-800">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Export successful! Check your downloads folder.</span>
          </div>
        </div>
      )}

      {/* Important Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-2">Important Information</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• All your loans are permanently on the Base blockchain</li>
          <li>• Your Farcaster FID is registered on Optimism (you own it)</li>
          <li>• Loan metadata is stored on IPFS (permanent and public)</li>
          <li>• You can access everything without LendFriend</li>
        </ul>
      </div>

      {/* Links */}
      <div className="flex flex-wrap gap-3">
        <a
          href={`https://sepolia.basescan.org/address/${walletAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
        >
          View on Basescan
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
        {farcasterAccount && (
          <a
            href={`https://warpcast.com/${farcasterAccount.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            View on Warpcast
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}
