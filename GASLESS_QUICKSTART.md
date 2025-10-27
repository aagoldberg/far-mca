# Gasless Transactions - Quick Start

Enable gasless loan creation in 3 steps! 🚀

## 1. Generate Relayer Wallet

```bash
cast wallet new
```

Save the private key securely!

## 2. Get Base Sepolia ETH

Visit: https://portal.cdp.coinbase.com/products/faucet

Request ETH for your relayer wallet address. You'll need ~0.05 ETH for testing.

## 3. Add to Environment

Create or update `.env.local`:

```bash
RELAYER_PRIVATE_KEY=0xyour_new_wallet_private_key_here
```

## 4. Use in Frontend

```typescript
import { useGaslessLoan } from '@/hooks/useGaslessLoan';

function MyComponent() {
  const { createLoan, isLoading } = useGaslessLoan();

  const handleCreate = async () => {
    const result = await createLoan({
      principal: parseUnits('1000', 6),
      termPeriods: 4n,
      name: 'My Loan',
      description: 'Help me grow my business',
    });

    console.log('Success!', result.txHash);
  };

  return (
    <button onClick={handleCreate} disabled={isLoading}>
      Create Loan (No ETH Needed!)
    </button>
  );
}
```

## That's It!

Users can now create loans without having ETH in their wallet! ✨

For full documentation, see [GASLESS_SETUP.md](./GASLESS_SETUP.md)

## Testing

Test the API directly:

```bash
curl -X POST http://localhost:3000/api/relay/create-loan \
  -H "Content-Type: application/json" \
  -d '{
    "userAddress": "0xYourAddress",
    "principal": "1000000000",
    "termPeriods": "4",
    "name": "Test Loan"
  }'
```

## Features

✅ No ETH required for users
✅ Rate limiting (3 loans/user/day)
✅ Automatic gas estimation
✅ Transaction monitoring
✅ Error handling

## Next Steps

- [ ] Monitor relayer wallet balance
- [ ] Set up alerts for low balance
- [ ] Test with real users
- [ ] Consider upgrading to Coinbase Paymaster for production
