import { NextRequest, NextResponse } from 'next/server';
import { createWalletClient, createPublicClient, http, parseUnits } from 'viem';
import { baseSepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

// Faucet configuration - uses your test wallet with USDC
const FAUCET_PRIVATE_KEY = process.env.TEST_WALLET_PRIVATE_KEY as `0x${string}`;
const FAUCET_ADDRESS = process.env.TEST_WALLET_ADDRESS as `0x${string}`;
const USDC_ADDRESS = process.env.NEXT_PUBLIC_USDC_ADDRESS as `0x${string}`;
const USDC_AMOUNT = '10'; // Send 10 USDC per request
const USDC_DECIMALS = 6;

const ERC20_ABI = [
  {
    name: 'transfer',
    type: 'function',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable'
  },
  {
    name: 'balanceOf',
    type: 'function',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view'
  }
] as const;

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

    // Check faucet USDC balance first
    const balance = await publicClient.readContract({
      address: USDC_ADDRESS,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [FAUCET_ADDRESS]
    });

    const amountToSend = parseUnits(USDC_AMOUNT, USDC_DECIMALS);

    if (balance < amountToSend) {
      return NextResponse.json({ 
        error: `Faucet has insufficient USDC balance. Has: ${balance}, needs: ${amountToSend}` 
      }, { status: 503 });
    }

    // Send USDC
    const hash = await walletClient.writeContract({
      address: USDC_ADDRESS,
      abi: ERC20_ABI,
      functionName: 'transfer',
      args: [recipientAddress as `0x${string}`, amountToSend]
    });

    // Wait for confirmation
    const receipt = await publicClient.waitForTransactionReceipt({ hash });

    return NextResponse.json({
      success: true,
      txHash: hash,
      amount: USDC_AMOUNT,
      status: receipt.status,
    });
  } catch (error: any) {
    console.error('USDC Faucet error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send USDC' },
      { status: 500 }
    );
  }
}