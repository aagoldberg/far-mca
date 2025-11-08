# Social Trust Scoring

LendFriend uses **social collateral**—your network on Farcaster—as proof of creditworthiness. When friends contribute to your loan, they vouch for you with both money and reputation.

---

## How It Works

1. **You request a loan** and share it to your network
2. **Friends contribute** - their backing signals you're trustworthy
3. **We measure connection strength** using shared mutual friends
4. **Lenders see trust scores** and decide whether to fund

Close friends with small networks carry more weight than distant followers of influencers. Someone with 20 selective friends signals stronger trust than a stranger with 10,000 connections.

{% hint style="success" %}
**Research shows it works:**
- Grameen Bank: 97-98% repayment rate (9.6M borrowers) [[9]](../../references.md#grameen-bank)
- Kiva: 96.3% repayment rate ($1.8B+ loans) [[10]](../../references.md#kiva)
- Social proximity improves repayment by 10 percentage points [[6]](../../references.md#karlan-et-al-2009)
{% endhint %}

---

## The Algorithm

We use **Adamic-Adar Index** to weight connections by how selective they are:

**Core insight:** A mutual friend with 20 connections is a stronger signal than one with 20,000.

```
For each mutual connection:
  weight = 1 / log(total_connections)

Trust Score = Σ weights × quality_scores
```

Research shows Adamic-Adar is 82% more accurate than simple friend counting [[7]](../../references.md#adamic-and-adar-2003).

**The specific thresholds and bonuses will be refined as we collect repayment data.** Phase 0 focuses on gathering behavioral data to understand which trust signals best predict repayment.

→ [View technical details](the-algorithm.md)

---

## Risk Tiers

Every lender-borrower pair gets a trust score (0-100) and risk classification:

| Risk Level | Trust Score | Meaning |
|-----------|-------------|---------|
| 🟢 **LOW RISK** | ≥60 | Close social ties, tight-knit community |
| 🟡 **MEDIUM RISK** | 30-59 | Some shared connections |
| 🔴 **HIGH RISK** | <30 | Few or no mutual connections |

Loans also show **Support Strength** - what percentage of lenders know the borrower.

---

## How Loans Get Funded

Social trust creates natural funding progression:

1. **Close friends fund first** (small amounts, high trust)
2. **Extended network sees validation** (joins in)
3. **Strangers feel safe** (validated by early lenders)

This mirrors traditional lending - ask family first, then friends, then institutions.

---

## Anti-Gaming

Creating fake accounts and gaming trust scores is a natural concern. We use algorithmic defenses (quality filtering, Adamic-Adar weighting) combined with economic incentives (lenders risk their own capital) to resist manipulation.

**Key defenses:**
- Quality filtering removes bots/spam
- Adamic-Adar penalizes large networks
- Real community overlap required
- Lenders vet borrowers (market filtering)

→ **[Read full security analysis](../anti-gaming.md)** — Covers attack vectors, defenses, limitations, and our iterative approach

---

## Why Adamic-Adar?

**Research shows social proximity predicts repayment** - close connections reduce defaults by 13% [[19]](../../references.md#karlan-et-al-2009).

We chose Adamic-Adar because it mathematically captures what matters:
- **Selective connections count more** than large follower lists
- **Mutual close friends** signal stronger accountability
- **Fast to compute** from partial social graph data

The algorithm was designed for link prediction, not lending - **we're testing whether it translates to repayment prediction in Phase 0.**

---

**Next:** [The Algorithm](the-algorithm.md) · [Risk Scoring](../risk-scoring/README.md) · [Research](../../references.md)
