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

Manual repayment creates preventable defaults from forgetfulness, not inability to pay. Borrowers forget due dates, lenders chase late payments, and everyone experiences unnecessary friction. Auto-repayment eliminates this: set once, deducts automatically from income, and reduces defaults.

| | Manual Repayment | Auto-Repayment |
|---|---|---|
| **Payment** | Remember dates, open app monthly, manual transfer | Set once, automatic deduction from income |
| **Borrower** | Late payment risk, cognitive load, "Did I pay?" | Always on-time, zero mental overhead |
| **Lender** | Chase late payments, uncertainty | Predictable yield, reliable cashflow |
| **Defaults** | Higher (forgetfulness) | Lower (automated) |

**Why merchants choose this over MCAs:**
- Fair pricing: 12% APR vs 280% APR[[54]](../references.md#ref54)[[55]](../references.md#ref55)[[56]](../references.md#ref56)
- Revenue-based: Slow days = smaller payments
- Transparent: Clear interest, no confusing factor rates

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
