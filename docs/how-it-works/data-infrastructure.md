# Data Infrastructure

LendFriend uses The Graph for on-chain data indexing and IPFS for decentralized metadata storage.

---

## The Graph Subgraph

**Network:** Base Sepolia (testnet), Base Mainnet (planned)
**Subgraph ID:** `lendfriend-base-sepolia`

The Graph indexes all loan events in real-time, enabling fast queries without hitting the blockchain directly.

### Schema

**Entities indexed:**

```graphql
type Loan @entity {
  id: ID!                           # Loan contract address
  borrower: Bytes!                  # Borrower wallet address
  principal: BigInt!                # Requested loan amount (USDC)
  totalRaised: BigInt!              # Amount currently raised
  totalRepaid: BigInt!              # Amount repaid so far
  maturityDate: BigInt!             # Unix timestamp of maturity
  createdAt: BigInt!                # Unix timestamp of creation
  metadataURI: String!              # IPFS CID for loan metadata
  status: LoanStatus!               # FUNDRAISING, ACTIVE, REPAID, DEFAULTED
  contributions: [Contribution!]! @derivedFrom(field: "loan")
  repayments: [Repayment!]! @derivedFrom(field: "loan")
}

type Contribution @entity {
  id: ID!                           # tx hash + log index
  loan: Loan!                       # Related loan
  lender: Bytes!                    # Lender wallet address
  amount: BigInt!                   # Contribution amount
  timestamp: BigInt!                # Unix timestamp
  transactionHash: Bytes!
}

type Repayment @entity {
  id: ID!                           # tx hash + log index
  loan: Loan!                       # Related loan
  amount: BigInt!                   # Repayment amount
  timestamp: BigInt!                # Unix timestamp
  transactionHash: Bytes!
}

enum LoanStatus {
  FUNDRAISING                       # Accepting contributions
  ACTIVE                            # Funded, not yet matured
  REPAID                            # Fully repaid
  DEFAULTED                         # Unpaid at maturity + grace period
}
```

### Common Queries

**Get all loans for a borrower:**

```graphql
{
  loans(where: { borrower: "0x..." }) {
    id
    principal
    totalRaised
    totalRepaid
    maturityDate
    status
    contributions {
      lender
      amount
      timestamp
    }
  }
}
```

**Get lender's portfolio (all contributions):**

```graphql
{
  contributions(where: { lender: "0x..." }) {
    loan {
      id
      borrower
      principal
      status
      maturityDate
    }
    amount
    timestamp
  }
}
```

**Get active loans (fundraising or active):**

```graphql
{
  loans(where: { status_in: [FUNDRAISING, ACTIVE] }) {
    id
    borrower
    principal
    totalRaised
    maturityDate
    createdAt
  }
}
```

**Get loans expiring soon:**

```graphql
{
  loans(
    where: {
      status: ACTIVE
      maturityDate_lt: 1704067200  # Unix timestamp
    }
    orderBy: maturityDate
    orderDirection: asc
  ) {
    id
    borrower
    principal
    totalRepaid
    maturityDate
  }
}
```

### Frontend Integration

**React Query example:**

```typescript
import { useQuery } from '@tanstack/react-query';
import { request, gql } from 'graphql-request';

const SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/lendfriend/base-sepolia';

export function useBorrowerLoans(borrowerAddress: string) {
  return useQuery({
    queryKey: ['borrower-loans', borrowerAddress],
    queryFn: async () => {
      const query = gql`
        query GetBorrowerLoans($borrower: Bytes!) {
          loans(where: { borrower: $borrower }) {
            id
            principal
            totalRaised
            totalRepaid
            maturityDate
            status
          }
        }
      `;
      return request(SUBGRAPH_URL, query, { borrower: borrowerAddress.toLowerCase() });
    },
    enabled: !!borrowerAddress,
  });
}
```

---

## IPFS Metadata Storage

**Provider:** Pinata
**Storage type:** Immutable loan metadata (images, descriptions, budget breakdowns)

IPFS stores loan metadata that's too expensive to store on-chain. Each loan has a metadata URI stored in its smart contract.

### Metadata Schema

```typescript
interface LoanMetadata {
  title: string;                    // Loan title (e.g., "Help me buy a laptop for coding")
  description: string;              // Detailed description (markdown supported)
  images?: string[];                // IPFS CIDs of uploaded images
  budgetBreakdown?: {
    category: string;               // e.g., "Equipment", "Materials", "Labor"
    amount: number;                 // Amount in USDC
    description?: string;
  }[];
  borrowerInfo: {
    fid: number;                    // Farcaster ID
    username: string;               // Farcaster username
    displayName: string;            // Farcaster display name
    pfp: string;                    // Profile picture URL
  };
  tags?: string[];                  // Optional tags for categorization
  createdAt: number;                // Unix timestamp
  version: string;                  // Schema version (e.g., "1.0")
}
```

### Upload Flow

**1. User creates loan:**
- Fills out loan form (title, description, images, budget)
- Frontend validates input

**2. Upload images to IPFS:**
```typescript
const imageFiles = formData.images; // File[]
const imageCIDs: string[] = [];

for (const file of imageFiles) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST',
    headers: { Authorization: `Bearer ${PINATA_JWT}` },
    body: formData,
  });

  const { IpfsHash } = await response.json();
  imageCIDs.push(IpfsHash);
}
```

**3. Upload metadata JSON to IPFS:**
```typescript
const metadata: LoanMetadata = {
  title: formData.title,
  description: formData.description,
  images: imageCIDs,
  budgetBreakdown: formData.budgetBreakdown,
  borrowerInfo: {
    fid: user.fid,
    username: user.username,
    displayName: user.displayName,
    pfp: user.pfp,
  },
  createdAt: Date.now(),
  version: '1.0',
};

const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${PINATA_JWT}`,
  },
  body: JSON.stringify(metadata),
});

const { IpfsHash: metadataCID } = await response.json();
```

**4. Create loan with metadata URI:**
```typescript
const metadataURI = `ipfs://${metadataCID}`;

await loanFactory.createLoan(
  borrowerAddress,
  metadataURI,  // Stored in contract
  principal,
  loanDuration,
  fundraisingDeadline
);
```

### Fetching Metadata

**From loan contract:**

```typescript
const loan = await ethers.getContractAt('MicroLoan', loanAddress);
const metadataURI = await loan.metadataURI(); // "ipfs://Qm..."

// Fetch from IPFS gateway
const cid = metadataURI.replace('ipfs://', '');
const response = await fetch(`https://gateway.pinata.cloud/ipfs/${cid}`);
const metadata: LoanMetadata = await response.json();
```

**IPFS gateway options:**
- Pinata: `https://gateway.pinata.cloud/ipfs/{cid}`
- Cloudflare: `https://cloudflare-ipfs.com/ipfs/{cid}`
- IPFS.io: `https://ipfs.io/ipfs/{cid}`

### Data Immutability

Once uploaded to IPFS:
- Metadata **cannot be changed** (immutable by design)
- Images **cannot be deleted** (pinned permanently)
- Loan details are **permanent** on-chain record

This ensures transparency: borrowers cannot edit loan terms after creation.

---

## Performance Optimization

**Caching strategy:**

1. **The Graph queries:** Cached by React Query (30-second TTL)
2. **IPFS metadata:** Cached in browser localStorage (permanent)
3. **Images:** Cached by CDN (Pinata gateway)

**Example caching setup:**

```typescript
export function useLoanMetadata(metadataURI: string) {
  return useQuery({
    queryKey: ['loan-metadata', metadataURI],
    queryFn: async () => {
      // Check localStorage first
      const cached = localStorage.getItem(metadataURI);
      if (cached) return JSON.parse(cached);

      // Fetch from IPFS
      const cid = metadataURI.replace('ipfs://', '');
      const response = await fetch(`https://gateway.pinata.cloud/ipfs/${cid}`);
      const metadata = await response.json();

      // Cache in localStorage
      localStorage.setItem(metadataURI, JSON.stringify(metadata));

      return metadata;
    },
    staleTime: Infinity,  // IPFS content is immutable
  });
}
```

---

## Related Documentation

- [Technical Stack](technical-stack.md) — Overall architecture
- [Smart Contract Flow](smart-contract-flow.md) — How contracts interact with data layer
- [Borrower Profiles](borrower-profiles.md) — How metadata is displayed
