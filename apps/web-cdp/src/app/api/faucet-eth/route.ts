import { NextRequest, NextResponse } from 'next/server';
import { createWalletClient, createPublicClient, http, parseEther } from 'viem';
import { baseSepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

// Faucet configuration
const FAUCET_PRIVATE_KEY = process.env.TEST_WALLET_PRIVATE_KEY as `0x${string}`;
const ETH_AMOUNT = '0.01'; // Send 0.01 ETH per request

export async function POST(request: NextRequest) {
  try {
    const { recipientAddress } = await request.json();

    if (!recipientAddress) {
      return NextResponse.json({ error: 'Recipient address required' }, { status: 400 });
    }

    // Validate address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(recipientAddress)) {
      return NextResponse.json({ error: 'Invalid address format' }, { status: 400 });
    }

    // Create wallet client for sending transactions
    const account = privateKeyToAccount(FAUCET_PRIVATE_KEY);
    const walletClient = createWalletClient({
      account,
      chain: baseSepolia,
      transport: http(process.env.NEXT_PUBLIC_RPC_URL),
    });

    const publicClient = createPublicClient({
      chain: baseSepolia,
      transport: http(process.env.NEXT_PUBLIC_RPC_URL),
    });

    // Check faucet balance first
    const balance = await publicClient.getBalance({ address: account.address });
    const amountToSend = parseEther(ETH_AMOUNT);

    if (balance < amountToSend) {
      return NextResponse.json({ error: 'Faucet is empty, please refill' }, { status: 503 });
    }

    // Get the current nonce to avoid conflicts
    const nonce = await publicClient.getTransactionCount({
      address: account.address,
      blockTag: 'pending' // Use pending to get the latest nonce including pending txs
    });

    // Send ETH with explicit nonce
    const hash = await walletClient.sendTransaction({
      to: recipientAddress as `0x${string}`,
      value: amountToSend,
      nonce,
    });

    // Wait for confirmation
    const receipt = await publicClient.waitForTransactionReceipt({ hash });

    // Check if transaction was successful
    if (receipt.status === 'reverted') {
      return NextResponse.json(
        { error: 'Transaction reverted', txHash: hash },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      txHash: hash,
      amount: ETH_AMOUNT,
      status: receipt.status,
    });
  } catch (error: any) {
    console.error('Faucet error:', error);

    // Handle specific nonce-related errors
    if (error.message?.includes('replacement transaction underpriced') ||
        error.message?.includes('nonce too low')) {
      return NextResponse.json(
        {
          error: 'A transaction is already pending. Please wait a few seconds and try again.',
          details: 'The faucet wallet has a pending transaction. Wait for it to complete before requesting again.'
        },
        { status: 429 } // 429 Too Many Requests
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to send ETH' },
      { status: 500 }
    );
  }
}