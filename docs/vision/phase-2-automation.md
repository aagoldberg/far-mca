# Phase 2: Automate Repayment

**Status:** Future
**Timeline:** 2026-2027
**Prerequisites:** Phase 1 validated (pools active, cashflow underwriting working, sufficient scale)

---

## What We're Building

Phase 2 automates loan repayment, removing all manual repayment friction.

**The vision:** Loans that repay themselves automatically from your income.

**Two mechanisms:**
1. **Wallet auto-deduction** — Deduct % of incoming crypto transfers automatically
2. **Merchant revenue sharing** — Deduct % of daily sales automatically

**Goal:** Significantly reduce defaults by eliminating manual repayment friction.

---

## Why This Matters

**The problem:** Borrowers forget to pay. Not because they can't afford it—they just forget. Result: late payments, chasing, defaults.

**The solution:** Loans that repay themselves. Set it once, forget it. Money automatically deducts from your income. Never miss a payment again.

**For borrowers:**
- Never worry about due dates
- Never open the app to make payments
- Never default from forgetfulness

**For merchants:**
- 12% APR instead of 280% APR (MCAs)[[54]](../references.md#ref54)[[55]](../references.md#ref55)[[56]](../references.md#ref56)
- Bad sales day? Smaller payment. Good day? Pays off faster.
- No hidden fees or confusing rates

**For lenders:**
- No chasing late payments
- Predictable, reliable yield
- Lower defaults = better returns

---

## How It Works

**1. Wallet Auto-Deduction**

For crypto-native earners: Smart wallet plugin (ERC-4337) automatically deducts configured % of incoming stablecoin transfers and sends to loan contract. Safety controls: minimum threshold, monthly cap, whitelisted sources, pause button.

**2. Merchant Revenue Auto-Deduction**

For small businesses: Connect Square/Shopify account, choose daily repayment rate (e.g., 5% of sales). System deducts automatically from daily net sales. Revenue-based: slow days = smaller payments.

**Better than MCAs:** 12% APR vs. 280% APR[[54]](../references.md#ref54)[[55]](../references.md#ref55)[[56]](../references.md#ref56), transparent pricing, prepay without penalty.

**Implementation:** Square first (open API), then Shopify (waiting for crypto features).

---

## Success Metrics

Phase 2 succeeds if:
- Auto-repayment significantly reduces defaults vs. manual repayment
- Borrowers prefer automated repayment over manual
- Merchants choose LendFriend over traditional MCAs
- Users report "forgot I had a loan, it just repaid itself"

---

## Technology Dependencies

**ERC-4337 smart wallets:** Early adoption today, needs payment stream standards (2026-2027). Fallback: recurring ERC-20 approvals.

**Merchant rails:** Square API ready now, Shopify waiting for crypto features. Fallback: manual reporting.

---

## Beyond Phase 2

Once auto-repayment works, LendFriend becomes lending infrastructure: portable on-chain credit scores, institutional liquidity at wholesale rates, multi-platform/currency/region expansion. End game: uncollateralized lending becomes a DeFi primitive.
