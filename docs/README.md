# LendFriend Technical Documentation

> Your network is your credit score.

---

## What This Is

LendFriend enables uncollateralized lending using social relationships as collateral. When friends vouch for a borrower with both money and reputation, the strength of those connections predicts repayment.

We use the Adamic-Adar algorithm to weight social ties—close friends with selective networks matter more than distant followers. All loan activity records permanently on-chain, building verifiable reputation across DeFi.

**Current phase:** 0% interest loans on Farcaster to prove social trust works. Future phases add cashflow data and AI underwriting.

---

## Documentation

### Protocol Mechanics
- [Social Trust Scoring](how-it-works/social-trust-scoring/README.md)
- [Risk Scoring](how-it-works/risk-scoring/README.md)
- [Smart Contract Flow](how-it-works/smart-contract-flow.md)
- [Risk & Default Handling](how-it-works/risk-and-defaults.md)

### Infrastructure
- [Technical Stack](how-it-works/technical-stack.md)
- [Payment Methods](how-it-works/payment-methods.md)
- [Farcaster Mini App](how-it-works/farcaster-miniapp.md)

### Vision & Context
- [Vision & Roadmap](vision.md)
- [Economic Context](economic-context.md)
- [Web3 Cost Advantage](cheaper-lending.md)
- [Research Foundation](references.md)

---

**Code:** [github.com/aagoldberg/far-mca](https://github.com/aagoldberg/far-mca) • **App:** [lendfriend.org](https://lendfriend.org)
