export type IPFSMetadata = {
  title: string;
  description: string;
  image: string;
  name?: string;
  [key: string]: unknown;
};

export async function getIPFSMetadata(cid: string): Promise<IPFSMetadata | null> {
    if (!cid) return null;
    try {
        const url = `https://ipfs.io/ipfs/${cid}`;
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`Failed to fetch IPFS metadata from ${url}: ${response.statusText}`);
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error("Error parsing IPFS metadata:", error);
        return null;
    }
} 