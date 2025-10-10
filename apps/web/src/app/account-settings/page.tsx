'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import SocialAccountLinker from '@/components/SocialAccountLinker';
import AccountMergeHelper from '@/components/AccountMergeHelper';
import { getSocialProfile, formatDisplayName } from '@/utils/socialUtils';
import { UserCircleIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function AccountSettingsPage() {
  const { user, authenticated } = usePrivy();
  const router = useRouter();
  
  useEffect(() => {
    if (!authenticated) {
      router.push('/');
    }
  }, [authenticated, router]);

  if (!authenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const profile = getSocialProfile(user);
  const displayName = formatDisplayName(user);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="mt-2 text-gray-600">
            Manage your account and build trust with social verification
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-center">
                {profile.avatar ? (
                  <img 
                    src={profile.avatar} 
                    alt={displayName}
                    className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center mx-auto mb-4">
                    <UserCircleIcon className="w-12 h-12 text-white" />
                  </div>
                )}
                
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  {displayName}
                </h2>
                
                {user.email?.address && (
                  <p className="text-sm text-gray-600 mb-3">
                    {user.email.address}
                  </p>
                )}

                {user.wallet?.address && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-1">Wallet Address</p>
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono">
                      {user.wallet.address.substring(0, 6)}...{user.wallet.address.substring(user.wallet.address.length - 4)}
                    </code>
                  </div>
                )}

                <div className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
                  <ShieldCheckIcon className="w-5 h-5 text-blue-600" />
                  <div className="text-left">
                    <div className="text-sm font-semibold text-gray-900">
                      Trust Score: {profile.trustScore}/100
                    </div>
                    <div className="text-xs text-gray-600">
                      {profile.platforms.length} verified accounts
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Benefits */}
            <div className="mt-6 bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Why Verify Your Identity?
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Increase donor confidence and trust</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Show social proof to potential supporters</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Higher visibility in campaign listings</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Access to premium fundraising features</p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Account Linking */}
          <div className="lg:col-span-2">
            <SocialAccountLinker />
            
            {/* Account Merge Helper */}
            <div className="mt-6">
              <AccountMergeHelper />
            </div>
            
            {/* Privacy Notice */}
            <div className="mt-6 bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Privacy & Security
              </h3>
              <p className="text-sm text-blue-800 mb-4">
                Your linked social accounts are used only for identity verification and trust scoring. 
                We don't post on your behalf or access private information.
              </p>
              <div className="text-xs text-blue-700 space-y-1">
                <p>✓ We only verify that you control these accounts</p>
                <p>✓ No posting or private data access</p>
                <p>✓ You can disconnect accounts anytime</p>
                <p>✓ All data is encrypted and secure</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}