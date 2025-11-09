# Anti-Gaming & Sybil Resistance

We build on validated P2P lending research showing that friends who vouch with capital and lenders who evaluate borrowers significantly reduce defaults [[12]](../references.md#iyer-et-al-2016).

Phase 0 tests these findings on Farcaster and tracks emerging attack patterns, allowing us to deploy additional defenses if needed.

---

## Defense Status

| Defense Layer | Status | Evidence |
|---------------|--------|----------|
| **Friends vouch with capital** | ✅ Validated | Prosper.com: [14% default reduction](../references.md#iyer-et-al-2016) |
| **Lender evaluation** | ✅ Validated | Lenders predict [45% better than credit scores alone](../references.md#iyer-et-al-2016) |
| **Bot & spam filtering** | ✅ Validated | [Neynar](../references.md#quality-filtering-research), [Farcaster labels](../references.md#farcaster-spam-labels), [OpenRank](../references.md#openrank) |
| **On-chain reputation** | 🤷 Logical | Makes Sybils expensive |
| **Network analysis** | ✅ Validated | [Graph-based methods](../references.md#sybilrank) available if needed |

---

## Our Approach

**Principles:**
1. **Economic alignment > algorithms** — Lenders risk money, so lender evaluation matters most
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

**Friends vouch with capital:**
- Every contribution requires actual money, not endorsements
- Friends risk their capital if borrower defaults
- Eliminates "cheap talk" problem [[16]](../references.md#freedman-and-jin-2017)

**Lender evaluation:**
- Lenders use social and financial signals to assess borrowers [[12]](../references.md#iyer-et-al-2016)
- Early lenders signal quality, attracting others to participate [[84]](../references.md#zhang-liu-2012)
- Trust scores + on-chain reputation provide the information lenders need

---

### Layer 2: Bot & Spam Filtering (Validated)

**Farcaster-native quality signals:**
- **Neynar scores:** 0-1 scale measuring account quality [[87]](../references.md#quality-filtering-research)
- **Farcaster spam labels:** ML predictions based on activity patterns and community moderation [[90]](../references.md#farcaster-spam-labels)
- **OpenRank trust scores:** Graph-based reputation, updated every 2 hours [[89]](../references.md#openrank)

These systems filter low-quality accounts (bots, spammers, low-quality AI) before they impact trust scores.

### Layer 3: Temporal & On-Chain Signals

**Time-based protections:**
- Account age and connection stability
- Loan size limits for new borrowers
- Growth patterns flagged if suspicious
- Short loan terms (30-90 days) provide fast feedback on what predicts repayment

**Permanent on-chain reputation:**
- Default history visible to all future lenders
- Can't create fresh identity after default
- Makes Sybil attacks expensive (need capital + reputation for each identity)

### Layer 4: Network Analysis (Validated, Available If Needed)

**Available if sophisticated attacks emerge:**
- Graph neural networks (HGNNs) deployed at major financial institutions
- Behavioral pattern analysis: posting cadence, interaction networks, account evolution
- Community detection algorithms identify coordinated fraud rings
- Farcaster-specific signals: FID history, reaction patterns, content repetition

Economic protections (friends vouch with capital + lender evaluation) come first. These methods are deployed by major platforms and available if needed.

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
