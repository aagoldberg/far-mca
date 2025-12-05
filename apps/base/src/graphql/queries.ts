import { gql } from '@apollo/client';

export const GET_RECENT_CONTRIBUTIONS = gql`
  query GetRecentContributions {
    contributions(first: 10, orderBy: timestamp, orderDirection: desc) {
      id
      contributor
      amount
      timestamp
      campaign {
        id
        metadataURI
      }
    }
  }
`;
