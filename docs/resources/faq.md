# Frequently Asked Questions

{% hint style="info" %}
Can't find what you're looking for? Join our community on [Farcaster](https://warpcast.com/lendfriend) or check our [GitHub discussions](https://github.com).
{% endhint %}

---

## For Borrowers

### How much can I borrow?

LendFriend doesn't set hard limits on loan amounts. Instead, the market decides through **risk grades**. Your borrowing capacity depends on:
- Your social network strength
- Your repayment history (if any)
- How much you're requesting relative to your network

**First-time borrowers** typically start with $50-200 loans. As you build repayment history, larger amounts become viable.

→ [Learn more about loan constraints](../how-it-works/risk-scoring/loan-constraints.md)

---

### What if I can't repay on time?

{% hint style="warning" %}
Defaulting damages your reputation with friends who lent to you and makes future borrowing difficult.
{% endhint %}

**Before default:**
- Communicate with your lenders early
- Your social connections see non-payment
- Future loans will be much harder to secure

**After default:**
- Your on-chain history shows the default
- Close friends may feel personally let down
- You'll need to rebuild trust before borrowing again

→ [Learn more about defaults](../how-it-works/risk-and-defaults.md)

---

### How long do loans last?

All loans currently have **90-day terms** (3 months) with lump sum repayment at maturity.

As the platform matures, we'll introduce longer terms (6 months, 12 months) for qualified borrowers with proven repayment history.

→ [Learn more about loan duration](../how-it-works/risk-scoring/loan-constraints.md)

---

### Do I need to make monthly payments?

No. LendFriend loans use **lump sum repayment**—you pay back the full amount at the end of the 90-day term.

Research shows less frequent repayments don't increase default rates while reducing stress and transaction costs for borrowers.

---

### Can I tip my lenders when I repay?

Yes! You can repay more than the principal amount, and the extra automatically distributes proportionally among all lenders as a tip.

**Example:**
- You borrowed $100 total ($30 from Alice, $70 from Bob)
- You repay $110 ($10 tip)
- Alice receives $33 ($3 tip), Bob receives $77 ($7 tip)

Tips show gratitude, strengthen your reputation, and signal financial health. Even small tips (5-10%) make a significant impression on future loan applications.

{% hint style="success" %}
**Impact on Reputation**: Borrowers who tip build stronger social connections and typically see faster funding on subsequent loans.
{% endhint %}

---

### How do I get a better risk grade?

Your risk grade improves through:
- **Building social connections** on Farcaster
- **Starting with smaller loans** ($50-200) first
- **Repaying on time** to build on-chain history
- **Having friends contribute early** to your loans

{% hint style="success" %}
**Pro Tip**: Ask close friends to contribute first. Their participation signals trust to other potential lenders.
{% endhint %}

→ [Learn more about risk grades](../how-it-works/risk-scoring/risk-grades.md)

---

### Is there interest on loans?

Currently, LendFriend loans are **zero-interest**. This bootstraps the network and allows social trust mechanisms to mature.

As the platform develops, we'll introduce market-rate interest through a community-governed evolution process.

→ [Learn more about our roadmap](../vision.md)

---

## For Lenders

### How do I know if I should fund a loan?

Check two key metrics:

1. **Your personal trust score** with the borrower (0-100)
   - **60+** (🟢 LOW RISK): Close social ties, fund confidently
   - **30-59** (🟡 MEDIUM RISK): Some connections, proceed with caution
   - **<30** (🔴 HIGH RISK): Minimal connection, only fund if you can afford to lose it

2. **Loan support strength** (percentage of lenders who know borrower)
   - **60%+** (🟢 STRONG): Most lenders know borrower
   - **30-59%** (🟡 MODERATE): Some network validation
   - **<30%** (🟠 WEAK): Few connections, high risk

→ [Learn more about risk tiers](../how-it-works/social-trust-scoring/risk-tiers.md)

---

### What happens if a borrower defaults?

{% hint style="danger" %}
LendFriend loans are uncollateralized. If a borrower doesn't repay, you cannot recover funds through legal means.
{% endhint %}

**Your recourse:**
- Social pressure through shared network
- Borrower's on-chain reputation is permanently damaged
- Future lending to that borrower becomes extremely difficult

**Minimize risk by:**
- Funding borrowers with high trust scores (60+)
- Diversifying across multiple loans ($10 to 10 loans > $100 to 1 loan)
- Contributing early if you're close friends (signals confidence to others)

→ [Learn more about defaults](../how-it-works/risk-and-defaults.md)

---

### Can I earn interest on my loans?

Not currently. LendFriend starts with **zero-interest loans** to bootstrap social trust mechanisms.

This will evolve through community governance as the platform matures and collects repayment data.

→ [Learn more about our evolution strategy](../vision.md)

---

### Can borrowers tip me when they repay?

Yes. Borrowers can repay more than the principal amount, and any overpayment automatically distributes proportionally among all lenders.

**How it works:**
- Borrower repays 110% instead of 100%
- Your share: (your contribution / total principal) × total repayment
- If you funded 30% of the loan, you receive 30% of the 110%

Tips are voluntary and signal:
- Borrower's financial health
- Gratitude for your support
- Strong social accountability

While loans are zero-interest, tips provide a way for borrowers to express appreciation and build reputation.

---

### How do trust scores work?

Trust scores measure social proximity using the **Adamic-Adar Index**:

- Counts mutual connections between you and borrower
- Weights connections by how "selective" they are
- Close friend with 20 connections counts 3× more than influencer with 10,000
- Filters out bots/spam accounts

Scores range from 0-100:
- **60+**: Close social ties
- **30-59**: Friends-of-friends
- **<30**: Strangers or distant connections

→ [Learn more about the algorithm](../how-it-works/social-trust-scoring/the-algorithm.md)

---

### Should I fund strangers with low trust scores?

Generally **no**, unless the loan has **STRONG support** (60%+ of other lenders know the borrower).

**Why low-trust lending is risky:**
- Minimal social accountability
- No personal relationship for repayment pressure
- Higher historical default rates

**When it might work:**
- Loan has strong network validation from others
- You're diversifying small amounts across many loans
- You're comfortable with potential loss

{% hint style="warning" %}
**Best Practice**: Focus lending on borrowers you have medium-to-high trust scores with, or loans with strong support from connected lenders.
{% endhint %}

---

### How can I see a borrower's repayment history?

Repayment history is stored on-chain and visible in the borrower's profile.

For new borrowers with no history, rely on:
- **Trust scores** (social proximity)
- **Support strength** (how many connected lenders are funding)
- **Risk grades** (algorithmic assessment combining factors)

→ [Learn more about risk scoring](../how-it-works/risk-scoring/README.md)

---

## Technical Questions

### What blockchain is LendFriend on?

LendFriend operates on **Base L2** (Ethereum Layer 2), offering:
- Low transaction costs (~$0.01)
- Fast confirmation times
- Ethereum-level security
- Easy integration with Farcaster

→ [Learn more about our technical stack](../how-it-works/technical-stack.md)

---

### How are trust scores calculated?

Trust scores are calculated **off-chain** using Farcaster social graph data via Neynar API:

1. Fetch mutual connections between lender and borrower
2. Apply Adamic-Adar weighting (inversely proportional to network size)
3. Filter by quality scores (removes bots/spam)
4. Add bonuses for direct follows and network overlap
5. Cache results for 30 minutes

Results guide UI displays but don't affect smart contract execution.

→ [See technical implementation](../how-it-works/social-trust-scoring/implementation.md)

---

### Is my social graph data stored on-chain?

No. Social graph data stays **off-chain**. Only loan transactions are recorded on-chain:
- Loan creation
- Contributions
- Repayments/defaults

This keeps gas costs low (~$0.01 per transaction) while maintaining privacy.

---

### Can I integrate LendFriend into my app?

Yes! LendFriend is open source. You can:
- Read smart contracts directly
- Use our APIs for trust score calculations
- Build alternative interfaces

Check our [GitHub](https://github.com) for documentation and integration guides.

---

## Getting Started

### I'm new—where should I start?

**As a borrower:**
1. Read [Borrower Profiles](../how-it-works/borrower-profiles.md)
2. Start with a small loan ($50-200)
3. Share with close friends first
4. Repay on time to build history

**As a lender:**
1. Understand [Trust Scores](../how-it-works/social-trust-scoring/README.md)
2. Start with small amounts to friends
3. Diversify across multiple loans
4. Check support strength before funding strangers

**To understand the system:**
1. Read [Overview](../how-it-works/overview.md)
2. Explore [Social Trust Scoring](../how-it-works/social-trust-scoring/README.md)
3. Review [Academic Research](../references.md)

---

{% hint style="success" %}
**Still have questions?** Join the conversation on [Farcaster](https://warpcast.com/lendfriend) or contribute to our [documentation](https://github.com).
{% endhint %}
