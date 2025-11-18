'use client';

import { useEffect, useState } from 'react';
import { useFarcasterProfile } from '@/hooks/useFarcasterProfile';
import { formatDistanceToNow } from 'date-fns';

interface Message {
  id: string;
  contributor_address: string;
  amount: string;
  message: string;
  created_at: string;
}

interface ContributionMessagesProps {
  loanAddress: string;
}

function MessageCard({ message }: { message: Message }) {
  const { profile, isLoading } = useFarcasterProfile(
    message.contributor_address as `0x${string}`
  );

  const displayName = profile?.display_name ||
    (profile?.username ? `@${profile.username}` : null) ||
    `${message.contributor_address.slice(0, 6)}...${message.contributor_address.slice(-4)}`;

  const avatarUrl = profile?.pfp_url ||
    `https://avatar.vercel.sh/${message.contributor_address}`;

  return (
    <div className="flex gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
      {/* Profile picture */}
      <img
        src={avatarUrl}
        className="w-10 h-10 rounded-full flex-shrink-0"
        alt={displayName}
      />

      <div className="flex-1 min-w-0">
        {/* Name & amount */}
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <p className="font-semibold text-gray-900">
            {displayName}
          </p>
          <span className="text-sm text-gray-400">•</span>
          <p className="text-sm font-medium text-[#3B9B7F]">
            ${message.amount} USDC
          </p>
        </div>

        {/* Message */}
        <p className="text-gray-700 mb-2 whitespace-pre-wrap break-words">
          {message.message}
        </p>

        {/* Footer: Timestamp */}
        <div className="flex items-center gap-3 flex-wrap">
          <p className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
          </p>
        </div>
      </div>
    </div>
  );
}

export function ContributionMessages({ loanAddress }: ContributionMessagesProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/contributions/messages?loanAddress=${loanAddress}`);

        if (!res.ok) {
          throw new Error('Failed to fetch messages');
        }

        const data = await res.json();
        setMessages(data.messages || []);
      } catch (err: any) {
        console.error('[Messages] Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [loanAddress]);

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
          <div className="space-y-3">
            <div className="h-20 bg-gray-100 rounded-xl" />
            <div className="h-20 bg-gray-100 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return null; // Silently fail - messages are optional
  }

  if (messages.length === 0) {
    return null; // Don't show section if no messages
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Messages of Support ({messages.length})
      </h3>

      <div className="space-y-3">
        {messages.map((message) => (
          <MessageCard key={message.id} message={message} />
        ))}
      </div>
    </div>
  );
}
