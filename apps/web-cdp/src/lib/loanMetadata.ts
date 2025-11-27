import { createPublicClient, http, parseAbi } from 'viem';
import { baseSepolia } from 'viem/chains';

const MICROLOAN_ABI = parseAbi([
  'function principal() view returns (uint256)',
  'function totalFunded() view returns (uint256)',
  'function metadataURI() view returns (string)',
  'function borrower() view returns (address)',
]);

export interface LoanMetadata {
  title: string;
  description: string;
  image?: string;
  principal: number;
  totalFunded: number;
  borrower: string;
}

export async function getLoanDataForMetadata(address: string): Promise<LoanMetadata | null> {
  try {
    // Get RPC URL from environment (check multiple possible variable names)
    const rpcUrl = process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL ||
                   process.env.NEXT_PUBLIC_RPC_URL ||
                   'https://sepolia.base.org';

    console.log('[getLoanDataForMetadata] Starting fetch for address:', address);
    console.log('[getLoanDataForMetadata] Using RPC URL:', rpcUrl);

    // Create public client for reading blockchain data
    const publicClient = createPublicClient({
      chain: baseSepolia,
      transport: http(rpcUrl),
    });

    // Fetch loan data from blockchain
    const [principal, totalFunded, metadataURI, borrower] = await Promise.all([
      publicClient.readContract({
        address: address as `0x${string}`,
        abi: MICROLOAN_ABI,
        functionName: 'principal',
      }),
      publicClient.readContract({
        address: address as `0x${string}`,
        abi: MICROLOAN_ABI,
        functionName: 'totalFunded',
      }),
      publicClient.readContract({
        address: address as `0x${string}`,
        abi: MICROLOAN_ABI,
        functionName: 'metadataURI',
      }),
      publicClient.readContract({
        address: address as `0x${string}`,
        abi: MICROLOAN_ABI,
        functionName: 'borrower',
      }),
    ]);

    // Fetch metadata from IPFS with timeout
    let metadata: any = {};
    if (metadataURI) {
      try {
        const ipfsUrl = metadataURI.replace('ipfs://', 'https://ipfs.io/ipfs/');
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const response = await fetch(ipfsUrl, {
          signal: controller.signal,
          next: { revalidate: 3600 } // Cache for 1 hour
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          metadata = await response.json();
          console.log('[getLoanDataForMetadata] Raw IPFS metadata:', JSON.stringify(metadata, null, 2));
        }
      } catch (error) {
        console.error('Failed to fetch IPFS metadata:', error);
        // Continue with empty metadata
      }
    }

    // Convert BigInt to number (assuming values are small enough)
    const principalNum = Number(principal) / 1e6; // Assuming 6 decimals (USDC)
    const totalFundedNum = Number(totalFunded) / 1e6;

    const result = {
      title: metadata.name || metadata.title || 'Community Loan',
      description: metadata.description || 'Zero-interest community loan',
      image: metadata.image ? metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/') : undefined,
      principal: principalNum,
      totalFunded: totalFundedNum,
      borrower: borrower as string,
    };

    console.log('[getLoanDataForMetadata] Successfully fetched loan data:', {
      title: result.title,
      principal: result.principal,
      totalFunded: result.totalFunded,
      hasImage: !!result.image,
    });

    return result;
  } catch (error) {
    console.error('[getLoanDataForMetadata] CRITICAL ERROR fetching loan metadata for address:', address);
    console.error('[getLoanDataForMetadata] Error details:', error);
    console.error('[getLoanDataForMetadata] Error type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('[getLoanDataForMetadata] Error message:', error instanceof Error ? error.message : String(error));
    if (error instanceof Error && error.stack) {
      console.error('[getLoanDataForMetadata] Stack trace:', error.stack);
    }
    return null;
  }
}
