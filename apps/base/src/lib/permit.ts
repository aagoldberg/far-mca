import { Abi, getContract } from 'viem';
import { wagmiConfig } from './wagmi';
import { getPublicClient } from '@wagmi/core';

// This is a generic nonce function. Some ERC20 tokens might use a different name.
const getNonce = async (owner: `0x${string}`, contractAddress: `0x${string}`, erc20Abi: Abi): Promise<bigint> => {
    const publicClient = getPublicClient(wagmiConfig);
    if (!publicClient) {
        throw new Error("Public client not found");
    }
    // The `nonces` function is the correct one for EIP-2612 permits, which USDC uses.
    // We will provide the correct ABI from the component, so no fallback is needed.
    const nonce = await publicClient.readContract({
        address: contractAddress,
        abi: erc20Abi,
        functionName: 'nonces',
        args: [owner],
    });
    return nonce as bigint;
};

const getTokenDetails = async (contractAddress: `0x${string}`, erc20Abi: Abi) => {
    const publicClient = getPublicClient(wagmiConfig);
    if (!publicClient) {
        throw new Error("Public client not found");
    }

    const lowerCaseAddress = contractAddress.toLowerCase();

    // Handle specific, known contracts first for reliability
    // Base Sepolia Bridged USDC
    if (lowerCaseAddress === '0x036cbd53842c5426634e7929541ec2318f3dcf7e') {
        return { name: "USDC", version: "2" };
    }
    // Base Mainnet USDC
    if (lowerCaseAddress === '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913') {
        return { name: "USD Coin", version: "2" };
    }

    // Fallback to dynamic fetching for other tokens
    try {
        const [name, version] = await Promise.all([
            publicClient.readContract({
                address: contractAddress,
                abi: erc20Abi,
                functionName: 'name',
            }),
            publicClient.readContract({
                address: contractAddress,
                abi: erc20Abi,
                functionName: 'version',
            }).catch(() => "1") // Many permit tokens, especially older ones, don't have a version function and default to "1"
        ]);
        return { name: name as string, version: version as string };
    } catch (error) {
        console.error("Error fetching token details, falling back to defaults:", error);
        // This is a risky fallback and should be used with caution.
        // It assumes a USDC-like permit structure.
        return { name: "USD Coin", version: "1" };
    }
};

interface PermitDataParams {
    owner: `0x${string}`;
    spender: `0x${string}`;
    amount: bigint;
    contractAddress: `0x${string}`;
    erc20Abi: Abi;
    chainId?: number;
}

export const getErc20PermitData = async ({ owner, spender, amount, contractAddress, erc20Abi, chainId }: PermitDataParams) => {
    if (!chainId) {
        throw new Error("Chain ID is required to create a permit.");
    }
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600); // 1 hour from now
    const nonce = await getNonce(owner, contractAddress, erc20Abi);
    const { name, version } = await getTokenDetails(contractAddress, erc20Abi);

    const domain = {
        name,
        version,
        chainId: chainId,
        verifyingContract: contractAddress,
    };

    const types = {
        Permit: [
            { name: 'owner', type: 'address' },
            { name: 'spender', type: 'address' },
            { name: 'value', type: 'uint256' },
            { name: 'nonce', type: 'uint256' },
            { name: 'deadline', type: 'uint256' },
        ],
    };

    const message = {
        owner,
        spender,
        value: amount,
        nonce,
        deadline,
    };

    return { domain, types, message, primaryType: 'Permit' as const };
};

export const getErc20PermitData_EIP_712 = async ({ owner, spender, amount, contractAddress, erc20Abi, chainId }: PermitDataParams) => {
    if (!chainId) {
        throw new Error("Chain ID is required to create a permit.");
    }
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600); // 1 hour from now
    const nonce = await getNonce(owner, contractAddress, erc20Abi);
    // Note: EIP-712 permits might use a different nonce function name.
    // This example assumes `nonces`.

    const domain = {
        name: "USD Coin", // Or the specific token name
        version: "1", // EIP-712 permits often use "1"
        chainId: chainId,
        verifyingContract: contractAddress,
    };

    const types = {
        Permit: [
            { name: 'holder', type: 'address' },
            { name: 'spender', type: 'address' },
            { name: 'nonce', type: 'uint256' },
            { name: 'expiry', type: 'uint256' },
            { name: 'allowed', type: 'bool' },
        ],
    };

    const message = {
        holder: owner,
        spender: spender,
        nonce: nonce, // This needs to be the EIP-712 nonce
        expiry: deadline,
        allowed: true,
    };

    return { domain, types, message, primaryType: 'Permit' as const };
}; 