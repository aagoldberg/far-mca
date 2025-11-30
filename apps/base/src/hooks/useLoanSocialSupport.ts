'use client';

import { useState, useEffect } from 'react';
import { calculateLoanSocialSupport, LoanSocialSupport } from '@/lib/socialProximity';
import { useContributors } from './useMicroLoan';

/**
 * Hook to calculate social support for a loan
 * Measures how well-connected existing lenders are to the borrower
 *
 * @param loanAddress - Address of the loan contract
 * @param borrowerAddress - Ethereum address of the borrower
 * @param maxContributors - Maximum number of contributors to analyze (default: 20)
 * @returns Social support score and loading state
 *
 * @example
 * ```tsx
 * function LoanCard({ loanAddress, borrowerAddress }) {
 *   const { support, isLoading } = useLoanSocialSupport(loanAddress, borrowerAddress);
 *
 *   return (
 *     <div>
 *       {support && (
 *         <div>
 *           {support.supportStrength === 'STRONG' && '🟢 Strong Social Support'}
 *           {support.supportStrength === 'MODERATE' && '🟡 Moderate Support'}
 *           {support.supportStrength === 'WEAK' && '🟠 Limited Support'}
 *           {support.supportStrength === 'NONE' && '⚪ No Social Support'}
 *           <p>{support.lendersWithConnections} of {support.totalLenders} lenders are connected</p>
 *         </div>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export function useLoanSocialSupport(
  loanAddress: `0x${string}` | undefined,
  borrowerAddress: `0x${string}` | undefined,
  maxContributors: number = 20
) {
  const [support, setSupport] = useState<LoanSocialSupport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch contributors for this loan
  const { contributors, totalCount } = useContributors(loanAddress, maxContributors);

  useEffect(() => {
    // Reset if addresses are missing
    if (!loanAddress || !borrowerAddress) {
      setSupport(null);
      setIsLoading(false);
      return;
    }

    // Don't calculate if contributors aren't loaded yet (null/undefined means still loading)
    if (contributors === null || contributors === undefined) {
      setIsLoading(true);
      return;
    }

    // If we have an empty array, that means no contributors yet - still calculate to show "NONE"
    const fetchSupport = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const supportScore = await calculateLoanSocialSupport(
          borrowerAddress,
          contributors as `0x${string}`[]
        );

        setSupport(supportScore);
      } catch (err) {
        console.error('[Loan Social Support Hook] Error:', err);
        setError(err as Error);
        setSupport(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSupport();
  }, [loanAddress, borrowerAddress, contributors]);

  return {
    support,
    isLoading,
    error,
    totalContributors: totalCount,
    hasContributors: (contributors?.length || 0) > 0,
  };
}
