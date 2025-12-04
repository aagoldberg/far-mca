'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useFarcasterProfile } from '@/hooks/useFarcasterProfile';
import { useLoanSocialSupport } from '@/hooks/useLoanSocialSupport';
import { useBlueskyProfile } from '@/hooks/useBlueskyProfile';
import { getSocialSupportDescription } from '@/lib/socialProximity';

interface TrustSignalsProps {
  borrowerAddress: `0x${string}`;
  loanAddress: `0x${string}`;
  businessWebsite?: string;
  blueskyHandle?: string; // Optional Bluesky handle (e.g., "alice.bsky.social")
  twitterHandle?: string; // Optional X/Twitter handle (e.g., "@alice" or "alice")
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
        <div className="absolute z-10 left-0 bottom-full mb-2 w-64 p-3 text-xs leading-relaxed text-white bg-gray-900 rounded-lg shadow-xl">
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
  blueskyHandle,
  twitterHandle,
}: TrustSignalsProps) {
  const [showAddresses, setShowAddresses] = useState(false);
  const [showBlueskyInfo, setShowBlueskyInfo] = useState(false);
  const { profile, reputation } = useFarcasterProfile(borrowerAddress);
  const { profile: blueskyProfile, quality: blueskyQuality } = useBlueskyProfile(blueskyHandle);
  const { support, hasContributors } = useLoanSocialSupport(
    loanAddress,
    borrowerAddress
  );

  // Helper to get Neynar score status (0-1 scale)
  const getNeynarStatus = (score: number | null | undefined) => {
    if (!score || score === 0) return { text: 'Not Available', color: 'text-gray-500' };
    if (score >= 0.8) return { text: 'Excellent', color: 'text-brand-600' };
    if (score >= 0.6) return { text: 'Good', color: 'text-brand-600' };
    if (score >= 0.4) return { text: 'Fair', color: 'text-yellow-600' };
    return { text: 'Low', color: 'text-yellow-600' };
  };

  // Helper to get Bluesky quality score status (0-100 scale)
  const getBlueskyQualityStatus = (score: number | null | undefined) => {
    if (!score || score === 0) return { text: 'Not Available', color: 'text-gray-500' };
    if (score >= 70) return { text: 'High Quality', color: 'text-brand-600' };
    if (score >= 40) return { text: 'Medium Quality', color: 'text-yellow-600' };
    return { text: 'Low Quality', color: 'text-orange-600' };
  };

  const neynarStatus = getNeynarStatus(profile?.score);
  const blueskyQualityStatus = getBlueskyQualityStatus(blueskyQuality?.overall);

  // Check if we have any data to display
  const hasAnyData = businessWebsite || twitterHandle || (hasContributors && support) || profile || profile?.score || blueskyProfile;

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
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
          Verification & Trust
        </h3>
      </div>

      <div className="p-6 space-y-6">
        {/* Business Website (Top Priority) */}
        {businessWebsite && (
          <div className="flex items-start gap-4 p-4 bg-brand-50/50 border border-brand-100 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0 text-brand-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-bold text-gray-900">Verified Business</span>
                <InfoTooltip text="This business has provided a verified website." />
              </div>
              <a
                href={businessWebsite.startsWith('http') ? businessWebsite : `https://${businessWebsite}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-secondary-600 hover:text-secondary-800 hover:underline break-all font-medium flex items-center gap-1"
              >
                {businessWebsite.replace(/^https?:\/\//, '')}
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        )}

        {/* Twitter/X Handle */}
        {twitterHandle && (
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 mt-0.5 flex items-center justify-center text-gray-400">
              <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-700 flex items-center">
                X (Twitter)
                <InfoTooltip text="Borrower's X/Twitter account for additional verification." />
              </div>
              <a
                href={`https://twitter.com/${twitterHandle.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-secondary-600 hover:underline break-all"
              >
                @{twitterHandle.replace('@', '')}
              </a>
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
              className="mt-0.5 flex-shrink-0 rounded opacity-80"
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-700 flex items-center">
                Neynar Quality Score
                <InfoTooltip text="Measures authenticity through activity and engagement patterns. Higher scores indicate more trustworthy accounts." />
              </div>
              <div className="text-sm text-gray-600">
                Score: {profile.score.toFixed(2)} - <span className={`font-medium ${neynarStatus.color}`}>{neynarStatus.text}</span>
              </div>
            </div>
          </div>
        )}

        {/* Social Support */}
        {hasContributors && support && (
          <div className="flex items-start gap-3">
            <svg
              className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                support.supportStrength === 'STRONG' ? 'text-brand-500' :
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

        {/* Bluesky Quality Score */}
        {blueskyQuality && blueskyQuality.overall > 0 && (
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-secondary-500 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
              />
            </svg>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-700 flex items-center">
                Bluesky Quality Score
                <InfoTooltip text="Measures account quality through follower count, engagement rate, activity level, and profile completeness." />
              </div>
              <div className="text-sm text-gray-600">
                Score: {blueskyQuality.overall}/100 - <span className={`font-medium ${blueskyQualityStatus.color}`}>{blueskyQualityStatus.text}</span>
              </div>
            </div>
          </div>
        )}

        {/* Farcaster Profile */}
        {profile && (
          <div className="border border-gray-100 rounded-xl bg-gray-50/50">
            <div className="flex items-start gap-3 p-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${profile.powerBadge ? 'bg-purple-100 text-purple-600' : 'bg-gray-200 text-gray-500'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm font-bold text-gray-900 flex items-center gap-1">
                    Farcaster Profile
                    {profile.powerBadge && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-purple-100 text-purple-800">
                        Power User
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setShowAddresses(!showAddresses)}
                    className="text-xs text-secondary-600 hover:text-secondary-800 font-medium"
                  >
                    {showAddresses ? 'Hide' : 'View'} Addresses
                  </button>
                </div>
                
                <div className="text-sm text-gray-600 mb-1">
                  <a
                    href={`https://warpcast.com/${profile.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary-600 hover:underline font-medium"
                  >
                    @{profile.username}
                  </a>
                </div>
                
                {reputation && (
                  <div className="text-xs text-gray-500 flex gap-3">
                    <span><strong className="text-gray-900">{profile.followerCount.toLocaleString()}</strong> followers</span>
                    <span><strong className="text-gray-900">{profile.followingCount.toLocaleString()}</strong> following</span>
                  </div>
                )}
              </div>
            </div>

            {/* Collapsible Addresses Section */}
            {showAddresses && (
              <div className="border-t border-gray-200 p-4 bg-gray-50 space-y-4 rounded-b-xl">
                {/* FID */}
                {profile.fid && (
                  <div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">FID</div>
                    <button
                      onClick={() => copyToClipboard(String(profile.fid || ''), 'FID')}
                      className="text-sm text-gray-900 hover:text-brand-600 font-mono transition-colors flex items-center gap-1"
                    >
                      {profile.fid}
                      <svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                )}

                {/* Custody Address */}
                {profile.custodyAddress && (
                  <div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Farcaster Custody</div>
                    <a
                      href={`https://etherscan.io/address/${profile.custodyAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-secondary-600 hover:underline font-mono flex items-center gap-1 truncate"
                    >
                      {formatAddress(profile.custodyAddress)}
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                )}

                {/* Ethereum Wallets */}
                {profile.verifications && profile.verifications.length > 0 && (
                  <div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Verified Wallets</div>
                    <div className="space-y-1">
                      {profile.verifications.map((address, index) => (
                        <div key={address} className="flex items-center gap-2">
                          <a
                            href={`https://etherscan.io/address/${address}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-secondary-600 hover:underline font-mono flex items-center gap-1 truncate"
                          >
                            {formatAddress(address)}
                          </a>
                          {index === 0 && (
                            <span className="text-[10px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded font-medium">Primary</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
