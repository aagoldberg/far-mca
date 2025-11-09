# Anti-Gaming & Sybil Resistance

We build on validated P2P lending research: capital-backed social trust reduces defaults by 14% [[12]](../references.md#iyer-et-al-2016), and lenders predict defaults 45% better than credit scores alone [[12]](../references.md#iyer-et-al-2016).

Phase 0 validates these findings in crypto-native contexts and gathers data on emerging attack patterns, allowing us to deploy additional graph-based and behavioral defenses if sophisticated attacks emerge.

---

## Defense Status

| Defense Layer | Status | Evidence |
|---------------|--------|----------|
| **Friends vouch with capital** | ✅ Validated | Prosper.com: [14% default reduction](../references.md#iyer-et-al-2016) |
| **Market filtering** | ✅ Validated | Lenders predict [45% better than credit scores alone](../references.md#iyer-et-al-2016) |
| **Quality filtering** | ✅ Validated | ML achieves [99%+ bot detection](../references.md#quality-filtering-research) |
| **On-chain reputation** | 🤷 Logical | Makes Sybils expensive |
| **Network analysis** | ✅ Validated | [Graph-based methods](../references.md#sybilrank) available if needed |

**Our bet:** Layering these defenses creates resilience even if individual layers fail. Economic alignment (lenders risk capital) matters more than algorithmic perfection.

---

## Our Approach

**Principles:**
1. **Economic alignment > algorithms** — Lenders risk money, so market filtering matters most
2. **Data-driven iteration** — Phase 0 reveals what works, we adapt accordingly
3. **Layered defense** — Multiple protections create resilience

**Expected evolution:**
- Phase 0: Social trust + basic Sybil resistance
- Phase 1: Add cashflow verification (harder to fake bank statements than social graphs)
- Phase 2: Auto-repayment reduces strategic default incentives
- Phase 3+: Machine learning on repayment patterns, cross-platform reputation

---

## Defense Layers

### Layer 1: Economic Protections (Strongest Defense)

**Friends vouch with capital — validated by Prosper.com:**
- Every contribution requires actual money, not endorsements
- Friends risk their capital if borrower defaults
- Eliminates "cheap talk" problem [[16]](../references.md#freedman-and-jin-2017)
- Friend capital contributions reduce defaults by 14% [[12]](../references.md#iyer-et-al-2016)

**Market-based filtering — validated by Prosper.com:**
- Lenders predict defaults **45% better** than credit scores alone [[12]](../references.md#iyer-et-al-2016)
- Strategic herding improves outcomes: 1% bid increase → 15% more bids [[84]](../references.md#zhang-liu-2012)
- Loans with more herding have **better repayment performance** [[84]](../references.md#zhang-liu-2012)
- Early lenders signal quality, attracting informed follow-on lenders [[84]](../references.md#zhang-liu-2012)

**Why it works:** Market filtering requires good information [[12]](../references.md#iyer-et-al-2016). Trust scores + on-chain reputation give lenders what they need to make smart decisions.

**Permanent on-chain reputation:**
- Default history visible to all future lenders
- Can't create fresh identity after default
- Makes Sybil attacks expensive (need capital + reputation for each identity)

**Short feedback loops (30-90 day loans):**
- Fast data on what signals predict repayment
- Rapid iteration on defense mechanisms

---

### Layer 2: Quality Filtering (Validated)

**Neynar scores filter spam/bots:**
- 0-1 scale measures account quality
- Bot/spam accounts weighted near zero
- Research: ML achieves 99%+ bot detection accuracy

### Layer 3: Temporal & On-Chain Signals

**Basic fraud deterrents:**
- Account age and connection stability matter
- Transaction history permanently recorded
- Loan size limits for new borrowers
- Growth patterns flagged if suspicious

### Layer 4: Network Analysis (Validated, Available If Needed)

**Modern graph-based detection methods combine structural and behavioral signals:**
- Graph neural networks (HGNNs) deployed at major financial institutions for fraud detection
- Behavioral pattern analysis: posting cadence, interaction networks, account evolution
- Community detection algorithms identify coordinated fraud rings
- Farcaster-specific signals: FID history, reaction patterns, content repetition

**Our stack approach:** Economic protections come first. If sophisticated network attacks emerge, we deploy these validated methods used in production by major platforms.

---

## Attack Vectors We Track

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

Phase 0 data reveals which attacks emerge. We adapt defenses based on real patterns.

---

**Next:** [Social Trust Scoring](social-trust-scoring/README.md) · [Risk Scoring](risk-scoring/README.md) · [Risk & Default Handling](risk-and-defaults.md)
