import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { optimism } from 'viem/chains';
import { NeynarAPIClient, Configuration } from '@neynar/nodejs-sdk';

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

const config = new Configuration({
  apiKey: process.env.NEYNAR_API_KEY!,
});
const neynarClient = new NeynarAPIClient(config);

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

    // Create deadline (1 hour from now)
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600);

    // Fetch a sponsored FID from Neynar
    // This FID must be used within 10 minutes or Neynar will reassign it
    console.log('Fetching sponsored FID from Neynar...');
    const fidResponse = await fetch('https://api.neynar.com/v2/farcaster/user/fid', {
      method: 'GET',
      headers: {
        'api_key': process.env.NEYNAR_API_KEY!,
      },
    });

    if (!fidResponse.ok) {
      const errorText = await fidResponse.text();
      console.error('Failed to fetch FID:', fidResponse.status, errorText);
      return NextResponse.json(
        { error: `Failed to get sponsored FID from Neynar: ${errorText}` },
        { status: 500 }
      );
    }

    const { fid } = await fidResponse.json();
    console.log('Got sponsored FID:', fid);

    // Create EIP-712 typed data for Transfer (Neynar expects Transfer, not Register)
    const typedData = {
      domain: {
        name: 'Farcaster IdRegistry',
        version: '1',
        chainId: optimism.id,
        verifyingContract: ID_REGISTRY_ADDRESS as `0x${string}`,
      },
      types: {
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' },
        ],
        Transfer: [
          { name: 'fid', type: 'uint256' },
          { name: 'to', type: 'address' },
          { name: 'nonce', type: 'uint256' },
          { name: 'deadline', type: 'uint256' },
        ],
      },
      primaryType: 'Transfer' as const,
      message: {
        fid: BigInt(fid),
        to: walletAddress as `0x${string}`,
        nonce: nonce,
        deadline: deadline,
      },
    };

    // Convert BigInt values to strings for JSON serialization
    const serializableTypedData = {
      ...typedData,
      message: {
        fid: fid.toString(),
        to: typedData.message.to,
        nonce: nonce.toString(),
        deadline: deadline.toString(),
      },
    };

    return NextResponse.json({
      fid,
      deadline: Number(deadline),
      nonce: Number(nonce),
      typedData: serializableTypedData,
    });
  } catch (error: any) {
    console.error('Prepare registration error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to prepare registration' },
      { status: 500 }
    );
  }
}
