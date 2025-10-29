# Vouching Mechanics

## How Contributions Signal Trust

When someone contributes to your loan, they're doing two things:
1. **Providing capital** - Direct financial support
2. **Vouching for you** - Staking their social reputation

The UI displays each lender's social proximity to the borrower (calculated off-chain using the algorithm from the previous section). A $10 contribution from a mutual friend is a stronger trust signal than $100 from a stranger with zero mutual connections.

## Displayed Information

The UI calculates and displays for each lender-borrower pair:

| Metric | Description |
|--------|-------------|
| **M** | Mutual connections count |
| **S_total** | Social distance score (0-100) |
| **Risk Tier** | LOW / MEDIUM / HIGH |
| **P_network** | Loan-level support % |

All calculations run off-chain with a 30-minute cache. Results guide lender decisions but don't affect smart contract logic.

## Sybil Resistance

Creating fake Farcaster accounts to game the system doesn't work because:

- **No connections**: Fake accounts have no mutual connections with the borrower (socialDistance = 0)
- **Quality filtering**: Neynar quality scores filter out spam/bot accounts (avgQuality adjustment)
- **Network threshold**: Support strength requires 30%+ of lenders to be from your real network

## Cumulative Trust Display

Lenders can see the borrower's aggregate support strength before contributing:
- **Higher support = lower perceived risk**
- **Creates virtuous cycle**: Early contributions from close friends attract broader community support
- **Transparent signals**: All lenders can verify the social graph

## No On-Chain Trust Calculation

The smart contract only tracks addresses and amounts. Social graph analysis happens off-chain to keep gas costs minimal.

**Future**: We may use zero-knowledge proofs to verify trust scores on-chain without revealing the social graph.

## Economic Signaling

Contributions have two dimensions:

### Financial Signal
- **Amount contributed**: Shows financial commitment
- **Early contributions**: Risk-taking signal (loan might not fund)
- **Full funding**: Demonstrates community confidence

### Social Signal
- **Proximity to borrower**: Closer = stronger endorsement
- **Contributor's reputation**: Well-connected lenders add more credibility
- **Network overlap**: Multiple lenders from same network = coordinated trust

## Trust Cascades

The vouching system creates natural trust cascades:

1. **Core network contributes first** (high trust, small amounts)
2. **Extended network sees validation** (medium trust, joins in)
3. **Public lenders feel safe** (low/no connection, but validated by others)
4. **Loan reaches full funding** (diverse lender base)

This pattern mirrors traditional lending: you ask family first, then friends, then acquaintances, then institutions.

### Research Foundation

Trust cascades are supported by microfinance research:

- **Peer Monitoring**: Group members monitor each other's behavior, reducing moral hazard
- **Social Sanctions**: Network connections create enforcement through reputation damage
- **Information Cascades**: Early endorsements by trusted connections influence subsequent lenders

{% hint style="info" %}
**Research shows**: Increased meeting frequency in lending groups builds social capital and information sharing, improving repayment by creating persistent social ties (Feigenberg et al., 2013). [See complete research](../references.md)
{% endhint %}

## Anti-Patterns

What **doesn't** work:

❌ **Sybil attacks**: Fake accounts with no real connections  
❌ **Circular vouching**: Small groups vouching for each other repeatedly  
❌ **Paid vouching**: Offering payment for contributions (detectable on-chain)  
❌ **Single large lender**: No social validation, just capital

## Best Practices

For **borrowers**:
- Share with close connections first
- Explain your story clearly in metadata
- Update supporters as you reach milestones
- Start small to build reputation

For **lenders**:
- Check trust scores before contributing
- Prioritize borrowers with strong network support
- Contribute early to friends (signals confidence)
- Watch repayment history for repeat borrowers

---

**Next**: Learn how [Reputation System](reputation-system.md) builds long-term trust
