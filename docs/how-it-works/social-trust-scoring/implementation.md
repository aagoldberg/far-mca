# Implementation

## Technical Details of Trust Score Calculation

Trust scores are calculated **off-chain** using the Farcaster social graph. This keeps gas costs low while leveraging rich social network data.

---

## Why Off-Chain?

Calculating trust scores on-chain would require:
- Storing entire social graph (millions of connections)
- Complex graph algorithms (high gas cost)
- Frequent updates (social graph changes daily)

{% hint style="info" %}
**Off-chain calculation means:**
- Gas costs stay at ~$0.01 per transaction
- Trust scores calculated in 2-3 seconds
- No blockchain storage needed
- Fresh data from Farcaster
{% endhint %}

---

## Data Source: Farcaster via Neynar

**Farcaster:** Decentralized social network with cryptographic identities and unforgeable social connections

**Neynar:** API access to Farcaster data (profiles, connections, quality scores)

---

## API Calls Per Score

Required data fetches:
1. Borrower followers (1 call)
2. Borrower following (1 call)
3. Lender followers (1 call)
4. Lender following (1 call)
5. Degree for each mutual connection (N calls)

**Total:** 4 + N calls, where N = mutual count

**Example:** 25 mutuals = 29 API calls (~2-3 seconds with parallel fetching)

---

## Performance Optimization

### 1. Parallel Fetching
All degree lookups happen simultaneously → 25 sequential calls (25s) become 25 parallel calls (3s)

### 2. Redis Caching
Trust scores cached for 30 minutes:
- Social graphs change slowly (new follows happen over hours/days)
- Reduces API costs
- Expected cache hit rate: 60-80% after first week

### 3. Graceful Fallback
If any API call fails, use conservative estimate (degree = 100) instead of breaking entire calculation

---

## Cost Analysis

### Neynar Pricing (Estimated)

| Tier | API Calls/Month | Cost |
|------|----------------|------|
| Free | 10,000 | $0 |
| Starter | 100,000 | $50/mo |
| Pro | 1,000,000 | $200/mo |

### LendFriend Usage

**Per trust score:** ~19 API calls (average)

**Per loan:** ~76 fresh calls (10 lenders, 60% cache hit rate)

**Monthly projections:**

| Loans/Month | API Calls | Cost |
|------------|----------|------|
| 10 | 760 | $0 |
| 100 | 7,600 | $0 |
| 1,000 | 76,000 | $50 |
| 10,000 | 760,000 | $200 |

{% hint style="success" %}
**Cost scales linearly**

At $200/month for 10,000 loans = **$0.02 per loan** for trust scoring.

Negligible compared to loan values ($100-1000 average).
{% endhint %}

---

## Code Structure

### File Locations
```
apps/
├── web/src/lib/socialProximity.ts
├── farcaster/src/lib/socialProximity.ts
```

Both files contain identical logic for consistency.

### Key Functions

**`calculateSocialProximity(borrowerFid, lenderFid)`**

Returns:
```typescript
{
  mutualConnections: number,
  socialDistance: number,      // 0-100
  avgQuality: number,           // 0-1
  riskTier: 'LOW' | 'MEDIUM' | 'HIGH'
}
```

**`calculateAdamicAdarScore(mutualFids[])`**

Process:
1. Fetch degree for each mutual FID
2. Calculate weight = 1/log(degree)
3. Sum all weights
4. Return AA_score

---

## Security

### API Key Protection
```typescript
// ❌ NEVER expose client-side
const neynarClient = new NeynarClient(process.env.NEYNAR_API_KEY);

// ✅ Always call from server-side API routes
```

### Rate Limiting
30 requests per minute per IP to prevent abuse

### Input Validation
Validate FIDs are valid numbers (1-999999999)

---

## Monitoring

Key metrics to track:

| Metric | Target | Alert If |
|--------|--------|---------|
| API response time | <3s | >5s |
| Cache hit rate | >60% | <40% |
| API error rate | <1% | >5% |
| Neynar usage | — | >80% of tier |

---

## Error Handling

**User Not Found:** Return score of 0 with HIGH RISK tier

**Rate Limit:** Retry with exponential backoff

**Network Timeout:** Fail after 5 seconds, use fallback

---

## Deployment

### Environment Variables
```bash
NEYNAR_API_KEY=your_api_key
REDIS_URL=redis://localhost:6379
```

### Infrastructure Cost (MVP)
| Service | Purpose | Cost |
|---------|---------|------|
| Vercel | API hosting | $20/mo |
| Redis Cloud | Cache | $0 (free) |
| Neynar API | Social data | $0-50/mo |
| **Total** | — | **$20-70/mo** |

---

## Why Not On-Chain?

| Approach | Pros | Cons | Our Choice |
|----------|------|------|------------|
| **Full on-chain** | Decentralized | $5-50 gas per calc | ❌ |
| **Oracle** | Trustless | Complex, slow | ❌ |
| **Off-chain** | Fast, cheap | Centralized trust | ✅ MVP |

**Decision:** Off-chain for MVP, consider attestations in Phase 2

---

## API Reference

### `POST /api/trust-score`

**Request:**
```json
{
  "borrowerFid": 12345,
  "lenderFid": 67890
}
```

**Response:**
```json
{
  "mutualConnections": 25,
  "socialDistance": 45,
  "avgQuality": 0.85,
  "riskTier": "MEDIUM",
  "cached": false
}
```

**Status Codes:**
- `200` Success
- `400` Invalid FIDs
- `404` User not found
- `429` Rate limit exceeded
- `500` Server error

---

## Next Steps

- **Understand the algorithm?** → [The Algorithm](the-algorithm.md)
- **See risk classifications?** → [Risk Tiers](risk-tiers.md)
- **Curious about social dynamics?** → [Trust Cascades](trust-cascades.md)
- **Worried about gaming?** → [Sybil Resistance](sybil-resistance.md)

**Back to:** [Social Trust Scoring Overview](README.md)
