import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';

const publicClient = createPublicClient({
  chain: base,
  transport: http()
});

export interface WalletActivityScore {
  score: number; // 0-100
  metrics: {
    accountAge: number; // days since first transaction
    transactionCount: number;
    recentActivity: boolean; // active in last 30 days
    balance: bigint;
    hasTransactions: boolean;
  };
  breakdown: {
    ageScore: number; // 0-30 points
    activityScore: number; // 0-30 points
    recentScore: number; // 0-20 points
    balanceScore: number; // 0-20 points
  };
}

/**
 * Analyzes wallet activity and calculates a trust score
 * Score breakdown:
 * - Account Age (0-30 points): Older accounts are more trustworthy
 *   - < 7 days: 0 points
 *   - 7-30 days: 10 points
 *   - 30-90 days: 20 points
 *   - > 90 days: 30 points
 * - Activity Level (0-30 points): Based on transaction count
 *   - 0 txs: 0 points
 *   - 1-5 txs: 10 points
 *   - 6-20 txs: 20 points
 *   - > 20 txs: 30 points
 * - Recent Activity (0-20 points): Active in last 30 days
 *   - Yes: 20 points
 *   - No: 0 points
 * - Balance (0-20 points): Has funds in wallet
 *   - 0: 0 points
 *   - > 0: 20 points
 */
export async function analyzeWalletActivity(
  address: `0x${string}`
): Promise<WalletActivityScore> {
  try {
    // Get current balance
    const balance = await publicClient.getBalance({ address });

    // For Base chain, we'll use a simplified analysis since we can't easily
    // get full transaction history without an indexer API
    // In production, you'd use Basescan API or an indexer like Alchemy/Moralis

    // Get transaction count (nonce) as a proxy for activity
    const transactionCount = await publicClient.getTransactionCount({ address });

    // Get the latest block to check recent activity
    const latestBlock = await publicClient.getBlockNumber();

    // Simple heuristic: if they have a non-zero balance or transaction count,
    // they're likely somewhat active. In production, you'd check actual transaction dates.
    const hasTransactions = transactionCount > 0;
    const recentActivity = hasTransactions && balance > 0n;

    // Estimate account age (this is a simplification - in production,
    // you'd fetch the block number of the first transaction and calculate actual age)
    // For now, we'll use transaction count as a proxy for age/activity
    const estimatedAge = Math.min(transactionCount * 3, 365); // rough estimate

    // Calculate scores
    let ageScore = 0;
    if (estimatedAge < 7) {
      ageScore = 0;
    } else if (estimatedAge < 30) {
      ageScore = 10;
    } else if (estimatedAge < 90) {
      ageScore = 20;
    } else {
      ageScore = 30;
    }

    let activityScore = 0;
    if (transactionCount === 0) {
      activityScore = 0;
    } else if (transactionCount <= 5) {
      activityScore = 10;
    } else if (transactionCount <= 20) {
      activityScore = 20;
    } else {
      activityScore = 30;
    }

    const recentScore = recentActivity ? 20 : 0;
    const balanceScore = balance > 0n ? 20 : 0;

    const totalScore = ageScore + activityScore + recentScore + balanceScore;

    return {
      score: totalScore,
      metrics: {
        accountAge: estimatedAge,
        transactionCount,
        recentActivity,
        balance,
        hasTransactions,
      },
      breakdown: {
        ageScore,
        activityScore,
        recentScore,
        balanceScore,
      },
    };
  } catch (error) {
    console.error('Error analyzing wallet activity:', error);
    // Return a neutral score if analysis fails
    return {
      score: 0,
      metrics: {
        accountAge: 0,
        transactionCount: 0,
        recentActivity: false,
        balance: 0n,
        hasTransactions: false,
      },
      breakdown: {
        ageScore: 0,
        activityScore: 0,
        recentScore: 0,
        balanceScore: 0,
      },
    };
  }
}

/**
 * Enhanced version using Basescan API for more accurate analysis
 * Requires NEXT_PUBLIC_BASESCAN_API_KEY environment variable
 */
export async function analyzeWalletActivityWithAPI(
  address: `0x${string}`
): Promise<WalletActivityScore> {
  const apiKey = process.env.NEXT_PUBLIC_BASESCAN_API_KEY;

  if (!apiKey) {
    // Fall back to basic analysis if no API key
    return analyzeWalletActivity(address);
  }

  try {
    // Fetch transaction history from Basescan
    const txResponse = await fetch(
      `https://api.basescan.org/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`
    );
    const txData = await txResponse.json();

    if (txData.status !== '1' || !Array.isArray(txData.result)) {
      // Fall back to basic analysis
      return analyzeWalletActivity(address);
    }

    const transactions = txData.result;
    const transactionCount = transactions.length;

    // Calculate account age from first transaction
    const firstTx = transactions[0];
    const firstTxTimestamp = parseInt(firstTx?.timeStamp || '0');
    const accountAgeMs = Date.now() - (firstTxTimestamp * 1000);
    const accountAgeDays = Math.floor(accountAgeMs / (1000 * 60 * 60 * 24));

    // Check recent activity (last 30 days)
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const recentActivity = transactions.some((tx: any) =>
      parseInt(tx.timeStamp) * 1000 > thirtyDaysAgo
    );

    // Get current balance
    const balance = await publicClient.getBalance({ address });

    // Calculate scores
    let ageScore = 0;
    if (accountAgeDays < 7) {
      ageScore = 0;
    } else if (accountAgeDays < 30) {
      ageScore = 10;
    } else if (accountAgeDays < 90) {
      ageScore = 20;
    } else {
      ageScore = 30;
    }

    let activityScore = 0;
    if (transactionCount === 0) {
      activityScore = 0;
    } else if (transactionCount <= 5) {
      activityScore = 10;
    } else if (transactionCount <= 20) {
      activityScore = 20;
    } else {
      activityScore = 30;
    }

    const recentScore = recentActivity ? 20 : 0;
    const balanceScore = balance > 0n ? 20 : 0;

    const totalScore = ageScore + activityScore + recentScore + balanceScore;

    return {
      score: totalScore,
      metrics: {
        accountAge: accountAgeDays,
        transactionCount,
        recentActivity,
        balance,
        hasTransactions: transactionCount > 0,
      },
      breakdown: {
        ageScore,
        activityScore,
        recentScore,
        balanceScore,
      },
    };
  } catch (error) {
    console.error('Error analyzing wallet activity with API:', error);
    // Fall back to basic analysis
    return analyzeWalletActivity(address);
  }
}
