# Anti-Gaming & Sybil Resistance

Uncollateralized lending based on social signals creates obvious attack vectors. Here's how we defend against gaming—and what we can't prevent.

---

## The Attack Vectors

**Basic Sybil attacks:**
- Create fake accounts to boost trust scores
- Build artificial social connections
- Self-vouch through coordinated bot networks

**Sophisticated attacks:**
- Coordinated small networks (real people creating tight clusters of fake accounts)
- Time-based reputation farming (build trust with small loans, default on large one)
- Collusion rings (real accounts coordinate to defraud lenders and split proceeds)
- Strategic gaming (exploit algorithm weaknesses we haven't discovered yet)

---

## Our Defenses

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

## What We Can't Prevent

**Sophisticated collusion:**
Real people with legitimate accounts coordinating to defraud lenders. If 10 friends with genuine Farcaster profiles vouch for someone who defaults and they split the proceeds, our algorithm can't detect this—it looks like legitimate social support.

**Reputation farming:**
A borrower could successfully repay 5 small loans ($500 each) to build trust, then default on one large loan ($5K). The cumulative loss outweighs the trust built.

**Zero-day exploits:**
Attack patterns we haven't discovered yet. Every system has unknown vulnerabilities.

---

## Our Approach

{% hint style="info" %}
**Phase 0 is data collection**

We're not claiming algorithmic perfection. We're gathering real-world behavioral data to understand:
- Which trust signals actually predict repayment
- What attack patterns emerge in practice
- How lenders naturally filter high-risk loans
- Where our assumptions were wrong

The defenses above are our starting point. They'll evolve as we learn.
{% endhint %}

**Principles:**
1. **Economic alignment > algorithmic perfection** — Lenders risk their own money, so market filtering matters most
2. **Iterate with data** — Phase 0 reveals attack patterns, we adapt defenses
3. **Transparent limitations** — We acknowledge what we can't prevent
4. **Multi-layered approach** — No single defense is perfect; layers create resilience

**Expected evolution:**
- Phase 0: Social trust + basic Sybil resistance
- Phase 1: Add cashflow verification (harder to fake bank statements than social graphs)
- Phase 2: Auto-repayment reduces strategic default incentives
- Phase 3+: Machine learning on repayment patterns, cross-platform reputation

---

## Why Lenders Should Still Trust This

**Traditional credit scoring has fraud too:**
- Identity theft
- Synthetic identities
- Credit repair scams
- Bust-out fraud

No system is perfect. The question is: **does social trust provide useful signal despite gaming attempts?**

Research suggests yes:
- Grameen Bank: 97-98% repayment with social accountability[[9]](../references.md#grameen-bank)
- Prosper.com: Friend endorsements reduce defaults by 22%[[3]](../references.md#iyer-et-al-2016)
- Social proximity improves repayment by 10 percentage points[[6]](../references.md#karlan-et-al-2009)

Gaming exists in every lending system. Social trust isn't perfect—it's **better than the alternative** for people without traditional credit history.

---

## Reporting Suspicious Activity

See something suspicious? We track:
- Coordinated account creation patterns
- Unusual network topology (circular vouching)
- Reputation farming behaviors
- Default clustering (multiple defaults from same social cluster)

Phase 0 data will inform what "suspicious" actually looks like in practice.

---

**Next:** [Social Trust Scoring](social-trust-scoring/README.md) · [Risk Scoring](risk-scoring/README.md) · [Risk & Default Handling](risk-and-defaults.md)
