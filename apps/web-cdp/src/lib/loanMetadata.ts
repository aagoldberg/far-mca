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
    // Create public client for reading blockchain data
    const publicClient = createPublicClient({
      chain: baseSepolia,
      transport: http(process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org'),
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

    return {
      title: metadata.name || metadata.title || 'Community Loan',
      description: metadata.description || 'Zero-interest community loan',
      image: metadata.image ? metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/') : undefined,
      principal: principalNum,
      totalFunded: totalFundedNum,
      borrower: borrower as string,
    };
  } catch (error) {
    console.error('Error fetching loan metadata:', error);
    return null;
  }
}
