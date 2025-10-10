import { createConfig } from "@privy-io/wagmi";
import { http } from "wagmi";
import { baseSepolia } from "viem/chains";

const alchemyRpcUrl = process.env.NEXT_PUBLIC_RPC_URL;

if (!alchemyRpcUrl) {
  console.warn(`[Config Warning] NEXT_PUBLIC_RPC_URL is not set. Falling back to public RPC, which may be unreliable.`);
}

export const wagmiConfig = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(alchemyRpcUrl), // Use the specific RPC URL
  },
}); 