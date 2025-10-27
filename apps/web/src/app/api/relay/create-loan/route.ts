import { NextRequest, NextResponse } from 'next/server';
import { createWalletClient, createPublicClient, http, parseUnits } from 'viem';
import { baseSepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import { MICROLOAN_FACTORY_ADDRESS } from '@/lib/wagmi';
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
    } = await request.json();

    // Validation
    if (!userAddress || !principal || !termPeriods || !name) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
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
