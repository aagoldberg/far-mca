# Payment Methods

LendFriend supports multiple payment methods to make lending accessible to both crypto-native users and traditional finance users.

---

## Overview

**For crypto users:**
- Direct USDC transfer (wallet connect)
- Gasless transactions via account abstraction

**For non-crypto users:**
- Coinbase Pay (card → crypto)
- Privy fiat onramp (card → wallet + crypto)
- Progressive onboarding (wallet created automatically)

All contributions are converted to USDC on Base L2 before being sent to the loan contract.

---

## Direct USDC Transfer

**Target users:** Existing crypto users with USDC in their wallets

**Flow:**
1. User connects wallet (MetaMask, Coinbase Wallet, WalletConnect)
2. Click "Contribute" on loan page
3. Approve USDC spending (one-time per contract)
4. Transfer USDC to loan contract
5. Contribution recorded on-chain

**Technical implementation:**

```typescript
import { useContractWrite, usePrepareContractWrite } from 'wagmi';

export function useContributeLoan(loanAddress: string, amount: bigint) {
  // 1. Prepare USDC approval
  const { config: approvalConfig } = usePrepareContractWrite({
    address: USDC_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'approve',
    args: [loanAddress, amount],
  });

  const { write: approveUSDC } = useContractWrite(approvalConfig);

  // 2. Prepare contribution
  const { config: contributeConfig } = usePrepareContractWrite({
    address: loanAddress,
    abi: MICROLOAN_ABI,
    functionName: 'contribute',
    args: [amount],
  });

  const { write: contribute } = useContractWrite(contributeConfig);

  return {
    approveUSDC,
    contribute,
  };
}
```

**Gas costs:**
- Approval: ~45,000 gas (~$0.01 on Base)
- Contribution: ~65,000 gas (~$0.01 on Base)
- **Total: ~$0.02**

---

## Gasless Transactions (ERC-4337)

**Sponsor:** LendFriend protocol (via Pimlico paymaster)
**Target users:** New users without ETH for gas

**How it works:**
- Protocol sponsors gas fees for first contribution
- User signs transaction with Privy embedded wallet
- Paymaster pays gas on user's behalf
- User only needs USDC, not ETH

**Technical implementation:**

```typescript
import { sendUserOperation } from '@pimlico/permissionless';

export async function contributeWithGaslessTransaction(
  loanAddress: string,
  amount: bigint,
  userWallet: string
) {
  const userOp = {
    sender: userWallet,
    callData: encodeFunctionData({
      abi: MICROLOAN_ABI,
      functionName: 'contribute',
      args: [amount],
    }),
    // Paymaster sponsor gas
    paymasterAndData: await getPaymasterData(),
  };

  const txHash = await sendUserOperation(userOp);
  return txHash;
}
```

**Limits:**
- One gasless transaction per user per loan
- Max sponsored amount: $100 equivalent
- Falls back to regular transaction if sponsor limit reached

---

## Coinbase Pay

**Target users:** Users with Coinbase accounts or debit/credit cards
**Conversion:** Fiat (USD, EUR, GBP, etc.) → USDC on Base

**Flow:**
1. User clicks "Pay with Card" on loan page
2. Coinbase Pay modal opens
3. User enters card details or selects Coinbase balance
4. Coinbase converts fiat → USDC
5. USDC sent directly to loan contract
6. User receives email confirmation

**Technical integration:**

```typescript
import { initOnRamp } from '@coinbase/cbpay-js';

export function useCoinbasePay(loanAddress: string, amountUSD: number) {
  const onRampInstance = initOnRamp({
    appId: process.env.NEXT_PUBLIC_COINBASE_APP_ID,
    widgetParameters: {
      destinationWallets: [{
        address: loanAddress,
        blockchains: ['base'],
        assets: ['USDC'],
      }],
      defaultExperience: 'buy',  // Skip sell/send options
      presetFiatAmount: amountUSD,
    },
    onSuccess: () => {
      console.log('Payment successful');
      // Refresh loan data
    },
    onExit: () => {
      console.log('User closed Coinbase Pay');
    },
    onEvent: (event) => {
      console.log('Coinbase Pay event:', event);
    },
  });

  return {
    openCoinbasePay: () => onRampInstance.open(),
  };
}
```

**Fees:**
- Coinbase Pay fee: ~2.5% for card purchases
- No additional LendFriend fees
- User sees total cost upfront

**Supported cards:**
- Debit cards (Visa, Mastercard)
- Credit cards (Visa, Mastercard, Amex)
- Coinbase balance (no fees)

---

## Privy Fiat Onramp

**Target users:** Users without crypto wallets or Coinbase accounts
**Features:**
- Creates embedded wallet automatically
- Purchases USDC with card
- No KYC required for small amounts (<$500)

**Flow:**
1. User visits loan page without wallet
2. Privy prompts: "Create account to contribute"
3. User signs up with email or social login (Google, Twitter)
4. Privy creates embedded wallet (non-custodial)
5. User clicks "Buy USDC with Card"
6. Privy onramp modal opens
7. User enters card details
8. USDC purchased and sent to embedded wallet
9. Auto-contribute to loan contract

**Technical integration:**

```typescript
import { usePrivy, useFundWallet } from '@privy-io/react-auth';

export function PrivyOnramp({ loanAddress, amountUSD }: Props) {
  const { authenticated, user } = usePrivy();
  const { fundWallet } = useFundWallet({
    onUserExited: () => console.log('User exited onramp'),
    onSuccess: async (txHash) => {
      console.log('USDC purchased:', txHash);

      // Wait for USDC to arrive in wallet
      await waitForUSDC(user.wallet.address);

      // Auto-contribute to loan
      await contributeToLoan(loanAddress, amountUSD);
    },
  });

  return (
    <button onClick={() => fundWallet(user.wallet.address)}>
      Buy USDC and Contribute
    </button>
  );
}
```

**Advantages over Coinbase Pay:**
- No existing Coinbase account needed
- Embedded wallet created automatically
- Progressive onboarding (user learns crypto gradually)
- Seed phrase hidden by default (optional export)

**Fees:**
- Privy onramp fee: ~3-4% for card purchases
- No additional LendFriend fees

---

## Progressive Onboarding

**Goal:** Convert non-crypto users into crypto users without friction

**User journey:**

1. **First contribution (via Privy):**
   - User creates account with email
   - Embedded wallet created automatically
   - Contributes via card → USDC
   - Doesn't see private keys or seed phrase

2. **Second contribution:**
   - User logs back in with email
   - Wallet already exists
   - Can contribute with USDC balance or card
   - Still no seed phrase shown

3. **After 3+ contributions:**
   - Prompt: "Want to take control of your wallet?"
   - Offer seed phrase export
   - Educate about MetaMask, Coinbase Wallet, etc.
   - User graduates to self-custody

**Technical implementation:**

```typescript
export function WalletOnboarding({ user }: Props) {
  const contributionCount = useUserContributionCount(user.address);

  if (contributionCount >= 3 && !user.hasExportedWallet) {
    return (
      <OnboardingBanner>
        <h3>You've made {contributionCount} contributions!</h3>
        <p>Ready to take control of your wallet?</p>
        <button onClick={exportWallet}>
          Export to MetaMask
        </button>
      </OnboardingBanner>
    );
  }

  return null;
}
```

---

## Payment Method Selection

**Smart defaults based on user context:**

```typescript
export function PaymentMethodSelector({ loanAddress, amount }: Props) {
  const { address, isConnected } = useAccount();
  const { authenticated, user } = usePrivy();

  // Crypto user with connected wallet
  if (isConnected && address) {
    return <DirectUSDCTransfer loanAddress={loanAddress} amount={amount} />;
  }

  // User with Privy embedded wallet
  if (authenticated && user?.wallet) {
    const hasUSDC = useUSDCBalance(user.wallet.address);

    if (hasUSDC >= amount) {
      return <DirectUSDCTransfer loanAddress={loanAddress} amount={amount} />;
    } else {
      return (
        <>
          <PrivyOnramp loanAddress={loanAddress} amountUSD={amount} />
          <CoinbasePay loanAddress={loanAddress} amountUSD={amount} />
        </>
      );
    }
  }

  // New user (no wallet)
  return (
    <>
      <CreateWalletWithPrivy />
      <CoinbasePay loanAddress={loanAddress} amountUSD={amount} />
    </>
  );
}
```

---

## Security Considerations

**Direct USDC transfers:**
- ✅ User controls private keys
- ✅ Non-custodial
- ✅ Transparent on-chain

**Privy embedded wallets:**
- ⚠️ Privy holds encrypted shards
- ✅ User can export seed phrase anytime
- ✅ Non-custodial (user retains control)
- ⚠️ Relies on Privy infrastructure

**Coinbase Pay:**
- ⚠️ Custodial during purchase
- ✅ USDC sent directly to loan contract (non-custodial)
- ✅ No intermediate custody by LendFriend

**Best practice:** Encourage wallet export after users become comfortable with crypto

---

## Supported Networks

All payment methods convert to USDC on Base L2:

| Method | Source Network | Destination |
|--------|---------------|-------------|
| Direct USDC | Base L2 | Base L2 (no bridge) |
| Coinbase Pay | Fiat (any) | Base L2 (direct) |
| Privy Onramp | Fiat (any) | Base L2 (direct) |

**Why Base L2:**
- Low gas fees (~$0.01 per transaction)
- Fast confirmations (2-second blocks)
- Ethereum security (rollup)
- Native USDC support

---

## Related Documentation

- [Technical Stack](technical-stack.md) — Overall architecture
- [Borrower Profiles](borrower-profiles.md) — How lenders discover loans
- [Virality & Growth](virality-and-growth/README.md) — How payment methods enable viral growth
