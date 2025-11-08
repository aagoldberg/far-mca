# Anti-Gaming & Sybil Resistance

We build on validated P2P lending research: capital-backed social trust reduces defaults by 14% [[12]](../references.md#iyer-et-al-2016), and lenders predict defaults 45% better than credit scores alone [[12]](../references.md#iyer-et-al-2016).

Phase 0 validates these findings in crypto-native contexts and gathers data on emerging attack patterns, allowing us to deploy additional defenses (SybilRank, Louvain, GNNs) if sophisticated attacks emerge.

---

## Defense Status

| Defense Layer | Status | Evidence |
|---------------|--------|----------|
| **Quality filtering** | ✅ Validated | ML achieves [99%+ bot detection](../references.md#quality-filtering-research) |
| **Capital requirements** | ✅ Validated | Prosper.com: [14% default reduction](../references.md#iyer-et-al-2016) |
| **Market filtering** | ✅ Validated | Lenders predict [45% better than credit scores alone](../references.md#iyer-et-al-2016) |
| **Network analysis** | ✅ Validated | [SybilRank: 90% accuracy](../references.md#sybilrank) (not integrated yet) |
| **On-chain reputation** | 🤷 Logical | Makes Sybils expensive |

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

### Layer 2: Network Analysis (Validated, Available If Needed)

**Validated methods available if attacks emerge:**
- **SybilRank:** 90% accuracy, deployed at Tuenti (Spain's largest social network) [[85]](../references.md#sybilrank)
- **Louvain algorithm:** 88% accuracy for fraud ring detection in financial networks [[86]](../references.md#louvain-fraud)
- **Graph Neural Networks:** Detect collusion through network topology
- Used in production by major platforms for Sybil/fraud detection

Phase 0 focuses on economic protections (capital requirements + market filtering). If sophisticated network-based attacks emerge, we can deploy these validated methods.

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

**Market-based filtering — validated by Prosper.com:**
- Lenders predict defaults **45% better** than credit scores alone [[12]](../references.md#iyer-et-al-2016)
- Strategic herding improves outcomes: 1% bid increase → 15% more bids [[84]](../references.md#zhang-liu-2012)
- Loans with more herding have **better repayment performance** [[84]](../references.md#zhang-liu-2012)
- Early lenders signal quality, attracting informed follow-on lenders [[84]](../references.md#zhang-liu-2012)

**Caveat:** Market filtering requires good information. Lenders make systematic errors when information is poor [[12]](../references.md#iyer-et-al-2016). Our trust scores + on-chain reputation provide the information environment lenders need.

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
