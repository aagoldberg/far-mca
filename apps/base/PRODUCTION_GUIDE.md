# Base Mini App Production & Testing Guide

## 📋 Overview
This guide covers everything needed to make the Base mini app production-ready with real smart contract interactions for creating loans, funding, and managing loan data.

## 🎯 Current Status

### ✅ What's Already Built
- Mobile-first UI/UX for Base mini app
- Contract hooks (`useMicroLoan.ts`) for read/write operations
- Wagmi configuration for Base Sepolia
- Mock data for development
- Wallet connection via RainbowKit
- Gasless transactions via CDP Smart Wallet

### 🚧 What's Needed for Production

## 1️⃣ Smart Contract Setup

### Existing Contracts (if deployed)
Check if you have existing contracts deployed:
```bash
# Check if these addresses exist in your .env
NEXT_PUBLIC_MICROLOAN_FACTORY_ADDRESS=0x...
NEXT_PUBLIC_USDC_ADDRESS=0x...
```

### Deploy New Contracts (if needed)
```bash
# From your contracts directory
cd contracts/
npx hardhat deploy --network base-sepolia
```

## 2️⃣ Environment Variables

Create `.env.local` with:
```env
# RPC Configuration
NEXT_PUBLIC_RPC_URL=https://base-sepolia.g.alchemy.com/v2/YOUR_KEY
NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL=https://base-sepolia.g.alchemy.com/v2/YOUR_KEY

# Contract Addresses (Base Sepolia)
NEXT_PUBLIC_MICROLOAN_FACTORY_ADDRESS=0x... # Your deployed factory
NEXT_PUBLIC_USDC_ADDRESS=0x4200000000000000000000000000000000000022 # Base Sepolia USDC

# CDP/Paymaster for Gasless
NEXT_PUBLIC_PAYMASTER_URL=https://api.developer.coinbase.com/paymaster/v2/...
NEXT_PUBLIC_CDP_API_KEY=your_cdp_api_key

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# Mini App Configuration
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

## 3️⃣ Test Token Setup

### Get Test ETH (Base Sepolia)
1. **Coinbase Faucet**: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
2. **Alchemy Faucet**: https://sepoliafaucet.com/

### Get Test USDC
```javascript
// Deploy mock USDC or use existing test token
// Base Sepolia USDC: 0x4200000000000000000000000000000000000022
```

## 4️⃣ Integration Updates

### A. Update Create Loan Page
Replace mock submission with real contract call:

```typescript
// src/app/create-loan/page.tsx
import { useCreateLoanGasless } from '@/hooks/useMicroLoan';

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const { createLoan } = useCreateLoanGasless();

  try {
    const tx = await createLoan({
      principal: parseUnits(amount, 6), // USDC has 6 decimals
      duration: duration * 7 * 24 * 60 * 60, // Convert weeks to seconds
      metadataURI: await uploadToIPFS({
        title: description,
        description: fullDescription,
        purpose: selectedPurpose,
        image: imageUrl
      })
    });

    // Wait for confirmation
    await tx.wait();

    // Redirect to loan page
    router.push(`/loan/${tx.loanAddress}`);
  } catch (error) {
    console.error('Failed to create loan:', error);
  }
};
```

### B. Update Fund Loan Page
Implement real funding mechanism:

```typescript
// src/components/FundLoan.tsx
import { useFundLoanGasless } from '@/hooks/useMicroLoan';

const handleFund = async (amount: string) => {
  const { fundLoan } = useFundLoanGasless(loanAddress);

  try {
    const tx = await fundLoan(parseUnits(amount, 6));
    await tx.wait();

    // Show success message
    toast.success('Loan funded successfully!');
  } catch (error) {
    console.error('Failed to fund loan:', error);
  }
};
```

### C. Update Loan Details
Replace mock data with real contract reads:

```typescript
// src/components/MobileLoanDetails.tsx
import { useLoanDetails } from '@/hooks/useMicroLoan';

export default function MobileLoanDetails({ loanAddress }) {
  const { loan, isLoading, error } = useLoanDetails(loanAddress);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage />;

  // Use real loan data
  const progress = (loan.totalFunded / loan.principal) * 100;
  // ...rest of component
}
```

## 5️⃣ Testing Checklist

### Local Testing
```bash
# 1. Start local development
npm run dev

# 2. Connect wallet (MetaMask/Coinbase Wallet)
# 3. Ensure you're on Base Sepolia network
# 4. Test each flow:
```

### Test Scenarios

#### ✅ Wallet Connection
- [ ] Connect with Coinbase Smart Wallet
- [ ] Connect with MetaMask
- [ ] Disconnect and reconnect
- [ ] Check address display

#### ✅ Create Loan Flow
- [ ] Fill out loan form
- [ ] Upload metadata to IPFS
- [ ] Submit transaction
- [ ] Verify loan appears in list
- [ ] Check loan details page

#### ✅ Fund Loan Flow
- [ ] Navigate to loan detail
- [ ] Enter funding amount
- [ ] Approve USDC spending (if needed)
- [ ] Submit funding transaction
- [ ] Verify progress bar updates
- [ ] Check contribution appears

#### ✅ View Data
- [ ] Load all loans from factory
- [ ] Filter by borrower
- [ ] View loan details
- [ ] Check repayment schedule
- [ ] View contributor list

## 6️⃣ IPFS Setup

### Option A: Pinata
```javascript
const uploadToIPFS = async (metadata) => {
  const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${PINATA_JWT}`
    },
    body: JSON.stringify(metadata)
  });

  const { IpfsHash } = await response.json();
  return `ipfs://${IpfsHash}`;
};
```

### Option B: NFT.Storage
```javascript
import { NFTStorage } from 'nft.storage';

const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });
const metadata = await client.store(loanMetadata);
```

## 7️⃣ Production Deployment

### Pre-deployment Checklist
- [ ] All environment variables set
- [ ] Contracts deployed and verified
- [ ] RPC endpoints configured
- [ ] IPFS gateway configured
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Transaction confirmations

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables
vercel env add NEXT_PUBLIC_MICROLOAN_FACTORY_ADDRESS
vercel env add NEXT_PUBLIC_RPC_URL
# ... add all env vars
```

## 8️⃣ Monitoring & Analytics

### Transaction Monitoring
```typescript
// Add transaction tracking
const trackTransaction = (tx: Transaction) => {
  console.log('Transaction sent:', {
    hash: tx.hash,
    from: tx.from,
    to: tx.to,
    value: tx.value?.toString(),
    timestamp: Date.now()
  });

  // Send to analytics
  analytics.track('transaction_sent', {
    type: 'loan_creation',
    network: 'base-sepolia',
    hash: tx.hash
  });
};
```

### Error Tracking
```typescript
// Implement error boundaries
export class ErrorBoundary extends Component {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Mini app error:', error, errorInfo);
    // Send to error tracking service
  }
}
```

## 9️⃣ Testing Commands

```bash
# Run all tests
npm test

# Test contract interactions
npm run test:contracts

# Test UI components
npm run test:ui

# E2E tests
npm run test:e2e
```

## 🚀 Quick Start for Testing

1. **Clone and setup**
```bash
cd apps/base
npm install
cp .env.example .env.local
# Add your environment variables
```

2. **Get test tokens**
- Visit Base Sepolia faucet
- Get test ETH and USDC

3. **Start development**
```bash
npm run dev
# Open http://localhost:3005
```

4. **Test the flow**
- Connect wallet
- Create a test loan
- Fund the loan
- Check transactions on BaseScan

## 📝 Important Notes

1. **Gas Fees**: Base Sepolia has low gas fees, but ensure test wallets have ETH
2. **USDC Decimals**: USDC uses 6 decimals, not 18 like ETH
3. **Transaction Times**: Base Sepolia blocks ~2 seconds
4. **Rate Limits**: Be aware of RPC rate limits, implement retry logic

## 🔗 Useful Links

- **Base Sepolia Explorer**: https://sepolia.basescan.org/
- **Base Sepolia Faucet**: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
- **Base Documentation**: https://docs.base.org/
- **USDC on Base**: https://www.circle.com/en/usdc/base
- **CDP Documentation**: https://docs.cdp.coinbase.com/

## 🐛 Common Issues & Solutions

### Issue: "Insufficient funds"
**Solution**: Get test ETH from faucet

### Issue: "Contract not found"
**Solution**: Verify contract addresses in .env

### Issue: "Network mismatch"
**Solution**: Switch to Base Sepolia in wallet

### Issue: "IPFS upload failed"
**Solution**: Check IPFS service credentials

### Issue: "Transaction reverted"
**Solution**: Check contract requirements (min amount, duration, etc.)

---

## Next Steps

1. ✅ Set up environment variables
2. ✅ Deploy or connect to existing contracts
3. ✅ Test wallet connections
4. ✅ Create a test loan
5. ✅ Fund a test loan
6. ✅ Verify on BaseScan
7. ✅ Deploy to production

Need help? Check the [Base Discord](https://discord.gg/base) or [GitHub Issues](https://github.com/your-repo/issues).