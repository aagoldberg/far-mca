import { NextRequest, NextResponse } from 'next/server';
import { createWalletClient, createPublicClient, http, verifyMessage } from 'viem';
import { baseSepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import MicroLoanABI from '@/abi/MicroLoan.json';

// Relayer configuration
const RELAYER_PRIVATE_KEY = process.env.RELAYER_PRIVATE_KEY as `0x${string}`;
const MAX_CLAIMS_PER_USER_PER_DAY = 20; // Rate limiting

// Simple in-memory rate limiting (use Redis in production)
const claimCounts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(userAddress: string): boolean {
  const now = Date.now();
  const record = claimCounts.get(userAddress.toLowerCase());

  if (!record || now > record.resetAt) {
    // Reset or create new record
    claimCounts.set(userAddress.toLowerCase(), {
      count: 1,
      resetAt: now + 24 * 60 * 60 * 1000, // 24 hours
    });
    return true;
  }

  if (record.count >= MAX_CLAIMS_PER_USER_PER_DAY) {
    return false;
  }

  record.count += 1;
  return true;
}

/**
 * Gasless Claim Endpoint
 * POST /api/relay/claim
 *
 * Allows lenders to claim their repaid principal without paying gas.
 * Fully gasless - no approvals needed since USDC is sent TO the user.
 *
 * Body: {
 *   userAddress: '0x123...',     // Contributor address
 *   loanAddress: '0x456...',
 *   signature: '0xabc...',
 *   timestamp: 1700000000000
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const {
      userAddress,
      loanAddress,
      signature,
      timestamp,
    } = await request.json();

    // Validation
    if (!userAddress || !loanAddress || !signature || !timestamp) {
      return NextResponse.json(
        { error: 'Missing required parameters (userAddress, loanAddress, signature, timestamp)' },
        { status: 400 }
      );
    }

    // Rate limiting
    if (!checkRateLimit(userAddress)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Maximum 20 claims per day.' },
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
    // Expected message format: "Claim from {loanAddress} at {timestamp}"
    const message = `Claim from ${loanAddress} at ${timestamp}`;

    let isValidSignature = false;
    try {
      isValidSignature = await verifyMessage({
        address: userAddress as `0x${string}`,
        message,
        signature: signature as `0x${string}`,
      });
    } catch (err) {
      console.error('[Relay/Claim] Signature verification error:', err);
      return NextResponse.json(
        { error: 'Invalid signature format' },
        { status: 400 }
      );
    }

    if (!isValidSignature) {
      console.warn('[Relay/Claim] Invalid signature for address:', userAddress);
      return NextResponse.json(
        { error: 'Signature verification failed. You must sign the message to prove wallet ownership.' },
        { status: 403 }
      );
    }

    console.log('[Relay/Claim] ✓ Signature verified for:', userAddress);

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

    // First, check claimable amount to provide better error messages
    const claimableAmount = await publicClient.readContract({
      address: loanAddress as `0x${string}`,
      abi: MicroLoanABI.abi,
      functionName: 'claimableAmount',
      args: [userAddress as `0x${string}`],
    });

    console.log('[Relay/Claim] Claimable amount for', userAddress, ':', claimableAmount);

    if (claimableAmount === 0n) {
      return NextResponse.json(
        { error: 'No funds available to claim. The loan may not have received any repayments yet.' },
        { status: 400 }
      );
    }

    console.log('[Relay/Claim] Claiming from loan', loanAddress, 'for user', userAddress);

    // Submit transaction with relayer paying gas
    // This calls claimFor(contributor) which sends USDC to the contributor
    const hash = await walletClient.writeContract({
      address: loanAddress as `0x${string}`,
      abi: MicroLoanABI.abi,
      functionName: 'claimFor',
      args: [userAddress as `0x${string}`],
    });

    console.log('[Relay/Claim] Transaction submitted:', hash);

    // Wait for confirmation
    const receipt = await publicClient.waitForTransactionReceipt({
      hash,
      timeout: 60000, // 60 second timeout
    });

    console.log('[Relay/Claim] Transaction confirmed. Status:', receipt.status);

    if (receipt.status === 'reverted') {
      return NextResponse.json(
        {
          error: 'Transaction reverted. This might happen if there are no funds to claim.',
          txHash: hash,
        },
        { status: 400 }
      );
    }

    // Parse the Claimed event to get the exact amount claimed
    let claimedAmount = '0';
    try {
      const claimedEvent = receipt.logs.find((log) => {
        // Claimed event signature: Claimed(address indexed contributor, uint256 amount)
        return log.topics[0] === '0x0f5bb82176feb1b5e747e28471aa92156a04d9f3ab9f45f28e2d704232b93f75';
      });

      if (claimedEvent && claimedEvent.data) {
        // The amount is in the data field (not indexed)
        const amountBigInt = BigInt(claimedEvent.data);
        claimedAmount = (Number(amountBigInt) / 1e6).toString(); // Convert from 6 decimals to human readable
      }
    } catch (err) {
      console.warn('[Relay/Claim] Could not parse claimed amount:', err);
    }

    return NextResponse.json({
      success: true,
      txHash: hash,
      status: receipt.status,
      blockNumber: receipt.blockNumber.toString(),
      claimedAmount, // USDC amount claimed (human readable)
    });
  } catch (error: any) {
    console.error('[Relay/Claim] Error processing claim:', error);

    // Provide helpful error messages
    let errorMessage = error.message || 'Failed to process claim';

    if (error.message?.includes('NoReturnsAvailable')) {
      errorMessage = 'No funds available to claim. The loan may not have received any repayments yet.';
    } else if (error.message?.includes('execution reverted')) {
      errorMessage = 'Transaction reverted. You may not have any claimable funds.';
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
