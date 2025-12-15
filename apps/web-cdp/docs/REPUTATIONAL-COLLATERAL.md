# Reputational Collateral System

## Overview

LendFriend uses **reputational collateral** instead of traditional collateral. Borrowers stake their public business reputation as security for their loan. Default becomes visible alongside their real business identity, creating accountability through social and commercial consequences.

## How It Works

### Borrower Requirements

When requesting a loan, borrowers must publicly link:

1. **Verified Shopify Store** (required) - Connected via OAuth
2. **Owner Full Name** (required) - Real identity attached to loan
3. **Owner Photo** (required) - Face attached to request
4. **Business Social Media** (optional but encouraged)
   - Instagram handle + follower count
   - TikTok handle + follower count
   - Facebook page
5. **Review Profiles** (optional but encouraged)
   - Google Business rating + review count
   - Yelp rating
   - Trustpilot score

### Public Loan Profile

```
┌─────────────────────────────────────────────────────┐
│  Serenity Scents Co.                                │
│  Maya Chen, Owner                                   │
│                                                     │
│  🛒 serenity-scents.myshopify.com (Verified)       │
│  ⭐ 4.8 on Google (127 reviews)                    │
│  📸 @serenityscents (12.4K followers)              │
│  💼 linkedin.com/in/mayachen                       │
│                                                     │
│  Loan Status: ✅ CURRENT                           │
│  Repayment History: 8/8 payments on time           │
└─────────────────────────────────────────────────────┘
```

### Default Consequences

If borrower defaults:

1. **Loan status changes publicly** - "DELINQUENT - 30 days past due"
2. **Linked to real business** - Google searches may surface default
3. **Lenders can leave reviews** - Similar to business reviews
4. **Permanent record** - Default history visible on future loan requests
5. **Social notification** - Followers/customers may discover via search

### Why This Works (Research-Backed)

Research identifies **3 conditions** for public reputation to create accountability:

| Condition | How LendFriend Implements |
|-----------|---------------------------|
| Authority to sanction | Lenders can leave public reviews, platform marks defaults |
| Reputational salience | Borrower's real business/identity is at stake |
| Reintegration path | Good repayment history can rebuild reputation over time |

## Implementation

### Required Data Points

```typescript
interface BorrowerProfile {
  // Required - Verified via OAuth
  shopifyStore: {
    domain: string;
    verified: boolean;
    customerCount: number;
    orderCount: number;
    storeAge: number; // months
  };

  // Required - Manual entry
  owner: {
    fullName: string;
    photoUrl: string;
    email: string;
  };

  // Optional - Manual entry, displayed publicly
  socialProof: {
    instagramHandle?: string;
    instagramFollowers?: number;
    tiktokHandle?: string;
    tiktokFollowers?: number;
    linkedinUrl?: string;
    googleRating?: number;
    googleReviewCount?: number;
    yelpRating?: number;
  };

  // Platform-tracked
  loanHistory: {
    totalLoans: number;
    repaidOnTime: number;
    currentStatus: 'current' | 'delinquent' | 'default';
    daysPastDue?: number;
  };
}
```

### Trust Score Boost

Borrowers who provide more verifiable public identity get better visibility:

| Verification Level | Trust Boost |
|-------------------|-------------|
| Shopify only | Baseline |
| + Google reviews | +10% visibility |
| + Instagram 1K+ followers | +5% visibility |
| + LinkedIn profile | +5% visibility |
| + Multiple platforms | +15% visibility |

### Lender Reviews

After loan completion (repaid or defaulted), lenders can leave reviews:

```typescript
interface LenderReview {
  lenderId: string;
  borrowerId: string;
  loanId: string;
  rating: 1 | 2 | 3 | 4 | 5;
  reviewText: string;
  repaymentOutcome: 'repaid_on_time' | 'repaid_late' | 'defaulted';
  verifiedFunding: boolean; // Did this lender actually fund?
  createdAt: Date;
}
```

---

## Research Foundation

### Key Finding: Reputation Over Connection Verification

> "Only endorsements from friends who also contribute money to the loan themselves produce consistently better ex post repayment."

Self-reported connections are "cheap talk." What matters is **skin in the game** and **public accountability**.

### Academic Sources

#### Peer-to-Peer Lending & Social Trust

1. **Do Social Networks Solve Information Problems for Peer-to-Peer Lending?**
   - Authors: Seth Freedman, Ginger Zhe Jin
   - Source: NBER Working Paper
   - URL: https://www.nber.org/system/files/working_papers/w19820/w19820.pdf
   - Key finding: Friend endorsements only matter when friends also put money in

2. **Friendship in Online Peer-to-Peer Lending: Pipes, Prisms, and Relational Herding**
   - Source: MIS Quarterly
   - URL: https://misq.umn.edu/friendship-in-online-peer-to-peer-lending-pipes-prisms-and-relational-herding.html
   - Key finding: Friends act as "financial pipes" by lending money

3. **Peer Effect and Funding Success: Analyzing Friendship Networks in Online Credit Markets**
   - Source: Finance Research Letters
   - URL: https://www.sciencedirect.com/science/article/abs/pii/S1544612324006810
   - Key finding: Peer effects stronger with larger networks and better repayment history

4. **Kiva.org: Crowd-Sourced Microfinance and Cooperation in Group Lending**
   - Author: Scott E. Hartley
   - Source: SSRN
   - URL: https://papers.ssrn.com/sol3/papers.cfm?abstract_id=1572182
   - Key finding: Fastest-funded loans have highest repayment rates

#### Reputation & Debt Markets

5. **Reputation Acquisition in Debt Markets**
   - Source: Journal of Political Economy
   - URL: https://www.journals.uchicago.edu/doi/abs/10.1086/261630
   - Key finding: Reputation effects improve incentives over time

6. **The Dynamics of Borrower Reputation Following Financial Misreporting**
   - Source: ResearchGate
   - URL: https://www.researchgate.net/publication/317159769_The_Dynamics_of_Borrower_Reputation_Following_Financial_Misreporting
   - Key finding: Reputational damage persists even after attempts to rebuild

7. **Monitoring and Reputation: The Choice between Bank Loans and Directly Placed Debt**
   - Source: Journal of Political Economy
   - URL: https://www.journals.uchicago.edu/doi/10.1086/261775
   - Key finding: Reputation effects are important in lending relationships

#### Social Collateral in Microfinance

8. **Defining Social Collateral in Microfinance Group Lending**
   - Source: Springer / Palgrave Studies in Impact Finance
   - URL: https://link.springer.com/chapter/10.1057/9781137399663_10
   - Key finding: Social collateral can replace physical collateral

9. **Social Collateral, Repayment Rates, and the Creation of Capital Among Microfinance Clients**
   - Source: ScienceDirect
   - URL: https://www.sciencedirect.com/science/article/pii/S2212567115011727
   - Key finding: Social ties improve repayment rates

#### Public Accountability & Shaming

10. **Social Media, Social Control, and the Politics of Public Shaming**
    - Source: American Political Science Review / Cambridge
    - URL: https://www.cambridge.org/core/journals/american-political-science-review/article/social-media-social-control-and-the-politics-of-public-shaming/2BC3349DF48F25D83ADD3271FF2FCEB6
    - Key finding: Three conditions for effective public shaming: authority to sanction, reputational salience, and reintegration possibility

11. **Media, Reputational Risk, and Bank Loan Contracting**
    - Source: ScienceDirect
    - URL: https://www.sciencedirect.com/science/article/abs/pii/S1572308922000183
    - Key finding: Media coverage affects loan terms and borrower behavior

#### Trust in P2P Platforms

12. **Assessing Trust in Peer-to-Peer Lending Platforms**
    - Source: Fingerprint.com
    - URL: https://fingerprint.com/blog/assessing-trust-p2p-lending-platforms/
    - Key finding: Technical and social signals both matter for trust assessment

13. **Borrower's Default and Self-Disclosure of Social Media Information in P2P Lending**
    - Source: Financial Innovation (SpringerOpen)
    - URL: https://jfin-swufe.springeropen.com/articles/10.1186/s40854-016-0048-3
    - Key finding: Social media self-disclosure signals creditworthiness

### Platform References

14. **Kiva U.S. Crowdfunding FAQs**
    - URL: https://www.kiva.org/lp/faq-kiva-us-crowdfunding-faqs
    - Key practice: Private fundraising period (5-40 people from personal network)

15. **Kiva Social Underwriting / Due Diligence**
    - URL: https://www.kiva.org/about/due-diligence/direct-loans
    - Key practice: Trustee endorsements and social collateral

---

## Summary

**The research is clear:** Verifying social connections via APIs is:
- Technically difficult (APIs locked down post-Cambridge Analytica)
- Less predictive than expected (self-reported connections = cheap talk)

**What actually works:**
1. **Skin in the game** - Friends who invest their own money
2. **Public accountability** - Real identity linked to loan status
3. **Reputational consequences** - Default damages real business reputation

LendFriend implements this by requiring borrowers to stake their **real, verifiable business identity** as collateral. The accountability comes from their existing customers, followers, and business network—not from API-verified friend connections.
