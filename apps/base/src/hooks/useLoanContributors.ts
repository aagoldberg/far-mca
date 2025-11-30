'use client';

import { useState, useEffect } from 'react';
import { getClient } from '@/lib/apollo';
import { gql } from '@apollo/client';
import { neynarClient } from '@/lib/neynar';

export interface Contributor {
  id: string;
  address: string;
  amount: bigint;
  timestamp: number;
  transactionHash: string;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
}

const GET_LOAN_CONTRIBUTORS = gql`
  query GetLoanContributors($id: ID!) {
    microLoan(id: $id) {
      id
      contributions {
        id
        contributor
        amount
        timestamp
        transactionHash
      }
    }
  }
`;

/**
 * Hook to fetch all contributors for a specific loan from the subgraph
 */
export function useLoanContributors(loanAddress: `0x${string}`) {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!loanAddress) {
      setIsLoading(false);
      return;
    }

    async function fetchContributors() {
      try {
        setIsLoading(true);
        const client = getClient();
        const { data } = await client.query({
          query: GET_LOAN_CONTRIBUTORS,
          variables: { id: loanAddress.toLowerCase() },
          fetchPolicy: 'network-only',
        });

        if (data?.microLoan?.contributions) {
          const contributorsList = data.microLoan.contributions.map((c: any) => ({
            id: c.id,
            address: c.contributor,
            amount: BigInt(c.amount),
            timestamp: parseInt(c.timestamp),
            transactionHash: c.transactionHash,
          }));

          setContributors(contributorsList);

          // Fetch Farcaster profiles for all contributor addresses
          if (neynarClient.isEnabled() && contributorsList.length > 0) {
            try {
              const addresses = contributorsList.map(c => c.address);
              const profiles = await neynarClient.fetchBulkUsers(addresses);

              if (profiles?.users) {
                // Map Farcaster data to contributors
                const updatedContributors = contributorsList.map(contributor => {
                  // Find matching Farcaster profile by address
                  const profile = profiles.users.find((user: any) =>
                    user.verified_addresses?.eth_addresses?.some((addr: string) =>
                      addr.toLowerCase() === contributor.address.toLowerCase()
                    )
                  );

                  if (profile) {
                    return {
                      ...contributor,
                      username: profile.username,
                      displayName: profile.display_name,
                      pfpUrl: profile.pfp_url,
                    };
                  }

                  return contributor;
                });

                setContributors(updatedContributors);
              }
            } catch (err) {
              console.error('Error fetching Farcaster profiles:', err);
              // Keep the contributors without Farcaster data
            }
          }
        } else {
          setContributors([]);
        }
      } catch (err) {
        console.error('Error fetching contributors:', err);
        setError(err as Error);
        setContributors([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchContributors();
  }, [loanAddress]);

  return {
    contributors,
    isLoading,
    error,
  };
}
