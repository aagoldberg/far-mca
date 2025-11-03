# Phase 1: Scale with Cashflow

**Timeline:** 2025-2026
**Prerequisites:** Phase 0 success (90%+ repayment, 500+ users, proven social trust model)

---

## The Evolution

Phase 0 proved social trust works for small loans. Phase 1 scales beyond personal networks by adding objective cashflow verification.

**The shift:** From "I trust my friend" to "I trust the data."

With verified income, lenders don't need to personally know borrowers. Anonymous capital can participate through liquidity pools. Loan sizes can increase from $5K to $50K+. And we can sustain the platform with fair interest rates instead of relying on pure altruism.

---

## What We're Building

### Cashflow-Verified Lending

**Loan sizes:** $5,000 - $50,000+
**Interest:** Market-determined (aim for 0-8% APR, well below payday loans)
**Repayment:** Still exploring installments vs. single maturity
**Verification:** Bank accounts (Plaid), merchant revenue (Square, Shopify), on-chain income

**How it works:**
1. **Apply** with social trust + cashflow verification
2. **Get approved** based on hybrid model (social + financial signals)
3. **Receive funds** from liquidity pools or direct lenders
4. **Repay** according to schedule, building on-chain credit history

**Why cashflow beats credit scores:**
- Shows actual income, not past debt
- Works for gig workers, DAO contributors, crypto-native earners
- Doesn't penalize young people or those building new income streams
- Can be verified on-chain without invasive data collection

---

## Cashflow Verification Methods

### Bank Account Verification (Plaid)

**What it provides:**
- Transaction history (income deposits, spending patterns)
- Account balances and consistency
- Employment verification via direct deposits
- Debt service coverage ratio

**Privacy approach:**
- User grants read-only access via OAuth
- Attestations created (not raw data stored on-chain)
- Minimal disclosure: "earns $X/month" not "spent $Y at Z"

**Integration path:**
- Plaid API for bank connection
- Chainlink oracle or zkTLS for on-chain attestation
- Time-limited permissions (revocable)

**Who this serves:**
- W2 employees with direct deposit
- Freelancers with consistent client payments
- Anyone with traditional bank accounts

### Merchant Revenue Verification (Square)

**What it provides:**
- Daily/weekly sales volume
- Transaction count and average ticket size
- Seasonal patterns and growth trends
- Refund/chargeback rates

**Why Square first:**
- Open API with good documentation
- Many small merchants already use it
- Revenue data is highly predictive of repayment ability
- Easier integration than Shopify (for now)

**Integration path:**
- OAuth connection to Square account
- Read-only access to sales data
- Attestation of revenue ranges (not exact amounts)
- Monthly/quarterly snapshot updates

**Who this serves:**
- Coffee shops, retail stores, service businesses
- Food trucks, pop-up vendors
- Anyone accepting card payments via Square

### Merchant Revenue Verification (Shopify)

**What it provides:**
- E-commerce sales data
- Inventory turnover rates
- Customer acquisition costs
- Gross margins and profitability

**Current challenges:**
- Harder API integration than Square
- May require ACH rails for repayment (Phase 2)
- Shopify aggressively moving to crypto wallets (helps us)

**Integration path:**
- Start with manual verification (upload sales reports)
- Build OAuth integration as API matures
- Wait for Shopify's crypto wallet push
- Layer in automated repayment when ready

**Who this serves:**
- Online merchants and dropshippers
- Physical goods sellers
- Subscription businesses

### On-Chain Income Verification

**What it provides:**
- Wallet transaction history (Base L2 focus)
- Token receipts from DAOs, protocols, NFT sales
- DeFi yield and staking rewards
- Crypto salary/payment streams

**Why this matters:**
- Many crypto-native workers have no traditional employment
- DAO contributors, protocol developers, NFT creators all earn on-chain
- Traditional credit systems can't see this income
- We can verify it cryptographically

**Integration path:**
- Already implemented (wallet connection required)
- Analyze transaction patterns
- Weight recurring income higher than one-time sales
- Combine with ENS, POAPs, DAO participation for fuller picture

**Who this serves:**
- DAO contributors and protocol developers
- NFT artists and creators
- DeFi yield farmers
- Anyone earning primarily in crypto

---

## Liquidity Pools

### Why Pools Become Possible

Phase 0 requires personal trust. Lenders fund friends or review individual loan requests.

Phase 1 changes this: **with objective cashflow data, risk assessment becomes standardized.**

**This enables:**
- Lenders deposit USDC into pools
- Pools algorithmically fund loans based on risk scores
- Lenders earn passive yield without active selection
- Capital scales beyond personal networks

**The key insight:** When you can verify cashflow, you don't need to know the borrower personally. Trust shifts from social relationships to verifiable data.

### Pool Mechanics

**Risk-stratified pools:**
- **Conservative Pool:** Funds only LOW risk borrowers (highest cashflow verification, strong social trust)
- **Balanced Pool:** Funds LOW + MEDIUM risk mix
- **Aggressive Pool:** Funds all tiers (higher yield, higher default risk)

**How lenders participate:**
1. Deposit USDC into chosen pool
2. Earn interest on deployed capital
3. Withdraw anytime from unallocated reserves
4. Defaults spread across all pool participants (diversification)

**How borrowers access pools:**
1. Complete social trust + cashflow verification
2. Get risk score (algorithmic underwriting)
3. Receive loan offer (amount, rate, terms)
4. Accept offer → funds disbursed from pool

**Pool economics:**
- Interest rate set by supply/demand (more lenders = lower rates)
- Default reserves held in each pool (e.g., 5-10% of TVL)
- Lenders earn yield minus defaults minus platform fee
- Transparent on-chain accounting

### Why This Scales

**Traditional P2P lending problems:**
- Lenders must actively review loans (doesn't scale)
- Borrowers wait for funding (slow)
- Relationship-based trust limits market size

**Pool-based lending solutions:**
- Passive capital deployment (scales infinitely)
- Instant funding when approved (better UX)
- Anonymous liquidity (market-sized, not network-sized)

**Precedent:** Aave and Compound prove liquidity pools work for collateralized lending. We're applying the same model to uncollateralized lending, enabled by cashflow verification.

---

## Hybrid Risk Model

Phase 1 combines social trust + cashflow data for more accurate risk assessment.

### Weighting by Loan Size

**Small loans ($100-$5K):**
- Social Trust: 60%
- Cashflow Verification: 30%
- Loan Size Risk: 10%

**Medium loans ($5K-$25K):**
- Social Trust: 40%
- Cashflow Verification: 40%
- Loan Size Risk: 20%

**Large loans ($25K-$50K+):**
- Social Trust: 20%
- Cashflow Verification: 60%
- Loan Size Risk: 20%

**Why this works:** Small loans among friends don't need deep financial analysis. Large loans to strangers do. The model adapts weighting based on context.

### Composite Risk Score

**Inputs:**
1. **Repayment History** (0-40 points)
   - Past LendFriend loans (most predictive)
   - On-time payments, tip rate, early repayment
   - Defaults = major penalty

2. **Social Trust Score** (0-30 points)
   - Farcaster/Bluesky proximity to lenders
   - Network quality (Neynar scores, Power Badge)
   - Community vouching

3. **Cashflow Verification** (0-30 points)
   - Bank account: consistent income deposits
   - Merchant revenue: sales volume + growth
   - On-chain income: wallet transaction patterns
   - Debt-to-income ratio

**Total Risk Score:** 0-100
- **90-100:** AAA tier (prime borrowers, lowest rates)
- **75-89:** AA tier (high quality, low rates)
- **60-74:** A tier (good quality, moderate rates)
- **40-59:** BBB tier (acceptable risk, higher rates)
- **Below 40:** Decline or require co-signers

### Adaptive Weighting

As we gather more data, the model evolves:

**Early days (limited repayment data):**
- Lean heavily on social trust + cashflow
- Conservative loan amounts
- Higher reserves in pools

**After 6-12 months (repayment patterns clear):**
- Weight repayment history highest
- Increase loan amounts for proven borrowers
- Refine cashflow verification thresholds

**Continuous improvement:**
- A/B test different weighting schemes
- Track which signals predict defaults
- Adjust model based on empirical performance

---

## Cross-Platform Expansion

Phase 1 also expands beyond Farcaster to reach more borrowers and lenders.

### Web Platform (lendfriend.org)

**Why this matters:**
- Most people aren't on Farcaster
- Borrowers share loans to Twitter, WhatsApp, Telegram, Facebook
- Non-crypto friends can lend via web (Privy social login)

**Features:**
- Shareable loan campaigns (12+ platforms)
- Social login (Google, email, Twitter)
- Fiat onramps (Coinbase Pay, Privy)
- Wallet creation for crypto-naive users

**User flow:**
1. Borrower creates loan on Farcaster or web
2. Shares link to WhatsApp group, Twitter, etc.
3. Non-crypto friend clicks link → sees loan page
4. Contributes via credit card (converted to USDC)
5. Automatically onboarded to crypto (progressively)

**Result:** Borrowers can tap networks beyond Farcaster. Lenders discover crypto through lending, not trading.

### Bluesky Integration

**Timeline:** Late 2025 / early 2026
**Why Bluesky:**
- Domain-based verification (more trustworthy than Twitter handles)
- AT Protocol (decentralized, self-authenticating)
- Quality middle ground (better than Twitter, not as tight as Farcaster)

**Trust model adjustments:**
- Weight social trust lower than Farcaster (10% reduction)
- Require higher cashflow verification (10% increase)
- Domain verification bonus (owned domains = commitment)
- Cross-platform bonus (same user on Farcaster + Bluesky = higher trust)

**Implementation:**
- Already built quality scoring (account age, followers, engagement)
- Need to integrate social graph API for mutual connections
- Display Bluesky profiles in Trust Signals UI

### Twitter/X (Delayed to Phase 3)

**Why wait:**
- Research shows 64% of accounts are bots
- "Less about real life friendships" (academic research)
- Follow-for-follow gaming common
- Low signal-to-noise ratio

**When we do integrate (2027+):**
- Require Twitter Blue verification (paid = Sybil resistance)
- Use as supplementary data only, never primary
- Weight social trust very low (10%)
- Require high cashflow verification (60%)

---

## Technical Challenges

### Cashflow Attestations

**Easy path (shipping first):**
- Direct API integrations (Plaid, Square)
- OAuth user grants read-only access
- Attestation created: "User earns $X-Y/month"
- Stored on-chain (minimal data, privacy-preserving)

**Medium path (adding soon):**
- Chainlink oracles for bank data
- Bring off-chain data on-chain verifiably
- Decentralized vs. relying on our servers

**Hard path (future):**
- Zero-knowledge proofs (zkTLS, Reclaim Protocol)
- Prove income range without revealing exact transactions
- Maximum privacy, maximum complexity
- May not be necessary if users trust OAuth flow

**Our approach:** Start easy, layer in privacy later as needed.

### Smart Contract Upgrades

**Phase 0 contracts are simple:** Single maturity, zero interest, no installments.

**Phase 1 needs:**
- Interest calculation and accrual
- Installment-based repayment schedules
- Variable interest rates based on risk score
- Pool contracts for liquidity management
- Oracle integration for off-chain data

**Migration path:**
- New contract versions deployed
- Phase 0 loans continue on old contracts
- Phase 1 loans use new factory
- Cross-version compatibility where needed

### Consumer Wallet Problem

**The challenge:** Web users need wallets but don't know how to manage them.

**Current solution (Phase 1):**
- Privy embedded wallets (social login creates wallet)
- Users don't see seed phrases unless they want to
- Progressive disclosure: use wallet → learn about it later

**Open question:** What happens to wallet when user wants to export/manage it?
- Privy supports export to MetaMask, etc.
- But most users won't do this
- Need clear UX for "your wallet, your keys, your responsibility"

**Long-term (Phase 2+):**
- Account abstraction maturity may solve this
- Smart wallets with social recovery
- Email/biometric access without seed phrases

---

## Success Metrics

**Quantitative:**
- 10,000+ active users (10x Phase 0)
- $1M+ in loans originated
- 50%+ lenders from outside Farcaster
- Liquidity pools launched with $100K+ TVL
- 85%+ repayment rate (may be lower than Phase 0 due to larger loans)

**Qualitative:**
- Cashflow verification works (predicts repayment)
- Hybrid model outperforms pure social trust for large loans
- Pools attract passive capital (LPs earn yield)
- Cross-platform sharing drives growth
- Borrowers prefer LendFriend over payday loans/banks

**Key milestone:** If pools reach $500K TVL with healthy utilization (70%+ of capital deployed), we've proven the market exists for uncollateralized crypto lending at scale.

---

## What's Next

**When Phase 1 succeeds** (pools active, cashflow model validated), we move to Phase 2:

→ [Phase 2: Automate Repayment](phase-2-automation.md)
- Auto-deduction from wallets (account abstraction)
- Merchant revenue sharing (Square, Shopify)
- Payment streams that repay loans automatically
- Invisible repayment experience

**Why this sequence matters:** Phase 1 proves we can underwrite risk accurately with cashflow data. Phase 2 makes repayment frictionless by automating it. Together, they create a complete uncollateralized lending system that scales.

---

## Related Pages

- [Phase 0: Prove Trust Works](phase-0-social-trust.md) - Social trust foundation
- [Vision](../vision.md) - The complete roadmap
- [Platform Expansion](../platform-expansion.md) - Multi-platform strategy
- [Risk Scoring](../how-it-works/risk-scoring/README.md) - How we assess risk
