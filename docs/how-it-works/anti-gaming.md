# Anti-Gaming & Sybil Resistance

We combine algorithmic filtering with economic incentives to resist manipulation.

**Our defense:** Quality algorithms detect fake accounts. Network analysis catches artificial connections. But our strongest protection is economic—lenders risk their own money, so they filter bad loans naturally.

**Research validates this:** Empty endorsements on Prosper.com led to higher defaults. Capital-backed endorsements led to better repayment. We require capital, not words.

---

## Why This Model Works

**Research validation of capital-backed social trust:**
- Empty endorsements on Prosper.com led to **higher defaults**[[16]](../references.md#freedman-and-jin-2017)
- Capital-backed endorsements led to **better repayment**[[16]](../references.md#freedman-and-jin-2017)
- Social proximity improves repayment by 10 percentage points[[6]](../references.md#karlan-et-al-2009)
- Friend endorsements with money reduce defaults by 22%[[3]](../references.md#iyer-et-al-2016)

**Proven at scale:**
- Grameen Bank: 97-98% repayment (9.6M borrowers)[[9]](../references.md#grameen-bank)
- Kiva: 96.3% repayment ($1.8B+ loans)[[10]](../references.md#kiva)

LendFriend requires capital, not empty words. Research shows this distinction matters.

---

## Our Approach

{% hint style="info" %}
**Phase 0 is data collection**

We're not claiming algorithmic perfection. We're gathering real-world behavioral data to understand:
- Which trust signals actually predict repayment
- What attack patterns emerge in practice
- How lenders naturally filter high-risk loans
- Where our assumptions were wrong

The defenses below are our starting point. They'll evolve as we learn.
{% endhint %}

**Principles:**
1. **Economic alignment > algorithmic perfection** — Lenders risk their own money, so market filtering matters most
2. **Iterate with data** — Phase 0 reveals attack patterns, we adapt defenses
3. **Multi-layered approach** — No single defense is perfect; layers create resilience

**Expected evolution:**
- Phase 0: Social trust + basic Sybil resistance
- Phase 1: Add cashflow verification (harder to fake bank statements than social graphs)
- Phase 2: Auto-repayment reduces strategic default incentives
- Phase 3+: Machine learning on repayment patterns, cross-platform reputation

---

## Defense Mechanisms

### Algorithmic Protections

**Quality filtering:**
- Neynar quality scores (0-1 scale) filter spam/bot accounts
- Low activity accounts weighted down
- Bot/spam accounts effectively zeroed out

**Network structure analysis:**
- Adamic-Adar penalizes large networks (following 10K people = weak signal)
- Mutual friend overlap required (can't fake tight-knit clusters at scale)
- Small selective networks weighted higher than influencer connections

**Temporal signals:**
- Account age matters
- Connection age and stability tracked
- Sudden network growth patterns flagged

**On-chain constraints:**
- Loan size limits for new borrowers
- Gradual trust building required
- Every transaction permanently recorded

---

### Economic Protections

**Capital requirements (not empty endorsements):**

Research on Prosper.com revealed a critical distinction: **empty friend endorsements led to worse repayment**, but **endorsements backed by capital led to better repayment**[[16]](../references.md#freedman-and-jin-2017).

Early Prosper allowed friends to "endorse" borrowers without contributing money—pure social signaling. **Result:** Borrowers with these endorsements were **more likely to default**. The problem: cheap talk. Friends could vouch without consequences.

When friends contributed actual capital alongside their endorsement, repayment improved significantly. **Why:** Aligned incentives. Friends lose money if the borrower defaults.

**LendFriend requires capital:** Every "vouching" transaction requires friends to contribute actual money. No empty endorsements. This eliminates the cheap talk problem that plagued early P2P platforms.

**Lenders risk their own capital:**
- Market-based filtering (lenders vet borrowers or lose money)
- No algorithmic perfection required—humans decide
- High-risk loans don't fund (natural selection)

**Reputation is permanent:**
- Default history visible to all future lenders
- Can't create fresh identity after default
- Borrowers self-select appropriate amounts

**Short feedback loops:**
- 30-90 day loan terms (Phase 0)
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

Phase 0 data will reveal what attack patterns actually emerge in practice, allowing us to refine defenses accordingly.

---

## Reporting Suspicious Activity

See something suspicious? We track patterns that may indicate gaming:
- Coordinated account creation
- Unusual network topology
- Reputation farming behaviors
- Default clustering

Phase 0 data will inform what "suspicious" actually looks like in practice.

---

**Next:** [Social Trust Scoring](social-trust-scoring/README.md) · [Risk Scoring](risk-scoring/README.md) · [Risk & Default Handling](risk-and-defaults.md)
