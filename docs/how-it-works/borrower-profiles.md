# Borrower Profiles & Identity

## The Core Innovation

LendFriend combines hard information (credit data) with soft information (narratives, photos, business descriptions). This hybrid approach improves default prediction by **45%** compared to credit scores alone [[3]](../references.md#iyer-et-al-2016).

The key difference from traditional P2P platforms: **social vouching by the borrower's actual network**. When friends contribute, they implicitly vouch for the borrower's authenticity. Misrepresentation carries social cost with people who know you personally, not just anonymous ratings.

---

## What Borrowers Provide

### Profile Picture
Visual trust signals matter—borrowers appearing trustworthy receive ~50 basis points lower interest rates [[1]](../references.md#duarte-et-al-2012). When friends from the borrower's Farcaster network contribute, they vouch for authenticity.

### Personal Narrative
Context about employment (DAO contributor, freelancer), life circumstances, or business background. Credit scores can't capture non-traditional income patterns [[5]](../references.md#liberti-and-petersen-2018).

**Key insight:** Over-promising backfires. Borrowers making many "trustworthy" claims had worse repayment [[2]](../references.md#herzenstein-et-al-2011). Lenders identify authenticity versus over-selling.

### Loan Purpose
Specific purposes ("purchasing $500 of fabric to fulfill holiday orders") outperform vague requests [[2]](../references.md#herzenstein-et-al-2011). Public statements create accountability—the borrower's network sees what the loan funds.

### Business Information (Optional)
Website links, social accounts. Verifiable social network information predicts defaults beyond credit scores [[4]](../references.md#freedman-and-jin-2017).

---

## How It Works

**Traditional P2P (Prosper, LendingClub):** Anonymous profiles, strangers as lenders, no social cost for misrepresentation.

**LendFriend:** Friends see and fund first. Default damages actual relationships, not just platform scores. Social proximity reduces default risk by 13% [[6]](../references.md#karlan-et-al-2009)—and that's before accounting for the friend vouching mechanism.

**Screening improvement:** Combining soft information with social network data enables 45% greater accuracy than credit scores alone [[3]](../references.md#iyer-et-al-2016). The platform provides verifiable information validated by the borrower's network.

---

## Why This Matters

Three core challenges in uncollateralized lending:

1. **Information asymmetry** - Narratives provide context credit scores miss (crypto-native workers, freelancers, DAO contributors)
2. **Moral hazard** - Social vouching creates reputational cost for default
3. **Adverse selection** - Borrowers self-select knowing friends will see the request

The system leverages cryptographically verifiable social graphs (Farcaster) to enable P2P lending with stronger accountability than previous-generation platforms.

---

## References

1. [Duarte et al. (2012)](../references.md#duarte-et-al-2012) - Trust and Credit: Appearance in P2P Lending
2. [Herzenstein et al. (2011)](../references.md#herzenstein-et-al-2011) - Tell Me a Good Story
3. [Iyer et al. (2016)](../references.md#iyer-et-al-2016) - Screening Peers Softly
4. [Freedman & Jin (2017)](../references.md#freedman-and-jin-2017) - Information Value of Social Networks
5. [Liberti & Petersen (2018)](../references.md#liberti-and-petersen-2018) - Information: Hard and Soft
6. [Karlan et al. (2009)](../references.md#karlan-et-al-2009) - Trust and Social Collateral

---

**Next:** [Social Trust Scoring](social-trust-scoring/README.md) · [Risk Scoring](risk-scoring/README.md) · [Academic Research](../references.md)
