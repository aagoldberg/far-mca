# Borrower Profiles & Identity

## The Role of Soft Information

LendFriend combines hard information (verifiable credit data) with soft information (narratives, photos, business descriptions). This hybrid approach improves default prediction accuracy by **45%** compared to credit scores alone [[3]](../references.md#iyer-et-al-2016).

Traditional P2P platforms like Prosper and LendingClub demonstrated that soft information affects lending decisions above and beyond objective credit metrics [[2]](../references.md#herzenstein-et-al-2011). LendFriend builds on this research but adds a critical mechanism: **social vouching by the borrower's actual network**.

---

## Profile Components

### Profile Picture

Borrowers upload a photo when creating a loan request. Research shows borrowers appearing more trustworthy receive ~50 basis points lower interest rates [[1]](../references.md#duarte-et-al-2012), indicating that visual cues provide legitimate trust signals to lenders.

**The social vouching mechanism:** When friends from the borrower's Farcaster network contribute to the loan, they implicitly vouch for the authenticity of both the narrative and the photo. This creates accountability to the borrower's actual social circle, not just anonymous platform ratings. Misrepresentation carries social cost with people who know the borrower personally.

### Personal Narrative ("About You")

Borrowers provide context about their situation—employment type (DAO contributor, freelancer, traditional), life circumstances, or business background. This addresses information asymmetry: credit scores can't capture non-traditional income patterns or context around why the loan is needed [[5]](../references.md#liberti-and-petersen-2018).

**Screening insight:** Over-promising backfires. Research found that borrowers making many "trustworthy" identity claims actually had worse repayment performance [[2]](../references.md#herzenstein-et-al-2011). Lenders learn to identify authenticity versus over-selling, making specificity and honesty more valuable than vague promises.

### Loan Purpose ("About This Loan")

Borrowers specify what the loan will fund and what they expect to achieve. Clear, specific purposes ("purchasing $500 of fabric to fulfill holiday orders") outperform vague requests ("need money for business") in both funding rates and repayment performance [[2]](../references.md#herzenstein-et-al-2011).

This transparency creates accountability—public statements about loan use that the borrower's network can see. Kiva's success ($1.68B+ funded, 96.3% repayment) demonstrates that connecting lenders to specific, tangible purposes drives both funding and repayment.

### Business Information (Optional)

Website links, Twitter handles, or other active social accounts. Verifiable social network information predicts default probability beyond credit scores [[4]](../references.md#freedman-and-jin-2017). Active online presence signals legitimacy and ongoing operations, particularly valuable for borrowers with non-traditional businesses.

---

## How the System Works

### Social Accountability vs Anonymous Ratings

Traditional P2P lending (Prosper, LendingClub) connects strangers. Lenders evaluate anonymous profiles; borrowers face no social cost for misrepresentation beyond algorithmic reputation scores.

LendFriend's key innovation: **friends see and fund first**. When connections from the borrower's Farcaster network contribute, they're putting their own reputation on the line. This transforms the accountability mechanism:

- **Traditional P2P:** Default = lower platform score
- **LendFriend:** Default = damaged relationships with actual friends who vouched for you

Research shows social proximity reduces default risk by 13% in lending groups [[6]](../references.md#karlan-et-al-2009). LendFriend extends this by making friends explicit co-signers through their contributions.

### Improved Screening Accuracy

Lenders evaluate borrowers across multiple dimensions:

- **Identity consistency**: Does the narrative align with the borrower's Farcaster profile and social connections?
- **Specificity**: Concrete plans versus vague claims
- **Network validation**: Are friends contributing? What does the social graph reveal?

Combining soft information with social network data enables lenders to screen with 45% greater accuracy than credit scores alone [[3]](../references.md#iyer-et-al-2016). The platform doesn't just provide more information—it provides **verifiable information validated by the borrower's actual network**.

---

## Design Rationale

This approach addresses three core challenges in uncollateralized lending:

1. **Information asymmetry**: Personal narratives provide context credit scores miss, especially for non-traditional earners (crypto-native workers, freelancers, DAO contributors)

2. **Moral hazard**: Social vouching by friends creates reputational cost for default beyond platform ratings

3. **Adverse selection**: Borrowers self-select into the platform knowing their friends will see the request, filtering out those unwilling to face social scrutiny

The system leverages cryptographically verifiable social graphs (Farcaster) to enable peer-to-peer lending with stronger accountability mechanisms than previous-generation P2P platforms.

---

## References

1. [Duarte et al. (2012)](../references.md#duarte-et-al-2012) - Trust and Credit: Appearance in P2P Lending
2. [Herzenstein et al. (2011)](../references.md#herzenstein-et-al-2011) - Tell Me a Good Story
3. [Iyer et al. (2016)](../references.md#iyer-et-al-2016) - Screening Peers Softly
4. [Freedman & Jin (2017)](../references.md#freedman-and-jin-2017) - Information Value of Social Networks
5. [Liberti & Petersen (2018)](../references.md#liberti-and-petersen-2018) - Information: Hard and Soft
6. [Karlan et al. (2009)](../references.md#karlan-et-al-2009) - Trust and Social Collateral

---

## Next Steps

→ [Social Trust Scoring](social-trust-scoring/README.md) - Quantifying social connections with Adamic-Adar
→ [Risk Scoring](risk-scoring/README.md) - How profiles integrate into the risk model
→ [Academic Research](../references.md) - Complete bibliography

---

**Last Updated**: January 2025
