# Vision & Roadmap

## Our Vision

A world where **your reputation is your collateral**, your network is your credit history, and your community is your underwriter.

---

## Platform Expansion Strategy

LendFriend starts on Farcaster and expands thoughtfully to other platforms, adapting our risk model based on signal quality research.

### Phase 1-2: Farcaster (2025-2026) ✅

**Why it's strongest:**
- Wallet-based identity (crypto signatures)
- Crypto-native community with shared context
- Neynar quality scores filter spam/bots
- Real relationships in tight-knit community

**Risk Model:**
- Repayment History: 40%
- Social Trust Score: 30% (high confidence)
- Loan Size Risk: 20%
- Account Quality: 10%

---

### Phase 2-3: Bluesky (2026) ⚠️

**Signal characteristics:**
- Domain-based verification (e.g., yourname.com)
- AT Protocol (decentralized, self-authenticating)
- Mix of real connections + strangers
- Better than Twitter, worse than Farcaster

**Adapted Risk Model:**
- Repayment History: 50% (↑10%)
- Social Trust Score: 20% (↓10%)
- Loan Size Risk: 20%
- Account Quality: 10% (+ domain verification bonus)

**Mitigation strategies:**
- Weight domain-verified accounts higher
- Cross-platform verification bonus (same user on Farcaster + Bluesky = more trustworthy)

---

### Phase 3: Twitter/X (2027) 🚨

**Signal challenges:**
- Research shows ~64% of accounts are bots
- "Less about real life friendships" (academic research)
- Follow-for-follow gaming common
- Anonymous accounts, email-based identity

**Heavily Adapted Model:**
- Repayment History: 60% (↑20%)
- Social Trust Score: 10% (↓20%)
- Loan Size Risk: 20%
- Account Quality: 10% (require verification)

**Requirements:**
- Twitter Blue verification required (paid = Sybil resistance)
- Use Twitter as supplementary data only, not primary
- Connections don't create social accountability because they're not real relationships

---

### Phase 2-3: On-Chain Reputation (2026-2027) ✅

**Why it's powerful:**
- Cryptographically verifiable credentials (can't fake)
- Crypto-native signals for crypto-native users
- No API restrictions or permissions needed
- Complements social trust with professional/community proof

**Data Sources:**
- **ENS ownership** - Long-held domains signal commitment
- **POAP collections** - Event attendance, community participation
- **DAO participation** - Governance voting, treasury contributions
- **GitHub contributions** - Verified developer work (for tech borrowers)
- **Base L2 transaction history** - On-chain income/spending patterns
- **Icebreaker credentials** - Verified work/education on Farcaster

**Risk Model Integration:**
- Repayment History: 40-50%
- Social Trust Score: 20-30%
- Loan Size Risk: 20%
- **On-Chain Reputation: 10-20%** (NEW)

**Why this matters:**
Many crypto borrowers have non-traditional employment (DAO contributors, freelance devs, indie projects). Traditional employment/education data would penalize them. On-chain reputation captures their actual economic activity and community standing.

**Example signals:**
- Holds ENS domain >2 years + 50+ POAPs + active DAO voter = high reputation
- Regular Base L2 transactions for 6+ months = consistent income
- Icebreaker verified credentials + GitHub contributions = professional proof

---

### Why Not Facebook? ❌

**API Access Blockers:**
- `user_friends` permission restricted to "limited partners" requiring Facebook review
- Even if approved, only shows friends who **also use your app** (circular dependency)
- 2016: Facebook explicitly stopped letting lenders access user data post-Cambridge Analytica
- Only ~20% user opt-in rate for friend permissions under current policies

**Signal Quality Issues:**
- Research shows only **BFFs** (friends who actually interact) predict defaults, not nominal connections
- Facebook API doesn't provide interaction data—only friend lists
- Microfinance study found interest-based data performed as well as nominal friend networks

**The Mutual App Problem:**
> "user_friends only provides access to those users who have also logged in with the same app and mutually granted the user_friends permission"

This creates a bootstrapping death spiral: can't get social graph data until both borrower AND lender already use LendFriend.

**Better alternatives:** On-chain reputation (ENS, POAPs, DAO participation), Icebreaker credentials, LinkedIn professional connections.

---

## Research Foundation

**Facebook vs Twitter study findings:**
> "Facebook is more focused towards making social connections, while Twitter is all about staying informed... Facebook is typically full of people users have met... while Twitter is less about 'real life' friendships, and it's normal to connect with strangers."

**Credit scoring implications:**
- Twitter connections don't create social accountability because they're not real relationships
- Research shows lenders using Facebook connections see predictive value, but Twitter follows are noise

**Key insight:**
As we expand platforms, we shift from social trust → repayment history. Farcaster lets us bootstrap with social trust because connections are real. Twitter requires traditional credit history because connections are noise.

---

## The Three Phases

### Phase 1: Bootstrap Trust (Q4 2025 - Q1 2026)

Pure altruistic lending at 0% interest to prove the primitive works.

**What we're building:**
- $100-$5,000 community loans
- Farcaster-native identity
- Multi-signal reputation scoring
- Transparent on-chain repayments

**What we're learning:**
- Repayment behavior patterns (on-time, early, tipping %)
- Trust network topology
- Social signal predictiveness
- Tipping behavior as reliability signal
- Community dynamics at scale

**Success metric:** 500-1,000 users, 3-6 months of clean behavioral data, proven that reputation-backed 0% interest loans can work.

---

### Phase 2: Scale with Algorithms (Q2 2026+)

Layer in cash flow data for larger loans with socially-appropriate interest.

**New capabilities:**
- $10k-$25k+ loan sizes
- Bank account cash flow (Plaid)
- On-chain revenue verification
- Algorithmic underwriting (0-5%)
- Revenue-based repayment

**The model:**
- Hybrid social + financial signals
- Proven AUC ≈ 0.72-0.80 accuracy
- Auto-approval for qualified loans
- Dynamic risk-based pricing
- Continuous model improvement

**This isn't theory:** Prosper, Branch, and Tala all followed this exact evolution—start with social proof, gather data, scale with algorithms. We're doing the same, but transparent and on-chain.

---

### Phase 3: The Credit Network (2027+)

Transform multi-platform social graphs into a full credit network.

**Vision:**
- Multi-platform expansion (Bluesky, Twitter/X)
- Credit scoring primitive (portable reputation scores used across DeFi)
- Liquidity markets (secondary markets for loan participation)
- Institutional integration (traditional lenders using our risk models)
- Global accessibility (serving the 1.7B unbanked worldwide)

---

## Why This Matters

- **1.7B** unbanked adults globally
- **$100B+** annual payday loan market (US)
- **300%+** typical payday loan APR

Traditional finance has failed to serve billions of people. Web3 has the tools to fix this—persistent identity, transparent transactions, programmable trust—but until now, no one has built the primitive for uncollateralized lending.

LendFriend is that primitive. We're proving that **reputation can be collateral**, that **communities can be underwriters**, and that **algorithms can scale trust** without extracting predatory profits.

---

## Our Principles

### 🔍 Transparent by Default
All loans, repayments, and reputation scoring are on-chain and publicly auditable. No black boxes, no hidden fees, no surprises.

### 📊 Research-Driven
Every decision is backed by academic research and proven fintech evolution. We're not guessing—we're following the data.

### 🤝 Community-Governed
Borrowers and lenders are real people with persistent identities. Reputation matters. Community accountability matters.

### 💚 Mission-First
We start altruistic (0% interest) and evolve to sustainable (0-5% for larger loans). Not extractive. Not predatory. Just fair.

---

**For the full interactive vision page,** visit [lendfriend.org/vision](https://lendfriend.org/vision)
