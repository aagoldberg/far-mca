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

**The problem:** Borrowers forget to pay. Not because they can't afford it—they just forget.

→ Borrower forgets → Late payment → Default

**The solution:** Set it once, forget it. Money automatically deducts from your income.

→ Income arrives → Auto-deduct → On-time payment

**For borrowers:**
- Never worry about due dates
- Never open the app to make payments
- Never default from forgetfulness

**For merchants:**
- 12% APR instead of 280% APR (MCAs)[[54]](../references.md#ref54)[[55]](../references.md#ref55)[[56]](../references.md#ref56)
- Bad sales day? Smaller payment. Good day? Pays off faster.

**For lenders:**
- No chasing late payments
- Predictable yield, lower defaults

---

## How It Works

**Wallet Auto-Deduction** (for crypto earners)

Example: DAO pays you $2,000 USDC → Plugin deducts 10% ($200) → Sent to loan → You keep $1,800

Smart wallet plugin deducts a % of incoming stablecoins automatically. Safety controls: minimum threshold, monthly cap, pause button.

**Merchant Auto-Deduction** (for small businesses)

Example: Daily sales $1,000 → System deducts 5% ($50) → Sent to loan → You keep $950

Connect Square/Shopify account, choose daily rate. Bad sales day = smaller payment. Good day = pays off faster.

**Why merchants choose this:** 12% APR vs. 280% APR (MCAs)[[54]](../references.md#ref54)[[55]](../references.md#ref55)[[56]](../references.md#ref56), transparent pricing, prepay without penalty.

**Implementation:** Square first (open API), then Shopify (waiting for crypto features).

---

## Technology Dependencies

**ERC-4337 smart wallets:** Early adoption today, needs payment stream standards (2026-2027).

**Merchant rails:** Square API ready now, Shopify waiting for crypto features.

---

## Beyond Phase 2

Once auto-repayment works, LendFriend becomes lending infrastructure: portable on-chain credit scores, institutional liquidity at wholesale rates, multi-platform/currency/region expansion. End game: uncollateralized lending becomes a DeFi primitive.
