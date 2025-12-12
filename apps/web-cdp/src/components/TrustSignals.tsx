'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useFarcasterProfile } from '@/hooks/useFarcasterProfile';
import { useLoanSocialSupport } from '@/hooks/useLoanSocialSupport';
import { useBlueskyProfile } from '@/hooks/useBlueskyProfile';
import { usePublicBorrowerProfile } from '@/hooks/useBorrowerProfile';
import { getSocialSupportDescription } from '@/lib/socialProximity';
import { getLoanStatusDisplay, getRepaymentDisplay } from '@/types/borrowerProfile';
import { ipfsToHttp } from '@/lib/ipfs';

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
  const { profile: borrowerProfile, isLoading: isLoadingBorrowerProfile } = usePublicBorrowerProfile(borrowerAddress);
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
  const hasAnyData = businessWebsite || twitterHandle || (hasContributors && support) || profile || profile?.score || blueskyProfile || borrowerProfile;

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
        {/* Owner Identity (Reputational Collateral) */}
        {borrowerProfile && (
          <div className="border border-brand-200 rounded-xl bg-gradient-to-br from-brand-50/50 to-white overflow-hidden">
            {/* Owner Identity Header */}
            <div className="p-4 flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-brand-200 shadow-sm">
                <Image
                  src={ipfsToHttp(borrowerProfile.ownerPhotoUrl)}
                  alt={borrowerProfile.ownerFullName}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base font-bold text-gray-900">{borrowerProfile.ownerFullName}</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-brand-100 text-brand-700">
                    VERIFIED IDENTITY
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  Business owner has staked their public reputation
                </div>
              </div>
            </div>

            {/* Loan Status & Repayment History */}
            {borrowerProfile.loanHistory.totalLoans > 0 && (
              <div className="border-t border-brand-100 px-4 py-3 bg-white/50">
                <div className="flex items-center justify-between gap-4">
                  {/* Current Status */}
                  <div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Loan Status</div>
                    {(() => {
                      const status = getLoanStatusDisplay(
                        borrowerProfile.loanHistory.currentStatus,
                        borrowerProfile.loanHistory.daysPastDue
                      );
                      return (
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold ${status.bgColor} ${status.color}`}>
                          {status.icon === 'check' && (
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                          {status.icon === 'warning' && (
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                          )}
                          {status.icon === 'error' && (
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                          {status.label}
                        </span>
                      );
                    })()}
                  </div>

                  {/* Repayment History */}
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Repayment Rate</div>
                    {(() => {
                      const repayment = getRepaymentDisplay(
                        borrowerProfile.loanHistory.repaidOnTime,
                        borrowerProfile.loanHistory.totalLoans
                      );
                      return (
                        <div>
                          <span className={`text-sm font-bold ${repayment.color}`}>{repayment.rate}</span>
                          <span className="text-[10px] text-gray-500 ml-1">({repayment.label})</span>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            )}

            {/* Social Proof Badges */}
            {(borrowerProfile.socialProof.googleRating ||
              borrowerProfile.socialProof.instagramFollowers ||
              borrowerProfile.socialProof.linkedinUrl) && (
              <div className="border-t border-brand-100 px-4 py-3 bg-white/30">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Social Proof</div>
                <div className="flex flex-wrap gap-2">
                  {/* Google Rating */}
                  {borrowerProfile.socialProof.googleRating && (
                    <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-white rounded-lg border border-gray-200 text-xs">
                      <svg className="w-3.5 h-3.5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <span className="font-semibold text-gray-900">{borrowerProfile.socialProof.googleRating.toFixed(1)}</span>
                      <span className="text-gray-500">Google</span>
                      {borrowerProfile.socialProof.googleReviewCount && (
                        <span className="text-gray-400">({borrowerProfile.socialProof.googleReviewCount})</span>
                      )}
                    </div>
                  )}

                  {/* Instagram */}
                  {borrowerProfile.socialProof.instagramFollowers && (
                    <a
                      href={borrowerProfile.socialProof.instagramHandle ? `https://instagram.com/${borrowerProfile.socialProof.instagramHandle}` : undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2 py-1 bg-white rounded-lg border border-gray-200 text-xs hover:border-pink-300 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                      <span className="font-semibold text-gray-900">{(borrowerProfile.socialProof.instagramFollowers / 1000).toFixed(1)}K</span>
                      <span className="text-gray-500">followers</span>
                    </a>
                  )}

                  {/* TikTok */}
                  {borrowerProfile.socialProof.tiktokFollowers && (
                    <a
                      href={borrowerProfile.socialProof.tiktokHandle ? `https://tiktok.com/@${borrowerProfile.socialProof.tiktokHandle}` : undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2 py-1 bg-white rounded-lg border border-gray-200 text-xs hover:border-gray-400 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                      </svg>
                      <span className="font-semibold text-gray-900">{(borrowerProfile.socialProof.tiktokFollowers / 1000).toFixed(1)}K</span>
                      <span className="text-gray-500">followers</span>
                    </a>
                  )}

                  {/* LinkedIn */}
                  {borrowerProfile.socialProof.linkedinUrl && (
                    <a
                      href={borrowerProfile.socialProof.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2 py-1 bg-white rounded-lg border border-gray-200 text-xs hover:border-blue-300 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      <span className="text-gray-700">LinkedIn</span>
                    </a>
                  )}

                  {/* Yelp */}
                  {borrowerProfile.socialProof.yelpRating && (
                    <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-white rounded-lg border border-gray-200 text-xs">
                      <svg className="w-3.5 h-3.5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.16 12.594l-4.995 1.433c-.96.276-1.27-.267-1.27-.863v-5.45c0-.743.6-1.204 1.328-1.057l4.937 1.006c.728.147 1.12.738 1.12 1.33v2.332c0 .59-.392 1.27-1.12.269zm-8.437 8.37l-2.482-4.52c-.39-.707-.05-1.232.687-1.232h5.19c.738 0 1.12.525.85 1.17l-1.68 4.49c-.27.645-.77 1.006-1.405 1.006h-1.027c-.635 0-1.133-.268-1.133-.914zm-9.71-11.4l4.995 1.432c.96.276 1.12.79 1.12 1.385v5.45c0 .742-.6 1.203-1.327 1.057l-4.938-1.006c-.727-.148-1.12-.74-1.12-1.33v-5.72c0-.59.392-1.27 1.27-.268zm8.437-8.37l2.483 4.52c.39.706.05 1.232-.687 1.232H6.066c-.738 0-1.12-.525-.85-1.17l1.68-4.49C7.166.64 7.666.28 8.3.28h1.027c.635 0 1.133.268 1.133.914z" />
                      </svg>
                      <span className="font-semibold text-gray-900">{borrowerProfile.socialProof.yelpRating.toFixed(1)}</span>
                      <span className="text-gray-500">Yelp</span>
                      {borrowerProfile.socialProof.yelpReviewCount && (
                        <span className="text-gray-400">({borrowerProfile.socialProof.yelpReviewCount})</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Trust Boost Badge */}
            {borrowerProfile.trustBoostPercent > 0 && (
              <div className="border-t border-brand-100 px-4 py-2 bg-gradient-to-r from-brand-50 to-brand-100/50 flex items-center justify-between">
                <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider">
                  Reputational Collateral Active
                </span>
                <span className="text-xs font-bold text-brand-700">
                  +{borrowerProfile.trustBoostPercent}% visibility boost
                </span>
              </div>
            )}
          </div>
        )}

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
