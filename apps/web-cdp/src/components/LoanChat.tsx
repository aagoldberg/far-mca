'use client';

import { useEffect, useState, useRef } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { createXmtpClient, getGroupMessages, sendGroupMessage, streamGroupMessages } from '@/lib/xmtp-client';
import { formatDistanceToNow } from 'date-fns';
import type { Client } from '@xmtp/browser-sdk';

interface Message {
  id: string;
  senderAddress: string;
  content: string;
  sentAt: Date;
}

interface LoanChatProps {
  loanAddress: string;
  isContributor: boolean; // Only show chat if user has contributed
}

export function LoanChat({ loanAddress, isContributor }: LoanChatProps) {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();

  const [xmtpClient, setXmtpClient] = useState<Client | null>(null);
  const [groupId, setGroupId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize XMTP client and fetch group
  useEffect(() => {
    if (!address || !walletClient || !isContributor) {
      setLoading(false);
      return;
    }

    const initChat = async () => {
      try {
        setLoading(true);

        // Create XMTP client
        const client = await createXmtpClient(address, walletClient);
        setXmtpClient(client);

        // Fetch group ID from API
        const res = await fetch(`/api/xmtp/create-group?loanAddress=${loanAddress}`);
        const data = await res.json();

        if (!data.success || !data.xmtpGroupId) {
          setError('Chat not available yet');
          setLoading(false);
          return;
        }

        setGroupId(data.xmtpGroupId);

        // Fetch initial messages
        const msgs = await getGroupMessages(client, data.xmtpGroupId);
        setMessages(msgs);

        // Stream new messages
        const stream = await streamGroupMessages(client, data.xmtpGroupId);
        for await (const msg of stream) {
          setMessages((prev) => [
            ...prev,
            {
              id: msg.id,
              senderAddress: msg.senderAddress,
              content: msg.content,
              sentAt: msg.sentAt,
            },
          ]);
        }

        setLoading(false);
      } catch (err: any) {
        console.error('[Chat] Init error:', err);
        setError(err.message || 'Failed to load chat');
        setLoading(false);
      }
    };

    initChat();
  }, [address, walletClient, loanAddress, isContributor]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !xmtpClient || !groupId || sending) return;

    try {
      setSending(true);
      await sendGroupMessage(xmtpClient, groupId, newMessage.trim());
      setNewMessage('');
    } catch (err: any) {
      console.error('[Chat] Send error:', err);
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Don't show chat if user hasn't contributed
  if (!isContributor) {
    return null;
  }

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
          <div className="h-40 bg-gray-100 rounded" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Contributor Chat</h3>
        <p className="text-sm text-gray-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Contributor Chat
        <span className="ml-2 text-sm font-normal text-gray-500">
          (Private)
        </span>
      </h3>

      {/* Messages */}
      <div className="mb-4 h-96 overflow-y-auto border border-gray-200 rounded-xl p-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => {
              const isOwnMessage = msg.senderAddress.toLowerCase() === address?.toLowerCase();

              return (
                <div
                  key={msg.id}
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-2 ${
                      isOwnMessage
                        ? 'bg-[#3B9B7F] text-white'
                        : 'bg-white border border-gray-200'
                    }`}
                  >
                    {!isOwnMessage && (
                      <p className="text-xs text-gray-500 mb-1">
                        {msg.senderAddress.slice(0, 6)}...{msg.senderAddress.slice(-4)}
                      </p>
                    )}
                    <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        isOwnMessage ? 'text-white/70' : 'text-gray-400'
                      }`}
                    >
                      {formatDistanceToNow(new Date(msg.sentAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message input */}
      <div className="flex gap-2">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message... (Shift+Enter for new line)"
          rows={2}
          disabled={sending}
          className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-[#3B9B7F] focus:ring-0 outline-none resize-none disabled:opacity-50"
        />
        <button
          onClick={handleSendMessage}
          disabled={!newMessage.trim() || sending}
          className="px-6 py-2 bg-[#3B9B7F] text-white rounded-xl font-semibold hover:bg-[#2d7a63] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {sending ? 'Sending...' : 'Send'}
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-2">
        This chat is private and only visible to contributors and the borrower.
      </p>
    </div>
  );
}
