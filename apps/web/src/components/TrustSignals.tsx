'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useFarcasterProfile } from '@/hooks/useFarcasterProfile';
import { useGitcoinPassport } from '@/hooks/useGitcoinPassport';
import { useLoanSocialSupport } from '@/hooks/useLoanSocialSupport';
import { getSocialSupportDescription } from '@/lib/socialProximity';

interface TrustSignalsProps {
  borrowerAddress: `0x${string}`;
  loanAddress: `0x${string}`;
  businessWebsite?: string;
}

// Tooltip component
function InfoTooltip({ text }: { text: string }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative inline-block ml-1">
      <button
        type="button"
        onClick={() => setShowTooltip(!showTooltip)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="text-gray-400 hover:text-gray-600 focus:outline-none"
      >
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      </button>
      {showTooltip && (
        <div className="absolute z-10 left-0 bottom-full mb-2 w-64 p-2 text-xs text-white bg-gray-900 rounded-lg shadow-lg">
          {text}
          <div className="absolute top-full left-4 -mt-1 w-2 h-2 bg-gray-900 transform rotate-45" />
        </div>
      )}
    </div>
  );
}

export function TrustSignals({
  borrowerAddress,
  loanAddress,
  businessWebsite,
}: TrustSignalsProps) {
  const { profile, reputation } = useFarcasterProfile(borrowerAddress);
  const { score: gitcoinScore } = useGitcoinPassport(borrowerAddress);
  const { support, hasContributors } = useLoanSocialSupport(
    loanAddress,
    borrowerAddress
  );

  // Helper to get Gitcoin score status
  const getGitcoinStatus = (score: number | null | undefined) => {
    if (!score || score === 0) return { text: 'Not verified', color: 'text-gray-500' };
    if (score >= 40) return { text: 'Very Likely Human', color: 'text-green-600' };
    if (score >= 20) return { text: 'Likely Human', color: 'text-green-600' };
    return { text: 'Low Score', color: 'text-yellow-600' };
  };

  // Helper to get Neynar score status (0-1 scale)
  const getNeynarStatus = (score: number | null | undefined) => {
    if (!score || score === 0) return { text: 'Not Available', color: 'text-gray-500' };
    if (score >= 0.8) return { text: 'Excellent', color: 'text-green-600' };
    if (score >= 0.6) return { text: 'Good', color: 'text-green-600' };
    if (score >= 0.4) return { text: 'Fair', color: 'text-yellow-600' };
    return { text: 'Low', color: 'text-yellow-600' };
  };

  const gitcoinStatus = getGitcoinStatus(gitcoinScore?.score);
  const neynarStatus = getNeynarStatus(profile?.score);

  // Check if we have any data to display
  const hasAnyData = businessWebsite || gitcoinScore?.score || (hasContributors && support) || profile || profile?.score;

  if (!hasAnyData) {
    return null; // Don't show the section at all if there's no data
  }

  // Helper to copy address to clipboard
  const copyToClipboard = (address: string, label: string) => {
    navigator.clipboard.writeText(address);
    alert(`${label} copied to clipboard!`);
  };

  // Helper to format address
  const formatAddress = (address: string) => {
    if (address.length <= 12) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">
        Trust & Verification
      </h3>

      <div className="space-y-4">
        {/* Business Website */}
        {businessWebsite && (
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-700 flex items-center">
                Business Website
                <InfoTooltip text="Provided for verification and transparency." />
              </div>
              <a
                href={businessWebsite.startsWith('http') ? businessWebsite : `https://${businessWebsite}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline break-all"
              >
                {businessWebsite}
              </a>
            </div>
          </div>
        )}

        {/* FID (Farcaster ID) */}
        {profile?.fid && (
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-700 flex items-center">
                FID
                <InfoTooltip text="Farcaster ID - unique identifier for this account" />
              </div>
              <button
                onClick={() => copyToClipboard(profile.fid.toString(), 'FID')}
                className="text-sm text-gray-900 hover:text-blue-600 font-mono transition-colors flex items-center gap-1"
              >
                {profile.fid}
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Farcaster Custody Address */}
        {profile?.custodyAddress && (
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-700 flex items-center">
                Farcaster custody address
                <InfoTooltip text="Primary custody address for Farcaster account" />
              </div>
              <a
                href={`https://etherscan.io/address/${profile.custodyAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline font-mono flex items-center gap-1"
              >
                {formatAddress(profile.custodyAddress)}
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        )}

        {/* Connected Ethereum Wallets */}
        {profile?.verifications && profile.verifications.length > 0 && (
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
              />
            </svg>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-700 flex items-center mb-2">
                Connected Ethereum wallets
                <InfoTooltip text="Verified Ethereum addresses linked to this Farcaster account" />
              </div>
              <div className="space-y-1">
                {profile.verifications.map((address, index) => (
                  <div key={address} className="flex items-center gap-2">
                    <a
                      href={`https://etherscan.io/address/${address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline font-mono flex items-center gap-1"
                    >
                      {formatAddress(address)}
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                    {index === 0 && (
                      <>
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">Primary</span>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Farcaster Wallet</span>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Connected Solana Wallets */}
        {profile?.solanaAddresses && profile.solanaAddresses.length > 0 && (
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-700 flex items-center mb-2">
                Connected Solana wallets
                <InfoTooltip text="Verified Solana addresses linked to this Farcaster account" />
              </div>
              <div className="space-y-1">
                {profile.solanaAddresses.map((address, index) => (
                  <div key={address} className="flex items-center gap-2">
                    <a
                      href={`https://solscan.io/account/${address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline font-mono flex items-center gap-1"
                    >
                      {formatAddress(address)}
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                    {index === 0 && (
                      <>
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">Primary</span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Farcaster Wallet</span>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Neynar User Score */}
        {profile?.score && profile.score > 0 && (
          <div className="flex items-start gap-3">
            <Image
              src="/neynar-logo.png"
              alt="Neynar"
              width={20}
              height={20}
              className="mt-0.5 flex-shrink-0 rounded"
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-700 flex items-center">
                Neynar Quality Score
                <InfoTooltip text="Measures authenticity through activity and engagement patterns. Higher scores indicate more trustworthy accounts." />
              </div>
              <div className="text-sm text-gray-600">
                Score: {profile.score.toFixed(2)} - <span className={neynarStatus.color}>{neynarStatus.text}</span>
              </div>
            </div>
          </div>
        )}

        {/* Gitcoin Passport */}
        {gitcoinScore?.score && gitcoinScore.score > 0 && (
          <div className="flex items-start gap-3">
            <svg
              className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                (gitcoinScore?.score ?? 0) > 20 ? 'text-green-500' : 'text-gray-400'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-700 flex items-center">
                Humanity Verification
                <InfoTooltip text="Verifies real human identity through web3 stamps. Score above 20 indicates genuine user." />
              </div>
              <div className="text-sm text-gray-600">
                Score: {gitcoinScore.score.toFixed(1)} - <span className={gitcoinStatus.color}>{gitcoinStatus.text}</span>
              </div>
            </div>
          </div>
        )}

        {/* Social Support */}
        {hasContributors && support && (
          <div className="flex items-start gap-3">
            <svg
              className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                support.supportStrength === 'STRONG' ? 'text-green-500' :
                support.supportStrength === 'MODERATE' ? 'text-yellow-500' :
                'text-gray-400'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-700 flex items-center">
                Community Support
                <InfoTooltip text="Shows social connections between borrower and lenders. Strong support indicates trust within their network." />
              </div>
              <div className="text-sm text-gray-600">
                {getSocialSupportDescription(support)}
              </div>
            </div>
          </div>
        )}

        {/* Farcaster Profile */}
        {profile && (
          <div className="flex items-start gap-3">
            <svg
              className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                profile.powerBadge ? 'text-purple-500' : 'text-gray-400'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-700 flex items-center">
                Farcaster Profile
                <InfoTooltip text="Social profile with reputation indicators. Power Badge shows trusted community member status." />
              </div>
              <div className="text-sm text-gray-600">
                <a
                  href={`https://warpcast.com/${profile.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  @{profile.username}
                </a>
                {profile.powerBadge && <span className="text-purple-600 ml-1">(Power Badge)</span>}
              </div>
              {reputation && (
                <div className="text-xs text-gray-500 mt-1">
                  {profile.followerCount.toLocaleString()} followers · {profile.followingCount.toLocaleString()} following
                </div>
              )}
            </div>
          </div>
        )}

        {/* Lending Risk - Placeholder */}
        <div className="pt-3 mt-3 border-t border-gray-200">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 mt-0.5 flex-shrink-0 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-700 flex items-center">
                Lending Risk
                <InfoTooltip text="Composite risk score based on all trust signals. Coming soon." />
              </div>
              <div className="text-sm text-gray-500 italic">
                Assessment coming soon
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
