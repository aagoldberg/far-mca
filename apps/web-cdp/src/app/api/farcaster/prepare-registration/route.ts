import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { optimism } from 'viem/chains';

// ID Registry contract on Optimism
const ID_REGISTRY_ADDRESS = '0x00000000Fc6c5F01Fc30151999387Bb99A9f489b';

const ID_REGISTRY_ABI = [
  {
    inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
    name: 'idOf',
    outputs: [{ internalType: 'uint256', name: 'fid', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
    name: 'nonces',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export async function POST(request: NextRequest) {
  try {
    const { walletAddress } = await request.json();

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address required' },
        { status: 400 }
      );
    }

    // Create Optimism client
    const client = createPublicClient({
      chain: optimism,
      transport: http(),
    });

    // Get nonce from ID Registry
    const nonce = await client.readContract({
      address: ID_REGISTRY_ADDRESS,
      abi: ID_REGISTRY_ABI,
      functionName: 'nonces',
      args: [walletAddress as `0x${string}`],
    });

    // Get a new FID from Neynar
    const fidResponse = await fetch('https://api.neynar.com/v2/farcaster/user/fid', {
      method: 'GET',
      headers: {
        'x-api-key': process.env.NEYNAR_API_KEY!,
      },
    });

    if (!fidResponse.ok) {
      throw new Error('Failed to get FID from Neynar');
    }

    const { fid } = await fidResponse.json();

    // Create deadline (1 hour from now)
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600);

    // Create EIP-712 typed data
    const typedData = {
      domain: {
        name: 'Farcaster IdRegistry',
        version: '1',
        chainId: optimism.id,
        verifyingContract: ID_REGISTRY_ADDRESS as `0x${string}`,
      },
      types: {
        Register: [
          { name: 'to', type: 'address' },
          { name: 'recovery', type: 'address' },
          { name: 'nonce', type: 'uint256' },
          { name: 'deadline', type: 'uint256' },
        ],
      },
      primaryType: 'Register' as const,
      message: {
        to: walletAddress as `0x${string}`,
        recovery: walletAddress as `0x${string}`, // Use same address as recovery
        nonce: nonce,
        deadline: deadline,
      },
    };

    return NextResponse.json({
      fid,
      deadline: Number(deadline),
      nonce: Number(nonce),
      typedData,
    });
  } catch (error: any) {
    console.error('Prepare registration error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to prepare registration' },
      { status: 500 }
    );
  }
}
