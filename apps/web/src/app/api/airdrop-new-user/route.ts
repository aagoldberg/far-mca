import { NextRequest, NextResponse } from 'next/server';
import { createWalletClient, createPublicClient, http, parseEther, parseUnits } from 'viem';
import { baseSepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

// Faucet configuration
const FAUCET_PRIVATE_KEY = process.env.TEST_WALLET_PRIVATE_KEY as `0x${string}`;
const USDC_ADDRESS = process.env.NEXT_PUBLIC_USDC_CONTRACT_ADDRESS as `0x${string}`;

// Airdrop amounts
const ETH_AMOUNT = '0.01'; // 0.01 ETH for gas
const USDC_AMOUNT = '100'; // 100 USDC for testing
const USDC_DECIMALS = 6;

// Minimum balance check - if user already has this much, skip airdrop
const MIN_ETH_BALANCE = parseEther('0.005'); // 0.005 ETH
const MIN_USDC_BALANCE = parseUnits('50', USDC_DECIMALS); // 50 USDC

const ERC20_ABI = [
  {
    name: 'transfer',
    type: 'function',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    name: 'balanceOf',
    type: 'function',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const;

/**
 * POST /api/airdrop-new-user
 * Automatically airdrops ETH + USDC to new users on first login
 * Checks if user already has sufficient balance to prevent duplicate airdrops
 */
export async function POST(request: NextRequest) {
  try {
    const { walletAddress } = await request.json();

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address required' },
        { status: 400 }
      );
    }

    // Validate address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      return NextResponse.json(
        { error: 'Invalid address format' },
        { status: 400 }
      );
    }

    const recipientAddress = walletAddress as `0x${string}`;

    // Create clients
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

    // Check user's current balances
    const [ethBalance, usdcBalance] = await Promise.all([
      publicClient.getBalance({ address: recipientAddress }),
      publicClient.readContract({
        address: USDC_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [recipientAddress],
      }),
    ]);

    // Check if user already has sufficient funds (prevent duplicate airdrops)
    const needsEth = ethBalance < MIN_ETH_BALANCE;
    const needsUsdc = usdcBalance < MIN_USDC_BALANCE;

    if (!needsEth && !needsUsdc) {
      return NextResponse.json({
        success: true,
        message: 'You already have test tokens!',
        skipped: true,
        balances: {
          eth: ethBalance.toString(),
          usdc: usdcBalance.toString(),
        },
      });
    }

    const txHashes: string[] = [];
    const amounts: { eth?: string; usdc?: string } = {};

    // Send ETH if needed
    if (needsEth) {
      try {
        const ethHash = await walletClient.sendTransaction({
          to: recipientAddress,
          value: parseEther(ETH_AMOUNT),
        });
        txHashes.push(ethHash);
        amounts.eth = ETH_AMOUNT;

        // Wait for ETH transaction to confirm before sending USDC
        await publicClient.waitForTransactionReceipt({ hash: ethHash });
      } catch (error: any) {
        console.error('ETH airdrop failed:', error);
        return NextResponse.json(
          { error: 'Failed to send ETH: ' + error.message },
          { status: 500 }
        );
      }
    }

    // Send USDC if needed
    if (needsUsdc) {
      try {
        const usdcHash = await walletClient.writeContract({
          address: USDC_ADDRESS,
          abi: ERC20_ABI,
          functionName: 'transfer',
          args: [recipientAddress, parseUnits(USDC_AMOUNT, USDC_DECIMALS)],
        });
        txHashes.push(usdcHash);
        amounts.usdc = USDC_AMOUNT;

        // Wait for USDC transaction to confirm
        await publicClient.waitForTransactionReceipt({ hash: usdcHash });
      } catch (error: any) {
        console.error('USDC airdrop failed:', error);
        return NextResponse.json(
          { error: 'Failed to send USDC: ' + error.message },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Welcome! Test tokens have been sent to your wallet.',
      txHashes,
      amounts,
      skipped: false,
    });
  } catch (error: any) {
    console.error('Auto-airdrop error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to airdrop tokens' },
      { status: 500 }
    );
  }
}
