import { NextRequest, NextResponse } from 'next/server';
import { createWalletClient, createPublicClient, http, parseUnits, verifyMessage, formatUnits } from 'viem';
import { baseSepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import MicroLoanABI from '@/abi/MicroLoan.json';
import { notifyContribution, notifyFullyFunded, getFidFromAddress } from '@/lib/notifications';

// Relayer configuration
const RELAYER_PRIVATE_KEY = process.env.RELAYER_PRIVATE_KEY as `0x${string}`;
const MAX_CONTRIBUTIONS_PER_USER_PER_DAY = 10; // Rate limiting

// Simple in-memory rate limiting (use Redis in production)
const contributionCounts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(userAddress: string): boolean {
  const now = Date.now();
  const record = contributionCounts.get(userAddress.toLowerCase());

  if (!record || now > record.resetAt) {
    // Reset or create new record
    contributionCounts.set(userAddress.toLowerCase(), {
      count: 1,
      resetAt: now + 24 * 60 * 60 * 1000, // 24 hours
    });
    return true;
  }

  if (record.count >= MAX_CONTRIBUTIONS_PER_USER_PER_DAY) {
    return false;
  }

  record.count += 1;
  return true;
}

/**
 * Gasless Contribution Endpoint
 * POST /api/relay/contribute
 *
 * Allows users to contribute USDC to a loan without paying gas.
 * User must have approved USDC to the loan contract address.
 *
 * Body: {
 *   userAddress: '0x123...',
 *   loanAddress: '0x456...',
 *   amount: '100',              // USDC amount (human readable, e.g., "100" for $100)
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
        { error: 'Rate limit exceeded. Maximum 10 contributions per day.' },
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
        { error: 'Invalid contribution amount' },
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
    // Expected message format: "Contribute {amount} USDC to {loanAddress} at {timestamp}"
    const message = `Contribute ${amount} USDC to ${loanAddress} at ${timestamp}`;

    let isValidSignature = false;
    try {
      isValidSignature = await verifyMessage({
        address: userAddress as `0x${string}`,
        message,
        signature: signature as `0x${string}`,
      });
    } catch (err) {
      console.error('[Relay/Contribute] Signature verification error:', err);
      return NextResponse.json(
        { error: 'Invalid signature format' },
        { status: 400 }
      );
    }

    if (!isValidSignature) {
      console.warn('[Relay/Contribute] Invalid signature for address:', userAddress);
      return NextResponse.json(
        { error: 'Signature verification failed. You must sign the message to prove wallet ownership.' },
        { status: 403 }
      );
    }

    console.log('[Relay/Contribute] ✓ Signature verified for:', userAddress);

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

    console.log('[Relay/Contribute] Contributing', amount, 'USDC from', userAddress, 'to loan', loanAddress);

    // Submit transaction with relayer paying gas
    // This calls contributeFor(contributor, amount) which pulls USDC from the contributor
    const hash = await walletClient.writeContract({
      address: loanAddress as `0x${string}`,
      abi: MicroLoanABI.abi,
      functionName: 'contributeFor',
      args: [
        userAddress as `0x${string}`,
        amountBigInt,
      ],
    });

    console.log('[Relay/Contribute] Transaction submitted:', hash);

    // Wait for confirmation
    const receipt = await publicClient.waitForTransactionReceipt({
      hash,
      timeout: 60000, // 60 second timeout
    });

    console.log('[Relay/Contribute] Transaction confirmed. Status:', receipt.status);

    if (receipt.status === 'reverted') {
      return NextResponse.json(
        {
          error: 'Transaction reverted. Please ensure you have approved USDC to the loan contract.',
          txHash: hash,
        },
        { status: 400 }
      );
    }

    // Send notifications in the background (don't block the response)
    (async () => {
      try {
        // Get loan data for notification
        const [borrower, principal, totalFunded, metadataURI] = await Promise.all([
          publicClient.readContract({
            address: loanAddress as `0x${string}`,
            abi: MicroLoanABI.abi,
            functionName: 'borrower',
          }) as Promise<`0x${string}`>,
          publicClient.readContract({
            address: loanAddress as `0x${string}`,
            abi: MicroLoanABI.abi,
            functionName: 'principal',
          }) as Promise<bigint>,
          publicClient.readContract({
            address: loanAddress as `0x${string}`,
            abi: MicroLoanABI.abi,
            functionName: 'totalFunded',
          }) as Promise<bigint>,
          publicClient.readContract({
            address: loanAddress as `0x${string}`,
            abi: MicroLoanABI.abi,
            functionName: 'metadataURI',
          }) as Promise<string>,
        ]);

        // Get borrower's FID
        const borrowerFid = await getFidFromAddress(borrower);
        if (!borrowerFid) {
          console.log('[Notifications] Borrower has no Farcaster account - skipping notification');
          return;
        }

        // Try to get contributor name from Farcaster
        let contributorName = `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;
        const contributorFid = await getFidFromAddress(userAddress);
        if (contributorFid) {
          // Could fetch username here, but keeping simple for now
          contributorName = `FID:${contributorFid}`;
        }

        // Parse loan title from metadata (simplified - assumes IPFS gateway)
        let loanTitle = 'Your loan';
        try {
          if (metadataURI.startsWith('ipfs://')) {
            const ipfsHash = metadataURI.replace('ipfs://', '');
            const metaResponse = await fetch(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`);
            if (metaResponse.ok) {
              const metadata = await metaResponse.json();
              loanTitle = metadata.name || loanTitle;
            }
          }
        } catch (e) {
          console.log('[Notifications] Could not fetch loan metadata:', e);
        }

        const goal = formatUnits(principal, 6);
        const newTotal = formatUnits(totalFunded, 6);
        const isFullyFunded = totalFunded >= principal;

        // Send contribution notification
        await notifyContribution({
          borrowerFid,
          contributorName,
          amount,
          loanAddress,
          loanTitle,
          newTotal,
          goal,
        });

        // If fully funded, send that notification too
        if (isFullyFunded) {
          await notifyFullyFunded({
            borrowerFid,
            loanAddress,
            loanTitle,
            totalAmount: goal,
          });
        }
      } catch (notifyError) {
        console.error('[Notifications] Error sending notifications:', notifyError);
      }
    })();

    return NextResponse.json({
      success: true,
      txHash: hash,
      status: receipt.status,
      blockNumber: receipt.blockNumber.toString(),
    });
  } catch (error: any) {
    console.error('[Relay/Contribute] Error processing contribution:', error);

    // Provide helpful error messages
    let errorMessage = error.message || 'Failed to process contribution';

    if (error.message?.includes('insufficient allowance')) {
      errorMessage = 'Insufficient USDC allowance. Please approve USDC to the loan contract first.';
    } else if (error.message?.includes('insufficient funds')) {
      errorMessage = 'Insufficient USDC balance.';
    } else if (error.message?.includes('FundraisingNotActive')) {
      errorMessage = 'Fundraising is not active for this loan.';
    } else if (error.message?.includes('FundraisingEnded')) {
      errorMessage = 'Fundraising period has ended.';
    } else if (error.message?.includes('GoalExceeded')) {
      errorMessage = 'This contribution would exceed the funding goal.';
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
