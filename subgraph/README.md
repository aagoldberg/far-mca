# MicroLoan Subgraph

This subgraph indexes all MicroLoan protocol events on Base Sepolia.

## Entities

- **MicroLoan** - Individual loan contracts with full state
- **Contribution** - Lender contributions to loans
- **Repayment** - Borrower repayments
- **Claim** - Lender claims of repaid funds
- **Refund** - Refunds from cancelled loans
- **MetadataUpdate** - Updates to loan metadata
- **LenderPosition** - Aggregated position for each lender per loan
- **GlobalStats** - Overall protocol statistics

## Setup

1. Install dependencies:
```bash
cd subgraph
npm install
```

2. Authenticate with The Graph Studio (if not already done):
```bash
npx graph auth --studio <YOUR_DEPLOY_KEY>
```

Your deploy key can be found at: https://thegraph.com/studio/subgraph/rbf-base/

3. Generate types from schema and ABIs:
```bash
npm run codegen
```

4. Build the subgraph:
```bash
npm run build
```

5. Deploy to The Graph Studio:
```bash
npm run deploy
```

## Configuration

The subgraph is configured to index:
- **Network**: Base Sepolia (chainId: 84532)
- **MicroLoanFactory**: `0x66C4857774F768DB1ac7F2eE1bB943F0D86D6a34`
- **Start Block**: `18448000`

## Updating

If you make changes to:
- **schema.graphql**: Run `npm run codegen` to regenerate types
- **subgraph.yaml**: Update contract addresses or start blocks
- **src/mapping.ts**: Update event handlers

Then build and deploy:
```bash
npm run build
npm run deploy
```

## Querying

After deployment, the subgraph will be available at:
```
https://api.studio.thegraph.com/query/<YOUR_ID>/rbf-base/version/latest
```

Update this URL in your frontend `.env.local`:
```
NEXT_PUBLIC_SUBGRAPH_URL=https://api.studio.thegraph.com/query/<YOUR_ID>/rbf-base/version/latest
```

## Example Queries

Get all loans:
```graphql
{
  microLoans(orderBy: createdAt, orderDirection: desc) {
    id
    borrower
    principal
    totalFunded
    totalRepaid
    percentFunded
    active
    completed
  }
}
```

Get loan details:
```graphql
{
  microLoan(id: "0x...") {
    id
    borrower
    metadataURI
    principal
    dueAt
    totalFunded
    totalRepaid
    contributions {
      contributor
      amount
      timestamp
    }
    repayments {
      payer
      amount
      timestamp
      wasLate
    }
  }
}
```

Get global stats:
```graphql
{
  globalStats(id: "global") {
    totalLoans
    activeLoans
    completedLoans
    defaultedLoans
    totalPrincipalFunded
    totalPrincipalRepaid
  }
}
```
