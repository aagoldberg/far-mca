import { NextRequest, NextResponse } from 'next/server';
import { createWalletClient, createPublicClient, http, parseUnits, verifyMessage } from 'viem';
import { baseSepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import MicroLoanABI from '@/abi/MicroLoan.json';

// Relayer configuration
const RELAYER_PRIVATE_KEY = process.env.RELAYER_PRIVATE_KEY as `0x${string}`;
const MAX_REPAYMENTS_PER_USER_PER_DAY = 20; // Rate limiting

// Simple in-memory rate limiting (use Redis in production)
const repaymentCounts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(userAddress: string): boolean {
  const now = Date.now();
  const record = repaymentCounts.get(userAddress.toLowerCase());

  if (!record || now > record.resetAt) {
    // Reset or create new record
    repaymentCounts.set(userAddress.toLowerCase(), {
      count: 1,
      resetAt: now + 24 * 60 * 60 * 1000, // 24 hours
    });
    return true;
  }

  if (record.count >= MAX_REPAYMENTS_PER_USER_PER_DAY) {
    return false;
  }

  record.count += 1;
  return true;
}

/**
 * Gasless Repayment Endpoint
 * POST /api/relay/repay
 *
 * Allows borrowers (or anyone) to repay loans without paying gas.
 * User must have approved USDC to the loan contract address.
 *
 * Body: {
 *   userAddress: '0x123...',     // Payer address
 *   loanAddress: '0x456...',
 *   amount: '100',               // USDC amount (human readable, e.g., "100" for $100)
 *   signature: '0xabc...',
 *   timestamp: 1700000000000
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const {
      userAddress,
      loanAddress,
      amount,
      signature,
      timestamp,
    } = await request.json();

    // Validation
    if (!userAddress || !loanAddress || !amount || !signature || !timestamp) {
      return NextResponse.json(
        { error: 'Missing required parameters (userAddress, loanAddress, amount, signature, timestamp)' },
        { status: 400 }
      );
    }

    // Rate limiting
    if (!checkRateLimit(userAddress)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Maximum 20 repayments per day.' },
        { status: 429 }
      );
    }

    // Validate address formats
    if (!/^0x[a-fA-F0-9]{40}$/.test(userAddress) || !/^0x[a-fA-F0-9]{40}$/.test(loanAddress)) {
      return NextResponse.json(
        { error: 'Invalid address format' },
        { status: 400 }
      );
    }

    // Validate amount
    if (parseFloat(amount) <= 0) {
      return NextResponse.json(
        { error: 'Invalid repayment amount' },
        { status: 400 }
      );
    }

    // Verify timestamp is recent (within last 5 minutes to prevent replay attacks)
    const now = Date.now();
    const timestampAge = now - timestamp;
    const FIVE_MINUTES_MS = 5 * 60 * 1000;

    if (timestampAge > FIVE_MINUTES_MS || timestampAge < 0) {
      return NextResponse.json(
        { error: 'Request timestamp expired or invalid. Please try again.' },
        { status: 400 }
      );
    }

    // Verify wallet ownership via signature
    // Expected message format: "Repay {amount} USDC to {loanAddress} at {timestamp}"
    const message = `Repay ${amount} USDC to ${loanAddress} at ${timestamp}`;

    let isValidSignature = false;
    try {
      isValidSignature = await verifyMessage({
        address: userAddress as `0x${string}`,
        message,
        signature: signature as `0x${string}`,
      });
    } catch (err) {
      console.error('[Relay/Repay] Signature verification error:', err);
      return NextResponse.json(
        { error: 'Invalid signature format' },
        { status: 400 }
      );
    }

    if (!isValidSignature) {
      console.warn('[Relay/Repay] Invalid signature for address:', userAddress);
      return NextResponse.json(
        { error: 'Signature verification failed. You must sign the message to prove wallet ownership.' },
        { status: 403 }
      );
    }

    console.log('[Relay/Repay] ✓ Signature verified for:', userAddress);

    // Parse amount (USDC has 6 decimals)
    const amountBigInt = parseUnits(amount.toString(), 6);

    // Create relayer wallet client
    const account = privateKeyToAccount(RELAYER_PRIVATE_KEY);
    const walletClient = createWalletClient({
      account,
      chain: baseSepolia,
      transport: http(process.env.NEXT_PUBLIC_RPC_URL),
    });

    const publicClient = createPublicClient({
      chain: baseSepolia,
      transport: http(process.env.NEXT_PUBLIC_RPC_URL),
    });

    console.log('[Relay/Repay] Repaying', amount, 'USDC from', userAddress, 'to loan', loanAddress);

    // Submit transaction with relayer paying gas
    // This calls repayFor(payer, amount) which pulls USDC from the payer
    const hash = await walletClient.writeContract({
      address: loanAddress as `0x${string}`,
      abi: MicroLoanABI.abi,
      functionName: 'repayFor',
      args: [
        userAddress as `0x${string}`,
        amountBigInt,
      ],
    });

    console.log('[Relay/Repay] Transaction submitted:', hash);

    // Wait for confirmation
    const receipt = await publicClient.waitForTransactionReceipt({
      hash,
      timeout: 60000, // 60 second timeout
    });

    console.log('[Relay/Repay] Transaction confirmed. Status:', receipt.status);

    if (receipt.status === 'reverted') {
      return NextResponse.json(
        {
          error: 'Transaction reverted. Please ensure you have approved USDC to the loan contract.',
          txHash: hash,
        },
        { status: 400 }
      );
    }

    // Check if loan was completed by parsing events
    const completedEvent = receipt.logs.find((log) => {
      try {
        // Check if this is a Completed event
        return log.topics[0] === '0x58e1c447b3273a9ee2d3c3b91dfb97e8c3ed0c5e5d25e1d32c6a6db4f8ad31e0'; // Completed event signature
      } catch {
        return false;
      }
    });

    return NextResponse.json({
      success: true,
      txHash: hash,
      status: receipt.status,
      blockNumber: receipt.blockNumber.toString(),
      loanCompleted: !!completedEvent,
    });
  } catch (error: any) {
    console.error('[Relay/Repay] Error processing repayment:', error);

    // Provide helpful error messages
    let errorMessage = error.message || 'Failed to process repayment';

    if (error.message?.includes('insufficient allowance')) {
      errorMessage = 'Insufficient USDC allowance. Please approve USDC to the loan contract first.';
    } else if (error.message?.includes('insufficient funds')) {
      errorMessage = 'Insufficient USDC balance.';
    } else if (error.message?.includes('NotActive')) {
      errorMessage = 'Loan is not active. It may not have been disbursed yet.';
    } else if (error.message?.includes('AlreadyCompleted')) {
      errorMessage = 'This loan has already been fully repaid.';
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: error.shortMessage || error.message,
      },
      { status: 500 }
    );
  }
}
