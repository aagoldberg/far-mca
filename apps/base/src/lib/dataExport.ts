/**
 * Data Export Utilities
 *
 * Provides functions to export user data for sovereignty and portability
 */

import JSZip from 'jszip';
import { formatUnits } from 'viem';
import { USDC_DECIMALS } from '@/types/loan';

export interface ExportData {
  wallet: {
    address: string;
    type: 'cdp-embedded' | 'external';
    chainId: number;
    exportedAt: string;
  };
  farcaster?: {
    fid: number;
    username: string;
    custodyAddress: string;
    signer_uuid?: string;
  };
  loans: {
    borrowed: LoanExportData[];
    contributed: LoanExportData[];
    stats: {
      totalLoansCreated: number;
      totalBorrowed: string;
      totalContributed: string;
      activeLoans: number;
      completedLoans: number;
    };
  };
  metadata: {
    exportVersion: string;
    platform: string;
    exportDate: string;
  };
}

export interface LoanExportData {
  address: string;
  borrower: string;
  principal: string;
  totalFunded: string;
  totalRepaid: string;
  status: string;
  metadataURI: string;
  fundraisingDeadline: string;
  dueDate: string;
  basescanUrl: string;
}

/**
 * Generate complete account data export
 */
export function generateAccountDataExport(
  walletAddress: string,
  walletType: 'cdp-embedded' | 'external',
  farcasterAccount: any | null,
  borrowedLoans: any[]
): ExportData {
  const exportData: ExportData = {
    wallet: {
      address: walletAddress,
      type: walletType,
      chainId: 84532, // Base Sepolia
      exportedAt: new Date().toISOString(),
    },
    farcaster: farcasterAccount ? {
      fid: farcasterAccount.fid,
      username: farcasterAccount.username,
      custodyAddress: walletAddress,
      signer_uuid: farcasterAccount.signer_uuid,
    } : undefined,
    loans: {
      borrowed: borrowedLoans.map(loan => formatLoanForExport(loan)),
      contributed: [], // TODO: Add contributed loans when available
      stats: {
        totalLoansCreated: borrowedLoans.length,
        totalBorrowed: calculateTotalAmount(borrowedLoans),
        totalContributed: '0.00 USDC', // TODO
        activeLoans: borrowedLoans.filter(l => l.active).length,
        completedLoans: borrowedLoans.filter(l => l.completed).length,
      },
    },
    metadata: {
      exportVersion: '1.0.0',
      platform: 'LendFriend',
      exportDate: new Date().toISOString(),
    },
  };

  return exportData;
}

/**
 * Format loan for export
 */
function formatLoanForExport(loan: any): LoanExportData {
  return {
    address: loan.address,
    borrower: loan.borrower,
    principal: formatUnits(loan.principal, USDC_DECIMALS) + ' USDC',
    totalFunded: formatUnits(loan.totalFunded, USDC_DECIMALS) + ' USDC',
    totalRepaid: formatUnits(loan.totalRepaid || 0n, USDC_DECIMALS) + ' USDC',
    status: loan.completed ? 'Completed' : loan.active ? 'Active' : loan.fundraisingActive ? 'Fundraising' : 'Inactive',
    metadataURI: loan.metadataURI,
    fundraisingDeadline: new Date(Number(loan.fundraisingDeadline) * 1000).toISOString(),
    dueDate: new Date(Number(loan.dueAt) * 1000).toISOString(),
    basescanUrl: `https://sepolia.basescan.org/address/${loan.address}`,
  };
}

/**
 * Calculate total borrowed amount
 */
function calculateTotalAmount(loans: any[]): string {
  const total = loans.reduce((sum, loan) => {
    return sum + Number(formatUnits(loan.principal, USDC_DECIMALS));
  }, 0);
  return `${total.toFixed(2)} USDC`;
}

/**
 * Generate loan contracts registry (TXT)
 */
export function generateLoanContractsRegistry(loans: LoanExportData[]): string {
  const header = `Your Loan Contracts\n`;
  const separator = '='.repeat(60) + '\n';

  const loanEntries = loans.map((loan, index) => {
    return `
Loan #${index + 1}: ${loan.address}
- Status: ${loan.status}
- Principal: ${loan.principal}
- Funded: ${loan.totalFunded}
- Repaid: ${loan.totalRepaid}
- Fundraising Deadline: ${new Date(loan.fundraisingDeadline).toLocaleDateString()}
- Due Date: ${new Date(loan.dueDate).toLocaleDateString()}
- Metadata: ${loan.metadataURI}
- View on Basescan: ${loan.basescanUrl}
${'-'.repeat(60)}
`;
  }).join('\n');

  return header + separator + loanEntries;
}

/**
 * Generate migration guide (TXT)
 */
export function generateMigrationGuide(walletAddress: string, walletType: string, farcasterFid?: number): string {
  return `
LendFriend Data Export & Migration Guide
${'='.repeat(60)}

Export Date: ${new Date().toLocaleDateString()}
Wallet Address: ${walletAddress}
Wallet Type: ${walletType}
${farcasterFid ? `Farcaster FID: ${farcasterFid}` : ''}

${'='.repeat(60)}

📋 WHAT YOU HAVE:

✓ Complete account data (account-data.json)
✓ Loan contract addresses (loan-contracts.txt)
✓ This migration guide

${'='.repeat(60)}

🔄 HOW TO TAKE FULL CONTROL:

1. CREATE SELF-CUSTODY WALLET
   - Install MetaMask, Ledger, or similar
   - Save your seed phrase securely (12-24 words)
   - NEVER share your seed phrase with anyone

2. TRANSFER YOUR FARCASTER FID (if applicable)
${farcasterFid ? `   - Your FID: ${farcasterFid}
   - Connect new wallet to LendFriend
   - Use "Transfer FID" tool in Account Settings
   - Sign from your current wallet (${walletAddress})
   - Your FID will move to your new wallet
` : '   - Not applicable (no Farcaster account)\n'}

3. ACCESS YOUR LOAN CONTRACTS
   - Your loans remain on-chain at the same addresses
   - Connect your new wallet to LendFriend
   - All loans will appear automatically
   - Contributors can still interact with your loans

${walletType === 'cdp-embedded' ? `
4. CDP WALLET NOTICE
   Your current wallet uses Coinbase's MPC technology.
   You cannot simply export a private key. Instead:

   - Transfer assets OUT to your new wallet
   - Transfer your Farcaster FID to new wallet
   - Your loan contracts remain accessible on-chain
   - The CDP wallet stays valid but you won't use it
` : ''}

${'='.repeat(60)}

🆘 EMERGENCY RECOVERY:

If LendFriend disappears, your loans are still accessible:

1. Go to https://sepolia.basescan.org
2. Enter your loan contract address
3. Click "Contract" → "Write Contract"
4. Connect your wallet
5. Call contract functions directly

${'='.repeat(60)}

🔒 NO LOCK-IN GUARANTEE:

LendFriend believes you should own your data. All your loans
are permanent on the Base blockchain. No one can delete them.

Generated by LendFriend v1.0.0
${new Date().toISOString()}
`;
}

/**
 * Generate complete exit package as ZIP
 */
export async function generateExitPackage(accountData: ExportData): Promise<Blob> {
  const zip = new JSZip();

  // 1. Account data (JSON)
  zip.file('account-data.json', JSON.stringify(accountData, null, 2));

  // 2. Borrowed loans registry (TXT)
  if (accountData.loans.borrowed.length > 0) {
    const borrowedRegistry = generateLoanContractsRegistry(accountData.loans.borrowed);
    zip.file('loan-contracts.txt', borrowedRegistry);
  }

  // 3. Migration guide (TXT)
  const migrationGuide = generateMigrationGuide(
    accountData.wallet.address,
    accountData.wallet.type,
    accountData.farcaster?.fid
  );
  zip.file('MIGRATION-GUIDE.txt', migrationGuide);

  // 4. README (TXT)
  const readme = `
LendFriend Data Export
=====================

This ZIP contains all your data from LendFriend.

Files:
- account-data.json: Complete account information
- loan-contracts.txt: Loans you created
- MIGRATION-GUIDE.txt: Instructions for taking full control

Start by reading MIGRATION-GUIDE.txt

Export Date: ${new Date().toLocaleDateString()}
Platform: LendFriend
Version: 1.0.0
`;
  zip.file('README.txt', readme);

  // Generate ZIP blob
  const blob = await zip.generateAsync({ type: 'blob' });
  return blob;
}

/**
 * Download file to user's computer
 */
export function downloadFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Download JSON data
 */
export function downloadJSON(data: any, filename: string) {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  downloadFile(blob, filename);
}
