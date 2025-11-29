import { NextRequest, NextResponse } from 'next/server';
import { createWalletClient, createPublicClient, http, parseUnits, verifyMessage } from 'viem';
import { baseSepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import { MICROLOAN_FACTORY_ADDRESS } from '@/lib/constants';
import MicroLoanFactoryABI from '@/abi/MicroLoanFactory.json';

// Relayer configuration
const RELAYER_PRIVATE_KEY = process.env.RELAYER_PRIVATE_KEY as `0x${string}`;
const MAX_REQUESTS_PER_USER_PER_DAY = 3; // Rate limiting

// Simple in-memory rate limiting (use Redis in production)
const requestCounts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(userAddress: string): boolean {
  const now = Date.now();
  const record = requestCounts.get(userAddress.toLowerCase());

  if (!record || now > record.resetAt) {
    // Reset or create new record
    requestCounts.set(userAddress.toLowerCase(), {
      count: 1,
      resetAt: now + 24 * 60 * 60 * 1000, // 24 hours
    });
    return true;
  }

  if (record.count >= MAX_REQUESTS_PER_USER_PER_DAY) {
    return false;
  }

  record.count += 1;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const {
      userAddress,
      principal,
      termPeriods,
      name,
      description,
      imageUrl,
      businessWebsite,
      signature,
      timestamp,
    } = await request.json();

    // Validation
    if (!userAddress || !principal || !termPeriods || !name || !signature || !timestamp) {
      return NextResponse.json(
        { error: 'Missing required parameters (including signature and timestamp)' },
        { status: 400 }
      );
    }

    // Rate limiting
    if (!checkRateLimit(userAddress)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Maximum 3 loan creations per day.' },
        { status: 429 }
      );
    }

    // Validate address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(userAddress)) {
      return NextResponse.json(
        { error: 'Invalid address format' },
        { status: 400 }
      );
    }

    // Validate amounts
    if (principal <= 0 || termPeriods <= 0) {
      return NextResponse.json(
        { error: 'Invalid loan parameters' },
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
    // Expected message format: "Create loan for {address} at {timestamp}"
    const message = `Create loan for ${userAddress} at ${timestamp}`;

    let isValidSignature = false;
    try {
      isValidSignature = await verifyMessage({
        address: userAddress as `0x${string}`,
        message,
        signature: signature as `0x${string}`,
      });
    } catch (err) {
      console.error('[Relayer] Signature verification error:', err);
      return NextResponse.json(
        { error: 'Invalid signature format' },
        { status: 400 }
      );
    }

    if (!isValidSignature) {
      console.warn('[Relayer] Invalid signature for address:', userAddress);
      return NextResponse.json(
        { error: 'Signature verification failed. You must sign the message to prove wallet ownership.' },
        { status: 403 }
      );
    }

    console.log('[Relayer] ✓ Signature verified for:', userAddress);

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

    console.log('[Relayer] Creating loan for user:', userAddress);
    console.log('[Relayer] Principal:', principal, 'Term Periods:', termPeriods);

    // Submit transaction with relayer paying gas
    const hash = await walletClient.writeContract({
      address: MICROLOAN_FACTORY_ADDRESS,
      abi: MicroLoanFactoryABI.abi,
      functionName: 'createLoan',
      args: [
        userAddress as `0x${string}`,
        BigInt(principal),
        BigInt(termPeriods),
        name,
        description || '',
        imageUrl || '',
        businessWebsite || '',
      ],
    });

    console.log('[Relayer] Transaction submitted:', hash);

    // Wait for confirmation
    const receipt = await publicClient.waitForTransactionReceipt({
      hash,
      timeout: 60000, // 60 second timeout
    });

    console.log('[Relayer] Transaction confirmed. Status:', receipt.status);

    return NextResponse.json({
      success: true,
      txHash: hash,
      status: receipt.status,
      loanAddress: receipt.logs[0]?.address, // The created loan contract address
    });
  } catch (error: any) {
    console.error('[Relayer] Error creating loan:', error);
    return NextResponse.json(
      {
        error: error.message || 'Failed to create loan',
        details: error.shortMessage || error.message,
      },
      { status: 500 }
    );
  }
}
