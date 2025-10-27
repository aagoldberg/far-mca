// Contract addresses and constants for RBF app

// Campaign Factory address on Base Sepolia
export const CAMPAIGN_FACTORY_ADDRESS = process.env.NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDRESS as `0x${string}` || '0x0Eb3075cF3bAAB9715c8D3F423F1634571c4B312';

// RBF Factory address on Base Sepolia  
export const RBF_FACTORY_ADDRESS = process.env.NEXT_PUBLIC_RBF_FACTORY_ADDRESS as `0x${string}` || '0x0000000000000000000000000000000000000000';

// USDC token address on Base Sepolia
export const USDC_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_USDC_CONTRACT_ADDRESS as `0x${string}` || '0x036CbD53842c5426634e7929541eC2318f3dCF7E';

// IPFS Gateway
export const IPFS_GATEWAY = process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/';

// Subgraph URL - MicroLoan Protocol
export const SUBGRAPH_URL = process.env.NEXT_PUBLIC_SUBGRAPH_URL || 'https://api.studio.thegraph.com/query/113071/rbf-base/version/latest';

// Revenue share limits (in basis points)
export const MIN_REVENUE_SHARE = 100; // 1%
export const MAX_REVENUE_SHARE = 2000; // 20%

// Repayment cap limits (in basis points)
export const MIN_REPAYMENT_CAP = 10000; // 1x
export const MAX_REPAYMENT_CAP = 30000; // 3x