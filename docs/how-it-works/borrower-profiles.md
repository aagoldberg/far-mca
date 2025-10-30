# Borrower Profiles & Identity

## Soft Information in Lending Decisions

LendFriend collects both **hard information** (verifiable credit data) and **soft information** (personal narratives, photos, business descriptions) to help lenders make informed decisions. Research shows that soft information significantly improves lending outcomes when used appropriately.

---

## What Borrowers Provide

When creating a loan request, borrowers share:

### 1. Profile Picture

**Purpose:** Visual identification and humanization of the borrower.

**Research backing:** Research shows that borrowers who appear more trustworthy receive better lending terms—higher funding rates and ~50 basis points lower interest rates [[1]](../references.md#duarte-et-al-2012). Visual cues provide trust signals lenders value.

**LendFriend's approach:** Borrowers self-upload their profile picture when creating a loan. **Social accountability mechanism:** When friends contribute to a loan, they're vouching for both the story AND the picture—misrepresenting yourself damages your reputation with your actual network, not just strangers.

---

### 2. About You (Personal Narrative)

**Field:** `aboutYou` - Personal background and story

**Purpose:** Helps lenders understand who the borrower is beyond credit scores.

**Research backing:** Research shows that personal narratives significantly affect P2P lending decisions [[2]](../references.md#herzenstein-et-al-2011):
- **Narratives significantly affect funding**: More identity claims in loan narratives increased loan funding success on Prosper.com
- **Soft information matters**: Unverifiable personal information affects lending decisions *above and beyond* objective, verifiable credit data
- **Trust signals**: Identity claims about being "trustworthy" or "successful" increased loan funding rates

**Key finding:** Lenders use soft information to predict default with **45% greater accuracy** than credit scores alone [[3]](../references.md#iyer-et-al-2016). Personal narratives reduce information asymmetry—friends know you better than strangers.

---

### 3. About This Loan (Use & Impact)

**Field:** `loanUseAndImpact` - What the loan will fund and what it will achieve

**Purpose:** Transparency about loan purpose and expected outcomes.

**Research backing:**
- **Kiva's success**: Borrower stories about "Armenian bakers and Moroccan bricklayers" helped lenders feel connected to something larger. Kiva has funded $1.68B+ with a 96.3% repayment rate, demonstrating storytelling effectiveness.
- **Purpose transparency**: Research found that loans with clear purpose descriptions ("economic hardship" and "moral integrity" narratives) had better repayment performance than vague "trustworthy" claims [[2]](../references.md#herzenstein-et-al-2011).
- **Accountability mechanism**: Stating what you'll use money for creates social accountability—borrowers who misrepresent loan purpose damage their reputation.

**Why it matters:** Clear loan purpose helps lenders assess:
- Legitimacy of the need
- Likelihood of generating repayment capacity
- Alignment with lender values

---

### 4. Business Information (Optional)

**Fields:**
- `businessWebsite` - Link to business website
- `twitterHandle` - Social media presence

**Purpose:** Additional verification of business legitimacy and activity.

**Research backing:**
- **Verifiable signals**: Research shows that verifiable social network information (like active social media accounts) significantly predicts loan default probability beyond credit scores alone [[4]](../references.md#freedman-and-jin-2017).
- **Business presence**: Active business websites and social accounts signal legitimacy and ongoing operations.
- **Cross-platform verification**: Multiple verified platforms increase trust (covered in [Social Trust Scoring](social-trust-scoring/README.md)).

---

## How Soft Information Improves Lending

### 1. Reduces Information Asymmetry

Lenders know very little about borrowers initially. Personal narratives and business descriptions provide context that hard financial data cannot capture:

- **Employment situation**: DAO contributor, freelance developer, indie creator (non-traditional income)
- **Life circumstances**: Unexpected expenses, business growth opportunity, community project
- **Character signals**: Communication style, transparency, thoughtfulness

**Research:** Borrowers using soft data in equal measure as hard information reduces information asymmetry and helps assess creditworthiness more accurately [[5]](../references.md#liberti-and-petersen-2018).

---

### 2. Creates Social Accountability

**The mechanism:**

When you publicly state your loan purpose, share your story, and post your picture:
- Your network sees what you're borrowing for
- Friends who contribute are **vouching for your story and picture**—they're putting their reputation on the line
- Misrepresenting yourself (fake photo, false story) damages relationships with people who know you
- Repayment becomes a matter of personal integrity with your actual social circle

**Why this matters:** In traditional P2P lending (Prosper, LendingClub), lenders are strangers—there's no social cost to misrepresentation beyond an anonymous rating. In LendFriend, your friends see everything and contribute first, creating direct accountability to people whose opinion you care about.

**Research foundation:** Research shows that social proximity and trust reduce default risk by **13%** in lending groups [[6]](../references.md#karlan-et-al-2009). LendFriend extends this by making friends explicit co-signers through their contributions—they vouch for you with their money and reputation.

---

### 3. Enables Better Screening

**45% better accuracy:** Research shows lenders combining hard and soft information predict defaults with 45% greater accuracy than credit scores alone [[3]](../references.md#iyer-et-al-2016).

**What lenders screen for:**
- **Identity consistency**: Does the narrative match their social profile?
- **Specificity**: Vague requests ("need money for business") vs specific plans ("purchasing $500 of fabric to fulfill holiday orders")
- **Risk signals**: Research found that borrowers making many "trustworthy" claims actually had *worse* repayment performance—lenders learn to spot over-promising [[2]](../references.md#herzenstein-et-al-2011)

---

## References

All research citations can be found in the [Academic Research](../references.md) section:

1. [Duarte et al. (2012)](../references.md#duarte-et-al-2012) - Trust and Credit: Appearance in P2P Lending
2. [Herzenstein et al. (2011)](../references.md#herzenstein-et-al-2011) - Tell Me a Good Story
3. [Iyer et al. (2016)](../references.md#iyer-et-al-2016) - Screening Peers Softly
4. [Freedman & Jin (2017)](../references.md#freedman-and-jin-2017) - Information Value of Social Networks
5. [Liberti & Petersen (2018)](../references.md#liberti-and-petersen-2018) - Information: Hard and Soft
6. [Karlan et al. (2009)](../references.md#karlan-et-al-2009) - Trust and Social Collateral

---

## Next Steps

**Understand how social connections are quantified:**
→ [Social Trust Scoring](social-trust-scoring/README.md)

**See how profiles factor into risk assessment:**
→ [Risk Scoring](risk-scoring/README.md)

**Learn about all the signals we use:**
→ [Academic Research](../references.md)

---

**Last Updated**: January 2025
