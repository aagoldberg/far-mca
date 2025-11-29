/**
 * Payment Verification Utility
 *
 * Server-side verification of USDC payments to ensure:
 * - Transaction exists and succeeded on-chain
 * - Payment went to the correct recipient address
 * - Amount matches expectations
 * - Prevents replay attacks (same tx used multiple times)
 */

import { createPublicClient, http, decodeEventLog, parseAbi } from 'viem';
import { baseSepolia } from 'viem/chains';
import { USDC_ADDRESS } from '@/lib/constants';

// ERC20 Transfer event ABI
const TRANSFER_EVENT_ABI = parseAbi([
  'event Transfer(address indexed from, address indexed to, uint256 value)',
]);

export interface PaymentVerificationResult {
  isValid: boolean;
  error?: string;
  transactionHash?: string;
  from?: string;
  to?: string;
  amount?: bigint;
  blockNumber?: bigint;
  timestamp?: number;
}

/**
 * In-memory store to prevent replay attacks
 * In production, use Redis or database
 */
const verifiedTransactions = new Map<string, number>();
const TRANSACTION_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Clean up expired transaction records
 */
function cleanupExpiredTransactions() {
  const now = Date.now();
  for (const [txHash, timestamp] of verifiedTransactions.entries()) {
    if (now - timestamp > TRANSACTION_EXPIRY_MS) {
      verifiedTransactions.delete(txHash);
    }
  }
}

/**
 * Verify a USDC payment transaction on-chain
 *
 * @param txHash - Transaction hash to verify
 * @param expectedRecipient - Expected recipient address (loan contract or user)
 * @param expectedAmount - Expected USDC amount (in wei, i.e., with 6 decimals)
 * @param expectedSender - Optional expected sender address
 * @returns Verification result with transaction details
 */
export async function verifyUSDCPayment(
  txHash: string,
  expectedRecipient: string,
  expectedAmount: bigint,
  expectedSender?: string
): Promise<PaymentVerificationResult> {
  try {
    // Clean up old records periodically
    if (Math.random() < 0.01) { // 1% chance to clean up
      cleanupExpiredTransactions();
    }

    // Check if this transaction was already verified (replay attack prevention)
    if (verifiedTransactions.has(txHash.toLowerCase())) {
      return {
        isValid: false,
        error: 'Transaction has already been used. Replay attack prevented.',
      };
    }

    // Create public client
    const publicClient = createPublicClient({
      chain: baseSepolia,
      transport: http(process.env.NEXT_PUBLIC_RPC_URL || 'https://sepolia.base.org'),
    });

    // Get transaction receipt
    const receipt = await publicClient.getTransactionReceipt({
      hash: txHash as `0x${string}`,
    });

    // Verify transaction succeeded
    if (receipt.status !== 'success') {
      return {
        isValid: false,
        error: 'Transaction failed on-chain (reverted)',
        transactionHash: txHash,
      };
    }

    // Find USDC Transfer event in logs
    let transferEvent: {
      from: string;
      to: string;
      value: bigint;
    } | null = null;

    for (const log of receipt.logs) {
      // Only check logs from USDC contract
      if (log.address.toLowerCase() !== USDC_ADDRESS.toLowerCase()) {
        continue;
      }

      try {
        const decoded = decodeEventLog({
          abi: TRANSFER_EVENT_ABI,
          data: log.data,
          topics: log.topics,
        });

        if (decoded.eventName === 'Transfer') {
          transferEvent = {
            from: decoded.args.from as string,
            to: decoded.args.to as string,
            value: decoded.args.value as bigint,
          };
          break; // Found the USDC transfer
        }
      } catch (err) {
        // Not a Transfer event or different signature, continue
        continue;
      }
    }

    // Verify USDC Transfer event exists
    if (!transferEvent) {
      return {
        isValid: false,
        error: 'No USDC transfer found in transaction',
        transactionHash: txHash,
      };
    }

    // Verify recipient matches
    if (transferEvent.to.toLowerCase() !== expectedRecipient.toLowerCase()) {
      return {
        isValid: false,
        error: `Payment sent to wrong address. Expected ${expectedRecipient}, got ${transferEvent.to}`,
        transactionHash: txHash,
        from: transferEvent.from,
        to: transferEvent.to,
        amount: transferEvent.value,
      };
    }

    // Verify amount matches
    if (transferEvent.value !== expectedAmount) {
      return {
        isValid: false,
        error: `Payment amount mismatch. Expected ${expectedAmount.toString()}, got ${transferEvent.value.toString()}`,
        transactionHash: txHash,
        from: transferEvent.from,
        to: transferEvent.to,
        amount: transferEvent.value,
      };
    }

    // Verify sender if provided
    if (expectedSender && transferEvent.from.toLowerCase() !== expectedSender.toLowerCase()) {
      return {
        isValid: false,
        error: `Payment from wrong address. Expected ${expectedSender}, got ${transferEvent.from}`,
        transactionHash: txHash,
        from: transferEvent.from,
        to: transferEvent.to,
        amount: transferEvent.value,
      };
    }

    // Get block to extract timestamp
    const block = await publicClient.getBlock({
      blockNumber: receipt.blockNumber,
    });

    // Mark transaction as verified (prevent replay)
    verifiedTransactions.set(txHash.toLowerCase(), Date.now());

    // All checks passed!
    return {
      isValid: true,
      transactionHash: txHash,
      from: transferEvent.from,
      to: transferEvent.to,
      amount: transferEvent.value,
      blockNumber: receipt.blockNumber,
      timestamp: Number(block.timestamp),
    };

  } catch (error: any) {
    console.error('[Payment Verification] Error:', error);

    // Handle specific errors
    if (error.message?.includes('Transaction not found')) {
      return {
        isValid: false,
        error: 'Transaction not found on blockchain. It may not have been mined yet.',
      };
    }

    return {
      isValid: false,
      error: error.message || 'Failed to verify payment',
    };
  }
}

/**
 * Verify a contribution to a loan contract
 * This is a convenience wrapper around verifyUSDCPayment
 *
 * @param txHash - Transaction hash
 * @param loanAddress - Loan contract address
 * @param contributorAddress - Address of the contributor
 * @param expectedAmount - Expected contribution amount (USDC with 6 decimals)
 */
export async function verifyLoanContribution(
  txHash: string,
  loanAddress: string,
  contributorAddress: string,
  expectedAmount: bigint
): Promise<PaymentVerificationResult> {
  return verifyUSDCPayment(
    txHash,
    loanAddress,
    expectedAmount,
    contributorAddress
  );
}

/**
 * Check if a transaction has already been verified
 */
export function isTransactionAlreadyVerified(txHash: string): boolean {
  return verifiedTransactions.has(txHash.toLowerCase());
}

/**
 * Clear the verified transactions cache
 * Useful for testing or manual cleanup
 */
export function clearVerifiedTransactionsCache(): void {
  verifiedTransactions.clear();
}
