# Anti-Gaming & Sybil Resistance

**What's proven:** Friends who contribute capital reduce defaults by 14%. Prosper.com validated this—capital-backed endorsements work, empty ones don't.

**What we're testing:** Whether quality filtering + network analysis + economic incentives resist Sybil attacks in crypto-native lending.

Phase 0 gathers data on what attack patterns emerge and which defenses actually work. We're not claiming proven solutions—we're testing hypotheses.

---

## The Honest Truth

| Defense Layer | Status | Evidence |
|---------------|--------|----------|
| **Quality filtering** | ✅ Validated | ML achieves 99%+ bot detection |
| **Capital requirements** | ✅ Validated | Prosper.com: 14% default reduction |
| **Network analysis** | ⚠️ Unproven | Testing hypothesis, may not work |
| **Market filtering** | 🤷 Logical | Makes sense, no research |
| **On-chain reputation** | 🤷 Logical | Makes Sybils expensive, untested |

**Our bet:** Layering these defenses creates resilience even if individual layers fail. Economic alignment (lenders risk capital) matters more than algorithmic perfection.

---

## Our Approach

**Principles:**
1. **Economic alignment > algorithms** — Lenders risk money, so market filtering matters most
2. **Test, don't claim** — Phase 0 reveals what works, what doesn't
3. **Iterate with data** — Adapt defenses based on real attack patterns

**Expected evolution:**
- Phase 0: Social trust + basic Sybil resistance
- Phase 1: Add cashflow verification (harder to fake bank statements than social graphs)
- Phase 2: Auto-repayment reduces strategic default incentives
- Phase 3+: Machine learning on repayment patterns, cross-platform reputation

---

## Defense Layers

### Layer 1: Quality Filtering (Validated)

**Neynar scores filter spam/bots:**
- 0-1 scale measures account quality
- Bot/spam accounts weighted near zero
- Research: ML achieves 99%+ bot detection accuracy

### Layer 2: Network Analysis (Unproven)

**We weight small selective networks higher:**
- Adamic-Adar algorithm penalizes large follower counts
- Following 10K people = weaker signal than 20 selective friends
- **Testing hypothesis:** Tight-knit networks are harder to fake at scale

**Why we're uncertain:** Research on Sybil defenses (SybilGuard, SybilLimit) assumed tight communities were harder to fake. Later studies found 70% of real Sybils had zero connections to other Sybils. The assumption didn't hold.

**Our bet:** Combined with quality filtering and capital requirements, network topology adds another barrier. Phase 0 will reveal if we're right.

### Layer 3: Temporal & On-Chain Signals (Baseline)

- Account age, connection stability, growth patterns
- Transaction history permanently recorded
- Loan size limits for new borrowers

---

### Layer 4: Economic Protections (Strongest Defense)

**Capital requirements — validated by Prosper.com:**
- Every contribution requires actual money, not endorsements
- Friends risk their capital if borrower defaults
- Eliminates "cheap talk" problem [[16]](../references.md#freedman-and-jin-2017)
- Friend bids reduce defaults by 14% [[12]](../references.md#iyer-et-al-2016)

**Market-based filtering:**
- Lenders vet borrowers or lose money
- High-risk loans don't fund (natural selection)
- No algorithmic perfection required

**Permanent on-chain reputation:**
- Default history visible to all future lenders
- Can't create fresh identity after default
- Makes Sybil attacks expensive (need capital + reputation for each identity)

**Short feedback loops (30-90 day loans):**
- Fast data on what signals predict repayment
- Rapid iteration on defense mechanisms

---

## What We Monitor For

We actively track potential attack vectors:

**Basic Sybil attacks:**
- Fake accounts to boost trust scores
- Artificial social connections
- Coordinated bot networks

**Sophisticated attacks:**
- Coordinated small networks (real people creating tight clusters of fake accounts)
- Time-based reputation farming (build trust with small loans, default on large one)
- Collusion rings (real accounts coordinate to defraud lenders)
- Unusual network topology (circular vouching patterns)
- Default clustering (multiple defaults from same social cluster)

Phase 0 data will reveal what attack patterns emerge in practice, allowing us to refine defenses accordingly.

---

**Next:** [Social Trust Scoring](social-trust-scoring/README.md) · [Risk Scoring](risk-scoring/README.md) · [Risk & Default Handling](risk-and-defaults.md)
