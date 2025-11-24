'use client';

import { useState } from 'react';
import { useCDPAuth } from '@/hooks/useCDPAuth';
import { ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

export default function AccountMergeHelper() {
  const { user, logout } = useCDPAuth();
  const [showInstructions, setShowInstructions] = useState(false);

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
      <div className="flex items-start gap-3">
        <ExclamationTriangleIcon className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-amber-900 mb-2">
            Multiple Accounts Detected?
          </h3>
          
          <p className="text-sm text-amber-800 mb-4">
            If you have multiple accounts with different social logins, here's how to consolidate them:
          </p>

          <button
            onClick={() => setShowInstructions(!showInstructions)}
            className="text-sm font-medium text-amber-700 hover:text-amber-900 flex items-center gap-2"
          >
            <InformationCircleIcon className="w-4 h-4" />
            {showInstructions ? 'Hide' : 'Show'} Instructions
          </button>

          {showInstructions && (
            <div className="mt-4 space-y-3 text-sm text-amber-700">
              <div className="p-3 bg-white rounded-lg">
                <p className="font-semibold mb-2">To merge accounts:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Note which campaigns belong to each account</li>
                  <li>Choose which account you want to keep (usually the one with more campaigns)</li>
                  <li>Log into your primary account</li>
                  <li>Link all your other social accounts here</li>
                  <li>Contact support to transfer campaigns from old accounts</li>
                </ol>
              </div>

              <div className="p-3 bg-white rounded-lg">
                <p className="font-semibold mb-2">Current account:</p>
                <p className="text-xs font-mono bg-gray-100 p-2 rounded">
                  User ID: {user?.id}
                </p>
                <p className="text-xs mt-2">
                  Email: {user?.email?.address || 'Not set'}
                </p>
                <p className="text-xs">
                  Wallet: {user?.wallet?.address ? 
                    `${user.wallet.address.substring(0, 6)}...${user.wallet.address.substring(user.wallet.address.length - 4)}` 
                    : 'Not connected'}
                </p>
              </div>

              <div className="p-3 bg-orange-100 rounded-lg">
                <p className="font-semibold text-orange-900 mb-1">⚠️ Important:</p>
                <p className="text-orange-800">
                  Each social login creates a separate account. Campaigns are tied to the account that created them.
                  We're working on automatic account merging, but for now, please contact support if you need help.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    logout();
                  }}
                  className="px-4 py-2 bg-white text-amber-700 border border-amber-300 rounded-lg hover:bg-amber-50 text-sm font-medium"
                >
                  Switch Account
                </button>
                <a
                  href="mailto:support@everybit.com?subject=Account Merge Request"
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm font-medium"
                >
                  Contact Support
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}