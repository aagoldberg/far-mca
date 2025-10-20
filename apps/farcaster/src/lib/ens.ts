import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { normalize } from 'viem/ens';

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http()
});

export interface ENSProfile {
  name: string | null;
  avatar: string | null;
  description: string | null;
  twitter: string | null;
  github: string | null;
  website: string | null;
  email: string | null;
  discord: string | null;
}

export async function getENSProfile(address: `0x${string}`): Promise<ENSProfile | null> {
  try {
    // Get ENS name
    const ensName = await publicClient.getEnsName({ address });

    if (!ensName) return null;

    // Fetch text records in parallel
    const [avatar, description, twitter, github, website, email, discord] = await Promise.all([
      publicClient.getEnsAvatar({ name: normalize(ensName) }).catch(() => null),
      publicClient.getEnsText({ name: normalize(ensName), key: 'description' }).catch(() => null),
      publicClient.getEnsText({ name: normalize(ensName), key: 'com.twitter' }).catch(() => null),
      publicClient.getEnsText({ name: normalize(ensName), key: 'com.github' }).catch(() => null),
      publicClient.getEnsText({ name: normalize(ensName), key: 'url' }).catch(() => null),
      publicClient.getEnsText({ name: normalize(ensName), key: 'email' }).catch(() => null),
      publicClient.getEnsText({ name: normalize(ensName), key: 'com.discord' }).catch(() => null),
    ]);

    return {
      name: ensName,
      avatar,
      description,
      twitter,
      github,
      website,
      email,
      discord,
    };
  } catch (error) {
    console.error('Error fetching ENS profile:', error);
    return null;
  }
}
