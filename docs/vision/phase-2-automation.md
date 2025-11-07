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

**Goal:** 50%+ of loans use auto-repayment, with 30% lower default rate vs. manual repayment.

---

## Why This Matters

Manual repayment creates preventable defaults from forgetfulness, not inability to pay. Borrowers forget due dates, lenders chase late payments, and everyone experiences unnecessary friction. Auto-repayment eliminates this: set once, deducts automatically from income, and reduces defaults by 30%.

| Aspect | 📅 Manual Repayment | ⚡ Auto-Repayment |
|--------|---------------------|-------------------|
| **Payment Process** | 🧠 Remember payment date<br/>📱 Open app monthly<br/>💳 Manual transfer | ✅ Set once, forget<br/>🤖 Deducts automatically<br/>💰 % of daily income |
| **Borrower Experience** | ⏰ Late payment risk<br/>😰 Cognitive load<br/>💭 *"Did I pay this month?"* | ⏱️ Always on-time<br/>😌 Zero mental overhead<br/>💭 *"What loan?"* |
| **Lender Experience** | 📞 Chasing late payments<br/>❓ Uncertainty | 📊 Predictable yield<br/>✅ Reliable cashflow |
| **Default Rate** | ❌ **15%**[[74]](../references.md#ref74) | ✅ **10%** (30% lower) |

**Why merchants choose LendFriend over MCAs:**
- **Fair pricing:** 12% APR vs 280% APR for merchant cash advances[[54]](../references.md#ref54)[[55]](../references.md#ref55)[[56]](../references.md#ref56)
- **Revenue-based:** Slow days = smaller payments (not fixed installments)
- **Transparent:** Clear interest rates, no confusing factor rates

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

- 50%+ loans use auto-repayment
- 30% default reduction vs. manual
- 100K+ users, $5M+ merchant loans, $10M+ TVL
- Users report "forgot I had a loan, it just repaid itself"

**Key validation:** 50%+ adoption + 30% default reduction proves fundamentally better lending infrastructure.

---

## Technology Dependencies

**ERC-4337 smart wallets:** Early adoption today, needs payment stream standards (2026-2027). Fallback: recurring ERC-20 approvals.

**Merchant rails:** Square API ready now, Shopify waiting for crypto features. Fallback: manual reporting.

---

## Beyond Phase 2

Once auto-repayment works, LendFriend becomes lending infrastructure: portable on-chain credit scores, institutional liquidity at wholesale rates, multi-platform/currency/region expansion. End game: uncollateralized lending becomes a DeFi primitive.
