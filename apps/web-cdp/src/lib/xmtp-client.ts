/**
 * XMTP Client Utilities
 *
 * Handles XMTP group creation and management for loan discussions.
 * Each loan gets a private XMTP group with the borrower and all contributors.
 */

import { Client } from '@xmtp/browser-sdk';
import type { WalletClient } from 'viem';
import { toBytes } from 'viem';

// XMTP environment (use 'dev' for testing, 'production' for live)
const XMTP_ENV = process.env.NEXT_PUBLIC_XMTP_ENV === 'production' ? 'production' : 'dev';

/**
 * Create an XMTP-compatible signer from a viem WalletClient
 */
export function createXmtpSigner(
  address: `0x${string}`,
  walletClient: WalletClient,
  chainId: bigint = BigInt(84532) // Base Sepolia default
) {
  return {
    type: 'SCW' as const,
    getIdentifier: () => ({
      identifier: address.toLowerCase(),
      identifierKind: 'Ethereum' as const,
    }),
    signMessage: async (message: string) => {
      const signature = await walletClient.signMessage({
        account: address,
        message,
      });
      return toBytes(signature);
    },
    getChainId: () => chainId,
  };
}

/**
 * Create XMTP client for a wallet
 */
export async function createXmtpClient(
  address: `0x${string}`,
  walletClient: WalletClient,
  chainId?: bigint
): Promise<Client> {
  try {
    const signer = createXmtpSigner(address, walletClient, chainId);

    const client = await Client.create(signer, {
      env: XMTP_ENV,
    });

    console.log('[XMTP] Client created:', {
      address,
      inboxId: client.inboxId,
      env: XMTP_ENV,
    });

    return client;
  } catch (error) {
    console.error('[XMTP] Failed to create client:', error);
    throw new Error('Failed to initialize XMTP client');
  }
}

/**
 * Create a new group for a loan
 * This should be called by the borrower when launching the loan
 */
export async function createLoanGroup(
  client: Client,
  loanAddress: string,
  borrowerName?: string
): Promise<string> {
  try {
    const groupName = borrowerName
      ? `${borrowerName}'s Loan Discussion`
      : `Loan ${loanAddress.slice(0, 8)} Discussion`;

    const group = await client.conversations.newGroup(
      [], // Start with no members (borrower is auto-added)
      {
        name: groupName,
        description: `Private discussion group for loan ${loanAddress}`,
        // All members can post
        permissionLevel: 'all_members',
      }
    );

    console.log('[XMTP] Loan group created:', {
      groupId: group.id,
      loanAddress,
    });

    // Send welcome message
    await group.send('Welcome to the loan discussion! Contributors will be automatically added when they fund this loan.');

    return group.id;
  } catch (error) {
    console.error('[XMTP] Failed to create group:', error);
    throw new Error('Failed to create loan discussion group');
  }
}

/**
 * Add a contributor to the loan group
 * Called when someone funds a loan
 */
export async function addContributorToGroup(
  client: Client,
  groupId: string,
  contributorInboxId: string
): Promise<void> {
  try {
    const group = client.conversations.getConversationById(groupId);

    if (!group) {
      throw new Error('Group not found');
    }

    // Add the new member
    await group.addMembers([contributorInboxId]);

    console.log('[XMTP] Contributor added to group:', {
      groupId,
      contributorInboxId,
    });
  } catch (error) {
    console.error('[XMTP] Failed to add contributor:', error);
    // Don't throw - gracefully fail if XMTP isn't available
  }
}

/**
 * Send a message to the loan group
 * Can be used by borrower for updates or by bot for automated messages
 */
export async function sendGroupMessage(
  client: Client,
  groupId: string,
  message: string
): Promise<void> {
  try {
    const group = client.conversations.getConversationById(groupId);

    if (!group) {
      throw new Error('Group not found');
    }

    await group.send(message);

    console.log('[XMTP] Message sent to group:', {
      groupId,
      messageLength: message.length,
    });
  } catch (error) {
    console.error('[XMTP] Failed to send message:', error);
    throw new Error('Failed to send message');
  }
}

/**
 * Get user's inbox ID from their XMTP client
 * Needed to add them to groups
 */
export async function getInboxId(client: Client): Promise<string> {
  return client.inboxId;
}

/**
 * List all messages in a group
 */
export async function getGroupMessages(
  client: Client,
  groupId: string,
  limit: number = 50
) {
  try {
    const group = client.conversations.getConversationById(groupId);

    if (!group) {
      throw new Error('Group not found');
    }

    const messages = await group.messages({ limit });

    return messages.map((msg) => ({
      id: msg.id,
      senderAddress: msg.senderAddress,
      content: msg.content,
      sentAt: msg.sentAt,
    }));
  } catch (error) {
    console.error('[XMTP] Failed to fetch messages:', error);
    throw new Error('Failed to fetch messages');
  }
}

/**
 * Stream incoming messages from a group
 * Returns an async iterator for real-time updates
 */
export async function streamGroupMessages(
  client: Client,
  groupId: string
) {
  try {
    const group = client.conversations.getConversationById(groupId);

    if (!group) {
      throw new Error('Group not found');
    }

    return group.streamMessages();
  } catch (error) {
    console.error('[XMTP] Failed to stream messages:', error);
    throw new Error('Failed to stream messages');
  }
}

/**
 * Generate a friendly group topic/ID for a loan
 * This is for display purposes only - actual group IDs are generated by XMTP
 */
export function getLoanGroupTopic(loanAddress: string): string {
  return `lendfriend-loan-${loanAddress.toLowerCase()}`;
}
