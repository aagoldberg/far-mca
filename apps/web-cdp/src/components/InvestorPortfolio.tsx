'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { formatUnits } from 'viem';
import Link from 'next/link';
import { useLoans, useContribution, useLoanData, useClaim } from '@/hooks/useMicroLoan';
import { USDC_DECIMALS } from '@/types/loan';
import {
  BriefcaseIcon,
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  CheckBadgeIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';

interface LoanMetadata {
  name?: string;
  description?: string;
  image?: string;
}

interface ContributionWithLoan {
  loanAddress: `0x${string}`;
  amount: bigint;
  claimable: bigint;
  loanActive: boolean;
  loanCompleted: boolean;
  metadata?: LoanMetadata;
}

export const InvestorPortfolio = () => {
  const { address } = useAccount();
  const { loanAddresses, isLoading: loansLoading } = useLoans();
  const [contributions, setContributions] = useState<ContributionWithLoan[]>([]);
  const [isLoadingContributions, setIsLoadingContributions] = useState(true);
  const { claim, isPending: isClaimPending, isSuccess: isClaimSuccess } = useClaim();

  // Fetch contributions for all loans
  useEffect(() => {
    if (!address || !loanAddresses || loanAddresses.length === 0 || loansLoading) {
      setIsLoadingContributions(false);
      return;
    }

    const fetchContributions = async () => {
      setIsLoadingContributions(true);
      const userContributions: ContributionWithLoan[] = [];

      for (const loanAddress of loanAddresses) {
        try {
          // Fetch contribution data directly using wagmi hooks would require
          // complex dynamic hook calls, so we use window.ethereum directly
          const { createPublicClient, http } = await import('viem');
          const { baseSepolia } = await import('viem/chains');
          const MicroLoanABI = (await import('@/abi/MicroLoan.json')).default;

          const client = createPublicClient({
            chain: baseSepolia,
            transport: http(),
          });

          const [contributionAmount, claimableAmount, loanActive, loanCompleted] = await Promise.all([
            client.readContract({
              address: loanAddress,
              abi: MicroLoanABI.abi,
              functionName: 'contributions',
              args: [address],
            }),
            client.readContract({
              address: loanAddress,
              abi: MicroLoanABI.abi,
              functionName: 'claimableAmount',
              args: [address],
            }),
            client.readContract({
              address: loanAddress,
              abi: MicroLoanABI.abi,
              functionName: 'active',
            }),
            client.readContract({
              address: loanAddress,
              abi: MicroLoanABI.abi,
              functionName: 'completed',
            }),
          ]);

          if (contributionAmount && contributionAmount > 0n) {
            userContributions.push({
              loanAddress,
              amount: contributionAmount as bigint,
              claimable: claimableAmount as bigint,
              loanActive: loanActive as boolean,
              loanCompleted: loanCompleted as boolean,
            });
          }
        } catch (error) {
          console.error(`Error fetching contribution for ${loanAddress}:`, error);
        }
      }

      setContributions(userContributions);
      setIsLoadingContributions(false);
    };

    fetchContributions();
  }, [address, loanAddresses, loansLoading]);

  // Calculate portfolio metrics
  const totalContributed = contributions.reduce((sum, c) => sum + c.amount, 0n);
  const totalClaimable = contributions.reduce((sum, c) => sum + c.claimable, 0n);
  const activeLoansCount = contributions.filter(c => c.loanActive).length;
  const completedLoansCount = contributions.filter(c => c.loanCompleted).length;

  const formatUSDC = (amount: bigint): string => {
    const value = parseFloat(formatUnits(amount, USDC_DECIMALS));
    return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  if (!address) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Wallet Not Connected</h2>
          <p className="text-gray-600">
            Please connect your wallet to view your portfolio
          </p>
        </div>
      </div>
    );
  }

  if (loansLoading || isLoadingContributions) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-64 bg-gray-200 rounded-2xl" />
          <div className="h-96 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Portfolio Overview */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <BriefcaseIcon className="w-6 h-6 text-[#3B9B7F]" />
          Your Impact
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border-2 border-gray-100 rounded-xl p-4 hover:border-[#3B9B7F] transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 font-medium">Lives Supported</span>
              <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                <BanknotesIcon className="w-5 h-5 text-[#3B9B7F]" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              ${formatUSDC(totalContributed)}
            </p>
            <p className="text-xs text-gray-500">Given with care</p>
          </div>

          <div className="bg-white border-2 border-gray-100 rounded-xl p-4 hover:border-blue-500 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 font-medium">Ready to Reclaim</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <ArrowTrendingUpIcon className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              ${formatUSDC(totalClaimable)}
            </p>
            <p className="text-xs text-gray-500">Paid back, no interest</p>
          </div>

          <div className="bg-white border-2 border-gray-100 rounded-xl p-4 hover:border-purple-500 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 font-medium">Dreams in Progress</span>
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                <ClockIcon className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {activeLoansCount}
            </p>
            <p className="text-xs text-gray-500">Growing stronger</p>
          </div>

          <div className="bg-white border-2 border-gray-100 rounded-xl p-4 hover:border-orange-500 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 font-medium">Dreams Realized</span>
              <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                <CheckBadgeIcon className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {completedLoansCount}
            </p>
            <p className="text-xs text-gray-500">Success stories</p>
          </div>
        </div>
      </div>

      {/* Claim All Button */}
      {totalClaimable > 0n && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Your Support Has Been Repaid</h3>
              <p className="text-sm text-gray-600">
                ${formatUSDC(totalClaimable)} USDC is ready for you to reclaim - the full amount you lent, returned with gratitude
              </p>
            </div>
            <button
              onClick={() => {
                // Claim from all loans with claimable amounts
                contributions
                  .filter(c => c.claimable > 0n)
                  .forEach(c => {
                    setTimeout(() => claim(c.loanAddress), 100);
                  });
              }}
              disabled={isClaimPending}
              className="px-6 py-3 bg-[#3B9B7F] hover:bg-[#2E7D68] text-white font-semibold rounded-xl transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {isClaimPending ? 'Claiming...' : 'Reclaim All'}
            </button>
          </div>
        </div>
      )}

      {/* Contributions List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">People You've Helped</h3>

        {contributions.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
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
            <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Make a Difference?</h3>
            <p className="text-gray-600 mb-6">
              You haven't supported any neighbors yet. Start changing lives with interest-free loans - every dollar helps someone build their dream.
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-[#3B9B7F] hover:bg-[#2E7D68] text-white font-semibold rounded-xl transition-colors"
            >
              Find Ways to Help
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loan
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    You Lent
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Repaid to You
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {contributions.map(contribution => (
                  <ContributionRow
                    key={contribution.loanAddress}
                    contribution={contribution}
                    onClaim={claim}
                    isClaimPending={isClaimPending}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Success Message */}
      {isClaimSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-50 border border-green-200 rounded-xl p-4 shadow-lg animate-in slide-in-from-bottom-10 fade-in-25">
          <div className="flex items-center gap-2">
            <CheckBadgeIcon className="w-5 h-5 text-green-600" />
            <p className="text-green-900 font-medium">Successfully reclaimed!</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Individual contribution row component
function ContributionRow({
  contribution,
  onClaim,
  isClaimPending,
}: {
  contribution: ContributionWithLoan;
  onClaim: (loanAddress: `0x${string}`) => void;
  isClaimPending: boolean;
}) {
  const { loanData } = useLoanData(contribution.loanAddress);
  const [metadata, setMetadata] = useState<LoanMetadata | null>(null);

  useEffect(() => {
    if (loanData?.metadataURI) {
      const metadataUrl = loanData.metadataURI.startsWith('ipfs://')
        ? `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${loanData.metadataURI.replace('ipfs://', '')}`
        : loanData.metadataURI;

      fetch(metadataUrl)
        .then(res => res.json())
        .then(data => {
          // Convert IPFS image URLs to gateway URLs
          if (data.image && data.image.startsWith('ipfs://')) {
            data.image = `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${data.image.replace('ipfs://', '')}`;
          }
          setMetadata(data);
        })
        .catch(err => console.error('Error loading metadata:', err));
    }
  }, [loanData?.metadataURI]);

  const formatUSDC = (amount: bigint): string => {
    const value = parseFloat(formatUnits(amount, USDC_DECIMALS));
    return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-4">
        <Link
          href={`/loan/${contribution.loanAddress}`}
          className="flex items-center gap-3 group"
        >
          {metadata?.image && (
            <img
              src={metadata.image}
              alt={metadata.name || 'Loan'}
              className="w-12 h-12 rounded-lg object-cover"
            />
          )}
          <div>
            <p className="font-medium text-gray-900 group-hover:text-[#3B9B7F]">
              {metadata?.name || 'Loading...'}
            </p>
            <p className="text-xs text-gray-500 font-mono">
              {contribution.loanAddress.slice(0, 6)}...{contribution.loanAddress.slice(-4)}
            </p>
          </div>
        </Link>
      </td>
      <td className="px-4 py-4">
        <p className="font-medium text-gray-900">${formatUSDC(contribution.amount)}</p>
        <p className="text-xs text-gray-500">USDC</p>
      </td>
      <td className="px-4 py-4">
        {contribution.loanCompleted && (
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            Completed
          </span>
        )}
        {contribution.loanActive && !contribution.loanCompleted && (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
            Active
          </span>
        )}
        {!contribution.loanActive && !contribution.loanCompleted && (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
            Fundraising
          </span>
        )}
      </td>
      <td className="px-4 py-4">
        <p className="font-medium text-gray-900">${formatUSDC(contribution.claimable)}</p>
        {contribution.claimable > 0n && (
          <p className="text-xs text-green-600">Ready to claim</p>
        )}
      </td>
      <td className="px-4 py-4">
        {contribution.claimable > 0n ? (
          <button
            onClick={() => onClaim(contribution.loanAddress)}
            disabled={isClaimPending}
            className="px-4 py-2 bg-[#3B9B7F] hover:bg-[#2E7D68] text-white text-sm font-medium rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Claim
          </button>
        ) : (
          <Link
            href={`/loan/${contribution.loanAddress}`}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors inline-block"
          >
            View
          </Link>
        )}
      </td>
    </tr>
  );
}
