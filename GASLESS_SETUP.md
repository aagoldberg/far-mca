# Gasless Transactions Setup Guide

This guide explains how to set up the gas relayer service to enable gasless transactions for your users.

## Overview

The gas relayer service allows users to create loans without having ETH in their wallet. The backend server sponsors the gas fees using a dedicated relayer wallet.

## Architecture

```
User (No ETH needed)
    ↓
Frontend (useGaslessLoan hook)
    ↓
Backend API (/api/relay/create-loan)
    ↓
Relayer Wallet (Pays gas)
    ↓
Smart Contract (Base Sepolia)
```

## Setup Instructions

### 1. Create Relayer Wallet

Generate a new wallet dedicated for the relayer:

```bash
# Option A: Using cast (Foundry)
cast wallet new

# Option B: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Important**: Store the private key securely! This wallet will pay gas fees.

### 2. Fund Relayer Wallet

Get Base Sepolia ETH for the relayer wallet:

1. **Coinbase Faucet** (easiest): https://portal.cdp.coinbase.com/products/faucet
2. **Alchemy**: https://sepoliafaucet.com/ (then bridge to Base Sepolia)
3. **Base Bridge**: https://bridge.base.org/deposit

Recommended amount: **0.1 ETH on Base Sepolia** (will last for ~1000 transactions)

### 3. Environment Variables

Add to your `.env.local`:

```bash
# Relayer Private Key (different from faucet wallet)
RELAYER_PRIVATE_KEY=0xyour_relayer_private_key_here

# Already have these:
NEXT_PUBLIC_RPC_URL=https://base-sepolia.g.alchemy.com/v2/your_key
NEXT_PUBLIC_MICROLOAN_FACTORY_ADDRESS=0x...
```

### 4. Rate Limiting Configuration

The relayer has built-in rate limiting to prevent abuse:

- **Current**: 3 loan creations per user per 24 hours
- **Storage**: In-memory (resets on server restart)
- **Production**: Upgrade to Redis for persistence

To modify limits, edit `/apps/web/src/app/api/relay/create-loan/route.ts`:

```typescript
const MAX_REQUESTS_PER_USER_PER_DAY = 3; // Adjust as needed
```

### 5. Monitor Gas Usage

Check relayer wallet balance regularly:

```bash
# Using cast
cast balance 0xYOUR_RELAYER_ADDRESS --rpc-url $NEXT_PUBLIC_RPC_URL

# Or check on Base Sepolia explorer
# https://sepolia.basescan.org/address/YOUR_RELAYER_ADDRESS
```

Set up alerts when balance drops below 0.01 ETH.

## Usage

### Frontend Integration

#### Option 1: Use the Gasless Hook (Recommended)

```typescript
import { useGaslessLoan } from '@/hooks/useGaslessLoan';

function CreateLoanForm() {
  const { createLoan, isLoading, error } = useGaslessLoan();

  const handleSubmit = async () => {
    try {
      const result = await createLoan({
        principal: parseUnits('1000', 6), // 1000 USDC
        termPeriods: 4n, // 4 bi-weekly periods
        name: 'My Business Loan',
        description: 'Help me grow my business',
      });

      console.log('Loan created!', result.txHash);
      console.log('Loan address:', result.loanAddress);
    } catch (err) {
      console.error('Failed:', err);
    }
  };

  return (
    <button onClick={handleSubmit} disabled={isLoading}>
      {isLoading ? 'Creating...' : 'Create Loan (No ETH needed!)'}
    </button>
  );
}
```

#### Option 2: Direct API Call

```typescript
const response = await fetch('/api/relay/create-loan', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userAddress: '0x...',
    principal: '1000000000', // 1000 USDC (6 decimals)
    termPeriods: '4',
    name: 'My Business Loan',
    description: 'Help me grow my business',
    imageUrl: 'https://...',
    businessWebsite: 'https://...',
  }),
});

const { txHash, loanAddress } = await response.json();
```

## Security Considerations

### Rate Limiting

✅ **Implemented**: 3 loans per user per day
🔄 **Upgrade Path**: Use Redis for distributed rate limiting

```typescript
// Example Redis implementation
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

async function checkRateLimit(userAddress: string): Promise<boolean> {
  const key = `ratelimit:${userAddress.toLowerCase()}`;
  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, 86400); // 24 hours
  }

  return count <= 3;
}
```

### Gas Price Protection

Add max gas price checks to prevent attacks during high gas:

```typescript
const gasPrice = await publicClient.getGasPrice();
const MAX_GAS_PRICE = parseGwei('10'); // 10 Gwei max

if (gasPrice > MAX_GAS_PRICE) {
  throw new Error('Gas price too high, try again later');
}
```

### Monitoring

Set up monitoring for:
1. **Relayer balance** (alert when < 0.01 ETH)
2. **Failed transactions** (investigate if > 5%)
3. **Rate limit hits** (detect potential abuse)
4. **Gas costs** (track spending per day/week)

## Cost Estimation

### Base Sepolia Testnet
- **Gas price**: ~0.001 Gwei
- **Create loan**: ~200,000 gas
- **Cost per loan**: ~$0.000001 (essentially free)

### Base Mainnet (Production)
- **Gas price**: ~0.001-0.01 Gwei
- **Create loan**: ~200,000 gas
- **Cost per loan**: ~$0.0002-$0.002

**Budget**: 0.1 ETH = ~50,000-500,000 loan creations

## Upgrading to Production

When moving to Base Mainnet:

### 1. New Relayer Wallet
Create a fresh wallet for production (never reuse testnet keys).

### 2. Security Enhancements

```typescript
// Add signature verification
import { verifyMessage } from 'viem';

export async function POST(request: NextRequest) {
  const { userAddress, signature, ...params } = await request.json();

  // Verify user signed the request
  const message = JSON.stringify(params);
  const recoveredAddress = await verifyMessage({
    address: userAddress,
    message,
    signature,
  });

  if (recoveredAddress.toLowerCase() !== userAddress.toLowerCase()) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  // ... rest of handler
}
```

### 3. Rate Limiting Upgrade
Use Redis or a database for persistent rate limiting:

```bash
npm install @upstash/redis
```

### 4. Monitoring & Alerts
Set up services like:
- **Tenderly**: Transaction monitoring
- **OpenZeppelin Defender**: Security monitoring
- **PagerDuty**: Balance alerts

## Troubleshooting

### Error: "Rate limit exceeded"
User has created 3+ loans in 24 hours. Wait or increase limit.

### Error: "Relayer is out of ETH"
Fund the relayer wallet with more Base ETH.

### Error: "Transaction failed"
Check:
1. Contract addresses are correct
2. RPC URL is working
3. Network is Base Sepolia (not Ethereum Sepolia)

### Transaction pending forever
Base Sepolia can be slow. Increase timeout:

```typescript
const receipt = await publicClient.waitForTransactionReceipt({
  hash,
  timeout: 120000, // 2 minutes
});
```

## FAQ

**Q: Can users still use their own ETH if they have it?**
A: Yes! Keep the original `useCreateLoan` hook for users with ETH. Offer gasless as an option.

**Q: What if the relayer wallet is compromised?**
A: Generate a new wallet, update `.env.local`, restart server. Old wallet cannot be used for new transactions.

**Q: How do I test locally?**
A: Use Base Sepolia testnet. Get free ETH from Coinbase faucet.

**Q: Can I sponsor other operations (contribute, repay)?**
A: Yes! Create similar API routes:
- `/api/relay/contribute` - For funding loans
- `/api/relay/repay` - For repayments

**Q: What about mainnet costs?**
A: Monitor spending. 0.1 ETH (~$400) can sponsor 50,000-500,000 transactions.

## Alternative Solutions

If you want to avoid managing a relayer:

1. **Privy Gas Sponsorship** (easiest)
   - Enable in Privy dashboard
   - Auto-sponsors transactions
   - $0.50/user/month

2. **Coinbase Paymaster** (free on Base)
   - Free for Base Sepolia
   - Usage limits on mainnet
   - Good for MVP

3. **Gelato Relay** (enterprise)
   - Pay-as-you-go
   - Multi-chain support
   - Advanced features

## Support

For issues or questions:
- Check Base Sepolia status: https://status.base.org/
- Alchemy dashboard: https://dashboard.alchemy.com/
- Base docs: https://docs.base.org/

---

**Pro Tip**: Start with the custom relayer on testnet, then migrate to Coinbase Paymaster or Privy for production once you validate the feature.
