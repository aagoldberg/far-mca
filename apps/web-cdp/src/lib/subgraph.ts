import { getClient } from "@/lib/apollo";
import { gql } from "@apollo/client";

const IPFS_GATEWAY = process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/';

const GET_LOAN_DETAILS = gql`
  query GetLoanDetails($id: ID!) {
    microLoan(id: $id) {
      id
      borrower
      metadataURI
      principal
      dueAt
      fundraisingDeadline
      duration
      fundraisingActive
      active
      completed
      cancelled
      defaulted
      totalFunded
      totalRepaid
      outstandingPrincipal
      createdAt
      fundedAt
      disbursedAt
      completedAt
      contributorsCount
      percentFunded
      percentRepaid
      contributions {
        id
        contributor
        amount
        timestamp
        transactionHash
      }
      repayments {
        id
        payer
        amount
        totalRepaid
        outstanding
        timestamp
        secondsUntilDue
        wasLate
        transactionHash
      }
    }
  }
`;

const GET_ALL_LOANS = gql`
  query GetAllLoans {
    microLoans(orderBy: createdAt, orderDirection: desc) {
      id
      borrower
      metadataURI
      principal
      dueAt
      fundraisingDeadline
      duration
      fundraisingActive
      active
      completed
      cancelled
      defaulted
      totalFunded
      totalRepaid
      outstandingPrincipal
      createdAt
      fundedAt
      disbursedAt
      completedAt
      contributorsCount
      percentFunded
      percentRepaid
    }
  }
`;

const GET_RECENT_ACTIVITY = gql`
  query GetRecentActivity($loanId: String!) {
    contributions(where: { loan: $loanId }, orderBy: timestamp, orderDirection: desc, first: 10) {
      id
      contributor
      amount
      timestamp
      transactionHash
    }
    repayments(where: { loan: $loanId }, orderBy: timestamp, orderDirection: desc, first: 10) {
      id
      payer
      amount
      totalRepaid
      outstanding
      timestamp
      wasLate
      transactionHash
    }
  }
`;

const GET_LENDER_POSITION = gql`
  query GetLenderPosition($loanId: String!, $lender: String!) {
    lenderPosition(id: $loanId) {
      id
      loan {
        id
        borrower
        principal
        dueAt
      }
      lender
      contributed
      claimed
      claimable
      lastUpdated
    }
  }
`;

const GET_GLOBAL_STATS = gql`
  query GetGlobalStats {
    globalStats(id: "global") {
      totalLoans
      activeLoans
      completedLoans
      defaultedLoans
      totalPrincipalFunded
      totalPrincipalRepaid
      totalContributions
      totalRepayments
    }
  }
`;

export async function getLoan(id: string) {
    const { data } = await getClient().query({
        query: GET_LOAN_DETAILS,
        variables: { id: id.toLowerCase() },
    });
    return data.microLoan;
}

export async function getIPFSMetadata(cid: string): Promise<{ title: string; description: string; image: string; } | null> {
    if (!cid) return null;
    try {
        const url = `${IPFS_GATEWAY}${cid.replace('ipfs://', '')}`;
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`Failed to fetch metadata from IPFS: ${response.statusText}`);
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching or parsing IPFS metadata:", error);
        return null;
    }
}

export async function getLoanMetadata(id: string) {
    const loan = await getLoan(id);
    if (!loan || !loan.metadataURI) {
        return null;
    }
    const metadata = await getIPFSMetadata(loan.metadataURI);
    return metadata;
}

export async function getAllLoans() {
    const { data } = await getClient().query({
        query: GET_ALL_LOANS,
        fetchPolicy: 'network-only',
    });
    return data.microLoans;
}

export async function getRecentActivity(loanId: string) {
    const { data } = await getClient().query({
        query: GET_RECENT_ACTIVITY,
        variables: { loanId: loanId.toLowerCase() },
        fetchPolicy: 'network-only',
    });

    // Combine and sort all activity by timestamp
    const allActivity = [
        ...data.contributions.map((c: any) => ({ ...c, type: 'contribution', txHash: c.transactionHash })),
        ...data.repayments.map((r: any) => ({ ...r, type: 'repayment', contributor: r.payer, txHash: r.transactionHash }))
    ].sort((a, b) => parseInt(b.timestamp) - parseInt(a.timestamp));

    return allActivity;
}

export async function getLenderPosition(loanId: string, lender: string) {
    const { data } = await getClient().query({
        query: GET_LENDER_POSITION,
        variables: {
            loanId: loanId.toLowerCase(),
            lender: lender.toLowerCase()
        },
        fetchPolicy: 'network-only',
    });
    return data.lenderPosition;
}

export async function getGlobalStats() {
    const { data } = await getClient().query({
        query: GET_GLOBAL_STATS,
        fetchPolicy: 'network-only',
    });
    return data.globalStats;
} 