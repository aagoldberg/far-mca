import { http, createPublicClient } from "viem";
import { baseSepolia } from "viem/chains";
import { createPimlicoClient } from "permissionless/clients/pimlico";
import { entryPoint07Address } from "viem/account-abstraction";

const BUNDLER_URL = `https://api.pimlico.io/v2/${baseSepolia.id}/rpc?apikey=${process.env.NEXT_PUBLIC_PIMLICO_API_KEY}`;
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL!;

// export const publicClient = createPublicClient({
//   transport: http(RPC_URL),
// });

export const pimlicoClient = createPimlicoClient({
  transport: http(BUNDLER_URL),
  entryPoint: {
    address: entryPoint07Address,
    version: "0.7",
  },
}); 