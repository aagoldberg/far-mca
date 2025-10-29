# How It Works

## Overview

LendFriend enables uncollateralized lending by quantifying social trust. Your network doesn't just vouch for you—they algorithmically prove your creditworthiness through measurable social proximity.

Here's exactly how we turn relationships into credit scores.

## The Core Mechanics

### 1. Social Trust Scoring
We calculate social distance between borrower and lender by measuring mutual connections on Farcaster using the Adamic-Adar Index. This algorithm weights "real friends" (people with small networks) higher than "influencer connections" (people with massive followings).

When someone contributes to your loan, they're providing both capital and social proof. The UI displays each lender's social proximity to the borrower, creating transparent trust signals that enable uncollateralized lending.

Research from Kiva and Grameen Bank shows that borrowers with strong social support achieve **10% higher repayment rates**—proving that social proximity is a powerful predictor of creditworthiness.

[→ Learn about Social Trust Scoring](social-trust-scoring/README.md)

### 2. Smart Contract Flow
Zero-interest loan contracts deployed on Base L2. Trust scores are calculated off-chain to keep gas costs low (~$0.01 per transaction). Smart contracts handle money movement, not social graph analysis.

[→ Learn about Smart Contracts](smart-contract-flow.md)

### 3. Risk & Default Handling
Phase 1 uses 0% interest, letting lenders give out of generosity while we gather behavioral data. Defaults are recorded on-chain but borrowers can rebuild trust through smaller, successful loans.

[→ Learn about Risk Management](risk-and-defaults.md)

## Key Principles

**Zero Interest (Phase 1)**
Lenders give because they want to help, not chase returns. This creates pure behavioral data for future underwriting.

**On-Chain Transparency**
All loans and repayments are publicly visible on Base L2. No hidden fees, no middlemen.

**Social Accountability**
Your reputation follows you. Good borrowers build trust, defaulters face social consequences.

**Algorithmic Trust**
Social proximity is quantified mathematically, not guessed subjectively.

---

{% hint style="info" %}
**Research Foundation**: Our mechanics are backed by decades of microfinance research. See [Academic Research](../references.md) for full citations including Grameen Bank, Kiva, and 15+ peer-reviewed papers.
{% endhint %}

## Next Steps

- **New to LendFriend?** Start with [Social Trust Scoring](social-trust-scoring/README.md)
- **Want technical details?** Check out [Smart Contract Flow](smart-contract-flow.md)
- **Building on LendFriend?** See [Technical Stack](technical-stack.md)
