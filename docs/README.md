# LendFriend Technical Documentation

> Uncollateralized P2P lending using social trust as collateral.

This documentation explains the protocol architecture, trust scoring algorithm, and research foundation for technical readers.

---

## Core Concept

LendFriend replaces credit scores with **verifiable social relationships**. The Adamic-Adar algorithm weights mutual connections inversely by network size—a friend with 20 connections signals stronger trust than one with 20,000. Research shows this improves default prediction by 82% over simple counting [[2]](references.md#adamic-and-adar-2003).

**Evidence:** Grameen Bank (97-98% repayment), Kiva (96.3%), Akhuwat (99.9%) prove social collateral works at scale. We're adapting these models for decentralized social networks and on-chain reputation.

---

## Documentation

### Protocol Mechanics

**[Social Trust Scoring](how-it-works/social-trust-scoring/README.md)**
Adamic-Adar implementation, risk tiers, anti-gaming mechanisms

**[Risk Scoring](how-it-works/risk-scoring/README.md)**
A-HR grading system, four-factor risk assessment

**[Smart Contract Flow](how-it-works/smart-contract-flow.md)**
Factory pattern, pro-rata claims, gas optimization

**[Risk & Default Handling](how-it-works/risk-and-defaults.md)**
What happens when loans fail, philosophy on collections

### Infrastructure

**[Technical Stack](how-it-works/technical-stack.md)**
Base L2, USDC, The Graph, IPFS architecture

**[Payment Methods](how-it-works/payment-methods.md)**
Account abstraction, gasless transactions, fiat onramps

**[Farcaster Mini App](how-it-works/farcaster-miniapp.md)**
Native in-feed lending experience

### Context

**[Vision & Roadmap](vision.md)**
Three-phase evolution from 0% interest bootstrap to AI underwriting

**[Economic Context](economic-context.md)**
Credit crisis, gig economy, stablecoin adoption

**[Web3 Cost Advantage](cheaper-lending.md)**
How blockchain eliminates 15-30% fintech overhead

**[Research Foundation](references.md)**
45+ academic citations from microfinance, network science, P2P lending

---

## Status

**Current:** Testnet on Base Sepolia
**Launch:** Phase 0 mainnet Q2 2025

**Code:** [github.com/aagoldberg/far-mca](https://github.com/aagoldberg/far-mca) (MIT)
**App:** [lendfriend.org](https://lendfriend.org)

{% hint style="info" %}
**Living Document:** Parameters and thresholds will be refined as we collect repayment data during Phase 0.
{% endhint %}
