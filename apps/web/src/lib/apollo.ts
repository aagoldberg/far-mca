import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

// Lazy initialization to avoid build-time errors
let client: ApolloClient<any> | null = null;

// The getClient function creates client on first use
export const getClient = () => {
  if (client) {
    return client;
  }

  const SUBGRAPH_URL = process.env.NEXT_PUBLIC_SUBGRAPH_URL;

  if (!SUBGRAPH_URL) {
    throw new Error("Missing NEXT_PUBLIC_SUBGRAPH_URL environment variable");
  }

  // Create HTTP link
  const httpLink = createHttpLink({
    uri: SUBGRAPH_URL,
  });

  // Create a single instance of the Apollo Client with BigInt handling
  client = new ApolloClient({
      link: httpLink,
      cache: new InMemoryCache({
        typePolicies: {
          Campaign: {
            fields: {
              goalAmount: {
                read(existing) {
                  return existing || "0";
                }
              },
              totalRaised: {
                read(existing) {
                  return existing || "0";
                }
              },
              totalDirectTransfers: {
                read(existing) {
                  return existing || "0";
                }
              },
              actualBalance: {
                read(existing) {
                  return existing || "0";
                }
              }
            }
          },
          Contribution: {
            fields: {
              amount: {
                read(existing) {
                  return existing || "0";
                }
              }
            }
          },
          DirectTransfer: {
            fields: {
              amount: {
                read(existing) {
                  return existing || "0";
                }
              }
            }
          }
        }
      }),
      defaultOptions: {
        watchQuery: {
          fetchPolicy: 'network-only',
        },
        query: {
          fetchPolicy: 'network-only',
        },
      },
  });

  return client;
}; 