# Vision & Roadmap

→ **For complete vision and strategy:** [lendfriend.org/vision](https://lendfriend.org/vision)

This section provides technical implementation documentation for our three-phase evolution from social trust to automated, scalable uncollateralized lending infrastructure.

---

## Three-Phase Technical Evolution

```mermaid
graph LR
    A[Phase 0<br/>Social Trust<br/>2024-2025] --> B[Phase 1<br/>Cashflow Data<br/>2025-2026]
    B --> C[Phase 2<br/>Automation<br/>2026-2027]

    A --> A1[Zero-interest loans<br/>$100-$5K]
    A --> A2[Farcaster identity<br/>Social graph]
    A --> A3[On-chain reputation<br/>Base L2]

    B --> B1[Cashflow verification<br/>Plaid/Square]
    B --> B2[Liquidity pools<br/>Passive lending]
    B --> B3[Interest 0-8%<br/>$5K-$50K+]

    C --> C1[Auto-repayment<br/>Smart wallets]
    C --> C2[Merchant integration<br/>Square/Shopify]
    C --> C3[Payment streams<br/>ERC-4337]

    style A fill:#a7f3d0
    style B fill:#ddd6fe
    style C fill:#e5e7eb
```

---

## Technical Architecture Overview

```mermaid
graph TB
    subgraph Frontend["Frontend Layer"]
        Web[Web App<br/>Next.js 15]
        Frame[Farcaster Mini App<br/>Frame SDK]
    end

    subgraph Identity["Identity & Social"]
        FC[Farcaster<br/>Neynar API]
        Privy[Privy<br/>Auth + Wallets]
        Social[Social Graph<br/>Trust Scoring]
    end

    subgraph Blockchain["Blockchain Layer (Base L2)"]
        Factory[MicroLoanFactory<br/>Deploys loans]
        Loan[MicroLoan<br/>Individual contracts]
        USDC[USDC Token<br/>ERC-20]
    end

    subgraph Data["Data & Indexing"]
        Graph[The Graph<br/>Subgraph]
        IPFS[IPFS<br/>Pinata]
    end

    Web --> FC
    Web --> Privy
    Frame --> FC

    FC --> Social
    Privy --> Loan

    Social -.Trust Score.-> Web

    Factory --> Loan
    Loan --> USDC

    Loan --> Graph
    Web --> IPFS
    Graph --> Web

    style Frontend fill:#dbeafe
    style Identity fill:#fef3c7
    style Blockchain fill:#d1fae5
    style Data fill:#e9d5ff
```

---

## Phase Documentation

### Phase 0: Prove Trust Works

**Focus:** Zero-interest loans backed by social trust signals

**Key Technical Components:**
- Smart contracts (MicroLoan.sol, MicroLoanFactory.sol)
- Farcaster social graph integration
- Trust scoring algorithm (Adamic-Adar weighted)
- Base L2 deployment
- The Graph subgraph indexing

→ [Phase 0 Technical Implementation](vision/phase-0-social-trust.md)

---

### Phase 1: Scale with Cashflow

**Focus:** Hybrid underwriting with cashflow verification

**Key Technical Components:**
- Plaid API integration (bank accounts)
- Square/Shopify API integration (merchant revenue)
- Liquidity pool smart contracts
- Interest calculation and accrual
- Hybrid risk scoring model

→ [Phase 1 Technical Implementation](vision/phase-1-cashflow.md)

---

### Phase 2: Automate Repayment

**Focus:** Programmable repayment automation

**Key Technical Components:**
- ERC-4337 account abstraction
- Payment stream plugins
- Merchant OAuth and auto-deduction
- Revenue-based repayment logic
- Smart wallet integrations

→ [Phase 2 Technical Implementation](vision/phase-2-automation.md)

---

## Risk Model Evolution

```mermaid
graph LR
    subgraph Phase0["Phase 0: Pure Social Trust"]
        S0[Social Trust 60%]
        R0[Repayment History 30%]
        L0[Loan Size 10%]
    end

    subgraph Phase1["Phase 1: Hybrid Model"]
        S1[Social Trust 30%]
        C1[Cashflow 30%]
        R1[Repayment History 30%]
        L1[Loan Size 10%]
    end

    subgraph Phase2["Phase 2: Data-Driven"]
        C2[Cashflow 40%]
        R2[Repayment History 40%]
        S2[Social Trust 15%]
        L2[Loan Size 5%]
    end

    Phase0 --> Phase1
    Phase1 --> Phase2

    style Phase0 fill:#a7f3d0
    style Phase1 fill:#ddd6fe
    style Phase2 fill:#e5e7eb
```

**Evolution rationale:**
- **Phase 0:** Test pure social accountability
- **Phase 1:** Add objective data as loans scale
- **Phase 2:** Prioritize verifiable cashflow and track record

---

## Infrastructure Readiness

```mermaid
graph TD
    subgraph Ready["Available Today"]
        FC[Farcaster API<br/>Social graph]
        Base[Base L2<br/>$0.01 txns]
        USDC[USDC Stablecoin<br/>ERC-20]
        Plaid[Plaid API<br/>Bank data]
        Square[Square API<br/>Merchant sales]
    end

    subgraph Developing["Maturing 2025-2026"]
        AA[Account Abstraction<br/>ERC-4337]
        Streams[Payment Streams<br/>Plugins]
        Shopify[Shopify Crypto<br/>Wallets]
    end

    subgraph Future["Future 2026+"]
        zkTLS[zkTLS Proofs<br/>Privacy]
        Credit[Credit Scoring<br/>Portable]
        Multi[Multi-chain<br/>Expansion]
    end

    Ready --> Developing
    Developing --> Future

    style Ready fill:#d1fae5
    style Developing fill:#fef3c7
    style Future fill:#e5e7eb
```

---

## Data Flow: Loan Lifecycle

```mermaid
sequenceDiagram
    participant B as Borrower
    participant W as Web App
    participant F as Factory Contract
    participant L as Loan Contract
    participant Le as Lender
    participant G as The Graph

    B->>W: Create loan request
    W->>F: Deploy new loan
    F->>L: Create MicroLoan contract
    L->>G: Emit LoanCreated event

    Le->>W: View loan + trust score
    W-->>Le: Display social proximity
    Le->>L: Contribute USDC
    L->>G: Emit Contribution event

    Note over L: Fundraising complete

    B->>L: Disburse funds
    L->>B: Transfer USDC
    L->>G: Emit Disbursed event

    Note over B: Borrower earns/repays

    B->>L: Repay (flexible timing)
    L->>G: Emit Repayment event

    Le->>L: Claim pro-rata share
    L->>Le: Transfer repayment
    L->>G: Emit Claimed event
```

---

## Technical Constraints by Phase

| Constraint | Phase 0 | Phase 1 | Phase 2 |
|------------|---------|---------|---------|
| **Interest** | 0% (hardcoded) | 0-8% variable | 0-15% variable |
| **Loan Size** | $100-$5K | $5K-$50K+ | $10K-$100K+ |
| **Repayment** | Manual, single maturity | Manual, installments | Auto-deduction |
| **Identity** | Farcaster only | Farcaster + Bluesky | Multi-platform |
| **Verification** | Social trust only | Social + cashflow | Cashflow primary |
| **Liquidity** | Direct P2P | Pools + P2P | Pools only |

---

## Related Documentation

**For non-technical overview:**
- [Vision & roadmap](https://lendfriend.org/vision) — High-level strategy
- [How it works](https://lendfriend.org/how-it-works) — User-friendly explanation
- [Whitepaper](https://lendfriend.org/whitepaper) — Complete manifesto

**Technical deep dives:**
- [Smart Contract Flow](how-it-works/smart-contract-flow.md)
- [Social Trust Scoring](how-it-works/social-trust-scoring/README.md)
- [Risk Scoring](how-it-works/risk-scoring/README.md)
- [Technical Stack](how-it-works/technical-stack.md)

**Research foundation:**
- [Academic Research](references.md) — 30+ peer-reviewed papers
- [Motivation](motivation.md) — Why uncollateralized lending matters
