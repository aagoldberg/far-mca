# Borrower Profiles & Identity

## Soft Information in Lending Decisions

LendFriend collects both **hard information** (verifiable credit data) and **soft information** (personal narratives, photos, business descriptions) to help lenders make informed decisions. Research shows that soft information significantly improves lending outcomes when used appropriately.

---

## What Borrowers Provide

When creating a loan request, borrowers share:

### 1. Profile Picture

**Purpose:** Visual identification and humanization of the borrower.

**Research backing:** Research shows that borrowers who appear more trustworthy receive better lending terms—higher funding rates and ~50 basis points lower interest rates (Duarte et al. 2012). Visual cues provide trust signals lenders value.

**LendFriend's approach:** Profile pictures are pulled from verified Farcaster accounts (not self-uploaded), providing consistency with their social identity and reducing fake profile risks.

---

### 2. About You (Personal Narrative)

**Field:** `aboutYou` - Personal background and story

**Purpose:** Helps lenders understand who the borrower is beyond credit scores.

**Research backing:** Herzenstein, Sonenshein & Dholakia (2011) found in their seminal study "Tell Me a Good Story and I May Lend You Money" that:
- **Narratives significantly affect funding**: More identity claims in loan narratives increased loan funding success on Prosper.com
- **Soft information matters**: Unverifiable personal information affects lending decisions *above and beyond* objective, verifiable credit data
- **Trust signals**: Identity claims about being "trustworthy" or "successful" increased loan funding rates

**Key finding:** Lenders use soft information to predict default with **45% greater accuracy** than credit scores alone (Iyer et al. 2016). Personal narratives reduce information asymmetry—friends know you better than strangers.

---

### 3. About This Loan (Use & Impact)

**Field:** `loanUseAndImpact` - What the loan will fund and what it will achieve

**Purpose:** Transparency about loan purpose and expected outcomes.

**Research backing:**
- **Kiva's success**: Borrower stories about "Armenian bakers and Moroccan bricklayers" helped lenders feel connected to something larger. Kiva has funded $1.68B+ with a 96.3% repayment rate, demonstrating storytelling effectiveness.
- **Purpose transparency**: Herzenstein et al. (2011) found that loans with clear purpose descriptions ("economic hardship" and "moral integrity" narratives) had better repayment performance than vague "trustworthy" claims.
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
- **Verifiable signals**: Freedman & Jin (2017) found that verifiable social network information (like active social media accounts) significantly predicts loan default probability beyond credit scores alone.
- **Business presence**: Active business websites and social accounts signal legitimacy and ongoing operations.
- **Cross-platform verification**: Multiple verified platforms increase trust (covered in [Social Trust Scoring](social-trust-scoring/README.md)).

---

## How Soft Information Improves Lending

### 1. Reduces Information Asymmetry

Lenders know very little about borrowers initially. Personal narratives and business descriptions provide context that hard financial data cannot capture:

- **Employment situation**: DAO contributor, freelance developer, indie creator (non-traditional income)
- **Life circumstances**: Unexpected expenses, business growth opportunity, community project
- **Character signals**: Communication style, transparency, thoughtfulness

**Research:** Borrowers using soft data in equal measure as hard information reduces information asymmetry and helps assess creditworthiness more accurately (Liberti & Petersen 2018).

---

### 2. Creates Social Accountability

**The mechanism:**

When you publicly state your loan purpose and personal story:
- Your network sees what you're borrowing for
- Misrepresentation damages your reputation
- Repayment becomes a matter of personal integrity

**Research foundation:** Karlan et al. (2009) showed that social proximity and trust reduce default risk by **13%** in lending groups. Public narratives extend this accountability beyond immediate connections.

---

### 3. Enables Better Screening

**45% better accuracy:** Research shows lenders combining hard and soft information predict defaults with 45% greater accuracy than credit scores alone (Iyer et al. 2016).

**What lenders screen for:**
- **Identity consistency**: Does the narrative match their social profile?
- **Specificity**: Vague requests ("need money for business") vs specific plans ("purchasing $500 of fabric to fulfill holiday orders")
- **Risk signals**: Herzenstein et al. found that borrowers making many "trustworthy" claims actually had *worse* repayment performance—lenders learn to spot over-promising

---

## Research on Discrimination & Bias

### The Challenge

Pope & Sydnor (2011) documented racial discrimination on Prosper.com based on borrower photos:
- Loan listings with Black borrowers were **25-35% less likely** to receive funding
- Interest rates paid by Black borrowers were **60-80 basis points higher**
- Discrimination persisted even after controlling for credit profiles

### Mitigation Strategies

**What doesn't work:**
- Removing photos entirely (reduces trust, hurts legitimate borrowers)
- Blind screening (loses valuable soft information)

**What research shows helps:**
1. **Algorithmic scoring**: Combining soft + hard data into objective scores reduces bias
2. **Transparency**: Public loan history creates accountability for repayment behavior
3. **Community-based lending**: Social connections matter more than appearance (Bjorkegren & Grissen 2020 found only "BFFs"—real interactive relationships—predict defaults, not appearance)
4. **Verified identity**: LendFriend uses Farcaster-verified profiles (not self-uploaded photos), reducing fake profiles and linking borrowers to their social reputation

**LendFriend's approach:**
- Profile pictures come from verified Farcaster accounts (consistency with social identity)
- Risk scoring algorithm combines multiple factors (40% repayment history, 30% social trust, 20% loan size, 10% account quality)
- Social connections are quantified algorithmically using Adamic-Adar Index
- Public on-chain repayment history creates transparent track records

---

## Key Research Citations

**Duarte, J., Siegel, S., & Young, L. (2012)**. Trust and Credit: The Role of Appearance in Peer-to-peer Lending. *Review of Financial Studies*, 25(8), 2455-2484.

> Examines how appearance-based impressions affect P2P lending using Prosper.com photographs. Found that borrowers appearing more trustworthy have higher funding probabilities and receive ~50 basis points lower interest rates. Importantly, appearance predicted actual credit quality—trustworthy-looking borrowers indeed had better credit scores and lower default rates.

---

**Herzenstein, M., Sonenshein, S., & Dholakia, U. M. (2011)**. Tell Me a Good Story and I May Lend You Money: The Role of Narratives in Peer-to-Peer Lending Decisions. *Journal of Marketing Research*, 48(SPL), S138-S149.

> Seminal study on Prosper.com showing narratives significantly affect lending decisions. Found that identity claims increase funding but can decrease repayment if over-promising. Established that soft information matters beyond hard credit data.

---

**Pope, D. G., & Sydnor, J. R. (2011)**. What's in a Picture? Evidence of Discrimination from Prosper.com. *Journal of Human Resources*, 46(1), 53-92.

> Documented racial discrimination in P2P lending based on borrower photos. Showed 25-35% lower funding rates and 60-80 basis points higher interest rates for Black borrowers with similar credit profiles. Critical evidence that visual information can introduce bias.

---

**Iyer, R., Khwaja, A. I., Luttmer, E. F., & Shue, K. (2016)**. Screening peers softly: Inferring the quality of small borrowers. *Management Science*, 62(6), 1554-1577.

> Found lenders using soft information (narratives, social connections) predict default with **45% greater accuracy** than credit scores alone. Demonstrated that soft information is relatively more important when screening lower-credit-quality borrowers.

---

**Bjorkegren, D., & Grissen, D. (2020)**. Behavior revealed in mobile phone usage predicts credit repayment. *The World Bank Economic Review*, 34(3), 618-634.

> Studied Facebook data for microfinance credit scoring. **Key finding: Only BFFs (real, interactive relationships) have predictive value**, not nominal friend connections or appearance. Surprisingly, interest-based data performed as well as nominal social network data for default prediction.

---

**Liberti, J. M., & Petersen, M. A. (2018)**. Information: Hard and Soft. *Review of Corporate Finance Studies*, 8(1), 1-41.

> Comprehensive review of hard vs soft information in lending. Found that soft information (personal narratives, relationship data) reduces information asymmetry and improves creditworthiness assessment when used alongside hard financial data.

---

**Freedman, S., & Jin, G. Z. (2017)**. The information value of online social networks: Lessons from peer-to-peer lending. *International Journal of Industrial Organization*, 51, 185-222.

> Demonstrated that verifiable social network information (e.g., active social media accounts) significantly predicts loan default probability beyond credit scores. Social reputation systems work when connections are verifiable.

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
