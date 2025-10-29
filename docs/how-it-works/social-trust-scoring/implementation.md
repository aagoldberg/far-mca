# Implementation

## Technical Details of Trust Score Calculation

Trust scores are calculated **off-chain** using the Farcaster social graph. This keeps gas costs low while leveraging rich social network data.

---

## Architecture Overview

```
┌─────────────────┐         ┌──────────────┐         ┌─────────────────┐
│   Web/Mobile    │ ────▶  │   API Server  │ ────▶  │  Neynar API     │
│   Frontend      │         │  (TypeScript) │         │  (Farcaster)    │
└─────────────────┘         └──────────────┘         └─────────────────┘
        │                           │                         │
        │                           ▼                         │
        │                   ┌──────────────┐                 │
        │                   │  Redis Cache │◀────────────────┘
        │                   │  (30 min TTL)│
        │                   └──────────────┘
        │
        ▼
┌─────────────────┐
│  Base L2        │
│  Smart Contract │
│  (Loan $$$)     │
└─────────────────┘
```

{% hint style="info" %}
**Why Off-Chain?**

Calculating trust scores on-chain would require:
- Storing entire social graph (millions of connections)
- Complex graph algorithms (high gas cost)
- Frequent updates (social graph changes daily)

**Instead:** Calculate off-chain, display in UI, never store on-chain.

**Result:** Gas costs stay at ~$0.01 per transaction.
{% endhint %}

---

## Data Source: Farcaster via Neynar

### What is Farcaster?

Farcaster is a decentralized social network with:
- Cryptographic user identities (FIDs)
- Unforgeable social connections
- Public social graph data
- Spam/bot detection (quality scores)

### What is Neynar?

Neynar provides API access to Farcaster data:
- User profiles and connections
- Follower/following relationships
- Quality scores (0-1 scale, spam filtering)
- Real-time updates

**API Endpoint:** `https://api.neynar.com/v2/`

---

## API Calls Per Score Calculation

### Required Data:

1. **Borrower followers** (1 API call)
2. **Borrower following** (1 API call)
3. **Lender followers** (1 API call)
4. **Lender following** (1 API call)
5. **Degree for each mutual connection** (N API calls)

**Total:** 4 + N calls, where N = count of mutual connections

### Example:

- 25 mutual connections
- Total API calls: 4 + 25 = **29 calls**
- Execution time: ~2-3 seconds (parallel fetching)

---

## Performance Optimization

### 1. Parallel Fetching

All degree lookups happen simultaneously:

```typescript
const degrees = await Promise.all(
  mutualFids.map(async (fid) => {
    const [followers, following] = await Promise.all([
      neynarClient.fetchFollowers(fid),
      neynarClient.fetchFollowing(fid),
    ]);
    return followers.length + following.length;
  })
);
```

**Impact:** 25 sequential calls (25 seconds) → 25 parallel calls (3 seconds)

---

### 2. Redis Caching

Trust scores are cached for 30 minutes:

```
Key: trust-score:${borrowerFid}:${lenderFid}
Value: { score, riskTier, mutualCount, timestamp }
TTL: 1800 seconds (30 minutes)
```

**Why 30 minutes?**
- Social graphs change slowly (new follows happen over hours/days)
- Reduces API costs (Neynar has rate limits)
- Fresh enough for real-time decisions

**Cache hit rate (expected):** 60-80% after first week

---

### 3. Graceful Fallback

If any API call fails:

```typescript
try {
  const degree = await fetchDegree(fid);
  return degree;
} catch (error) {
  console.warn(`Failed to fetch degree for FID ${fid}`);
  return 100; // Conservative estimate (medium network size)
}
```

**Impact:** Single API failure doesn't break entire calculation

---

## Code Structure

### File Locations

```
apps/
├── web/src/lib/socialProximity.ts          (React app)
├── farcaster/src/lib/socialProximity.ts    (Farcaster Frame)
```

Both files contain identical trust calculation logic to ensure consistency across platforms.

---

### Key Functions

#### `calculateSocialProximity(borrowerFid, lenderFid)`

**Input:**
- `borrowerFid`: Farcaster ID of borrower
- `lenderFid`: Farcaster ID of lender

**Output:**
```typescript
{
  mutualConnections: number,      // Count of mutual connections
  socialDistance: number,          // Score 0-100
  avgQuality: number,              // Quality adjustment 0-1
  riskTier: 'LOW' | 'MEDIUM' | 'HIGH'
}
```

---

#### `calculateAdamicAdarScore(mutualFids[])`

**Input:** Array of FIDs for mutual connections

**Output:** Weighted Adamic-Adar score

**Process:**
1. Fetch degree (total connections) for each mutual FID
2. Calculate weight = 1/log(degree)
3. Sum all weights
4. Return AA_score

---

### Example Usage

```typescript
import { calculateSocialProximity } from '@/lib/socialProximity';

const result = await calculateSocialProximity(
  borrowerFid: 12345,
  lenderFid: 67890
);

console.log(result);
// {
//   mutualConnections: 25,
//   socialDistance: 45,
//   avgQuality: 0.85,
//   riskTier: 'MEDIUM'
// }
```

---

## API Cost Analysis

### Neynar Pricing (Estimated)

| Tier | API Calls/Month | Cost |
|------|----------------|------|
| **Free** | 10,000 | $0 |
| **Starter** | 100,000 | $50/mo |
| **Pro** | 1,000,000 | $200/mo |

---

### LendFriend Usage Projections

**Per trust score calculation:**
- Average mutual count: 15
- API calls: 4 + 15 = 19 calls

**Per loan:**
- 10 lenders checking trust score
- 10 × 19 = 190 API calls
- With 60% cache hit rate: 190 × 0.4 = **76 fresh calls**

**Monthly at scale:**

| Loans/Month | API Calls/Month | Estimated Cost |
|------------|----------------|---------------|
| 10 | 760 | $0 (free tier) |
| 100 | 7,600 | $0 (free tier) |
| 1,000 | 76,000 | $50 (starter) |
| 10,000 | 760,000 | $200 (pro) |

{% hint style="success" %}
**Cost scales linearly**

At $200/month for 10,000 loans, that's **$0.02 per loan** for trust scoring.

Even with zero interest, this is negligible compared to loan values ($100-1000 average).
{% endhint %}

---

## Future Optimization: Degree Caching

**Current:** Fetch degree for each mutual on every calculation

**Future:** Cache degree counts with 24-hour TTL

```
Key: farcaster-degree:${fid}
Value: { totalConnections: number, timestamp }
TTL: 86400 seconds (24 hours)
```

**Impact:**
- Reduces API calls from 4 + N to 4 + (N × 0.1)
- For 15 mutuals: 19 calls → 5 calls (**73% reduction**)
- Connection counts change slowly (safe to cache)

**When to implement:** After exceeding free Neynar tier

---

## Security Considerations

### 1. API Key Protection

```typescript
// ❌ NEVER expose API keys client-side
const neynarClient = new NeynarClient(process.env.NEYNAR_API_KEY);

// ✅ Always call from server-side API routes
export async function GET(request: Request) {
  const { borrowerFid, lenderFid } = await request.json();
  const result = await calculateSocialProximity(borrowerFid, lenderFid);
  return Response.json(result);
}
```

---

### 2. Rate Limiting

Prevent abuse of trust score endpoint:

```typescript
const rateLimit = new RateLimiter({
  windowMs: 60 * 1000,  // 1 minute
  max: 30,               // 30 requests per minute per IP
});
```

---

### 3. Input Validation

```typescript
function validateFid(fid: unknown): number {
  if (typeof fid !== 'number' || fid < 1 || fid > 999999999) {
    throw new Error('Invalid Farcaster ID');
  }
  return fid;
}
```

---

## Testing

### Unit Tests

Test individual components:

```typescript
describe('calculateAdamicAdarScore', () => {
  it('weights small networks higher than large networks', async () => {
    const smallNetwork = [123]; // degree = 50
    const largeNetwork = [456]; // degree = 10000

    const scoreSmall = await calculateAdamicAdarScore(smallNetwork);
    const scoreLarge = await calculateAdamicAdarScore(largeNetwork);

    expect(scoreSmall).toBeGreaterThan(scoreLarge);
  });
});
```

---

### Integration Tests

Test with real Farcaster data:

```typescript
describe('calculateSocialProximity', () => {
  it('calculates trust score for known users', async () => {
    const result = await calculateSocialProximity(
      borrowerFid: 3621,  // @dwr (Farcaster founder)
      lenderFid: 2,       // @v (early user)
    );

    expect(result.socialDistance).toBeGreaterThan(0);
    expect(result.mutualConnections).toBeGreaterThan(10);
  });
});
```

---

## Monitoring & Observability

### Key Metrics to Track

| Metric | Target | Alert If |
|--------|--------|---------|
| **API response time** | <3s | >5s |
| **Cache hit rate** | >60% | <40% |
| **API error rate** | <1% | >5% |
| **Trust scores calculated/day** | — | Track growth |
| **Neynar API usage** | <10K/month initially | >80% of tier limit |

---

### Logging

```typescript
console.log({
  action: 'trust-score-calculated',
  borrowerFid,
  lenderFid,
  score: result.socialDistance,
  mutualCount: result.mutualConnections,
  cacheHit: false,
  duration: '2.4s',
  timestamp: new Date().toISOString(),
});
```

---

## Error Handling

### Common Errors

#### 1. User Not Found

```typescript
if (!borrowerProfile) {
  return {
    mutualConnections: 0,
    socialDistance: 0,
    avgQuality: 0,
    riskTier: 'HIGH',
    error: 'Borrower not found on Farcaster',
  };
}
```

---

#### 2. Rate Limit Exceeded

```typescript
if (error.status === 429) {
  // Wait and retry with exponential backoff
  await sleep(retryDelay);
  return fetchWithRetry(url, retryCount + 1);
}
```

---

#### 3. Network Timeout

```typescript
const fetchWithTimeout = (url, timeout = 5000) => {
  return Promise.race([
    fetch(url),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), timeout)
    ),
  ]);
};
```

---

## Deployment

### Environment Variables

```bash
# Neynar API (required)
NEYNAR_API_KEY=your_api_key_here

# Redis cache (required)
REDIS_URL=redis://localhost:6379

# Rate limiting (optional)
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=30
```

---

### Infrastructure

| Service | Purpose | Cost (MVP) |
|---------|---------|-----------|
| **Vercel** | API hosting | $20/month |
| **Redis Cloud** | Cache | $0 (free tier) |
| **Neynar API** | Social graph data | $0-50/month |
| **Total** | — | **~$20-70/month** |

{% hint style="success" %}
**Extremely cost-effective**

Even at 1,000 loans/month, total infrastructure cost is <$100/month.

Trust scoring adds minimal overhead to loan operations.
{% endhint %}

---

## Comparison to On-Chain Alternatives

| Approach | Pros | Cons | LendFriend Choice |
|----------|------|------|------------------|
| **Full on-chain** | Decentralized, trustless | Gas cost: $5-50 per calculation | ❌ Too expensive |
| **Oracle + on-chain** | Decentralized storage | Complex, slow updates | ❌ Overkill |
| **Off-chain + attestations** | Gas efficient, verifiable | Requires attestation infrastructure | 🔮 Future consideration |
| **Fully off-chain** | Fast, cheap, flexible | Centralized trust | ✅ **Current choice** |

**Decision:** Off-chain for MVP, consider attestations in v2.

---

## Future Enhancements

### Phase 2: Attestations

Sign trust scores with cryptographic attestations:

```typescript
const attestation = {
  borrowerFid: 12345,
  lenderFid: 67890,
  socialDistance: 45,
  timestamp: Date.now(),
  signature: sign(data, privateKey), // Verifiable proof
};
```

**Benefit:** Lenders can verify trust scores without trusting API server

---

### Phase 3: Decentralized Computation

Use a network of validators to calculate trust scores:

- Multiple validators compute independently
- Consensus on final score (median of results)
- Slashing for dishonest validators

**Benefit:** Full decentralization while maintaining low gas costs

---

## API Reference

### `POST /api/trust-score`

Calculate trust score between two users.

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
  "cached": false,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Status Codes:**
- `200 OK` - Success
- `400 Bad Request` - Invalid FIDs
- `404 Not Found` - User not found
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

---

## Next Steps

- **Understand the algorithm?** → [The Algorithm](the-algorithm.md)
- **Want to see risk classifications?** → [Risk Tiers](risk-tiers.md)
- **Curious about social dynamics?** → [Trust Cascades](trust-cascades.md)
- **Worried about gaming?** → [Sybil Resistance](sybil-resistance.md)

---

**Back to:** [Social Trust Scoring Overview](README.md)
