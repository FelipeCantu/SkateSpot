"use client";

import { useState, useEffect, useRef, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";

interface MessageData {
  id: string;
  content: string;
  type: string;
  senderId: string;
  createdAt: string;
  sender: { id: string; username: string; name: string; avatar: string };
}

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: conversationId } = use(params);
  const { data: session } = useSession();
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [conversation, setConversation] = useState<any>(null);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const userId = (session?.user as any)?.id;

  useEffect(() => {
    fetchConversation();
    fetchMessages();
    markAsRead();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function fetchConversation() {
    const res = await fetch(`/api/conversations/${conversationId}`);
    if (res.ok) setConversation(await res.json());
  }

  async function fetchMessages() {
    const res = await fetch(`/api/conversations/${conversationId}/messages`);
    if (res.ok) {
      const data = await res.json();
      setMessages(data.reverse());
    }
  }

  async function markAsRead() {
    await fetch(`/api/conversations/${conversationId}/read`, { method: "PATCH" });
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;
    setSending(true);
    try {
      const res = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newMessage }),
      });
      if (res.ok) {
        const msg = await res.json();
        setMessages((prev) => [...prev, msg]);
        setNewMessage("");
      }
    } finally {
      setSending(false);
    }
  }

  const otherUser = conversation?.participants?.find(
    (p: any) => p.userId !== userId
  )?.user;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-white/10 bg-neutral-900/50 backdrop-blur">
        <Link href="/messages" className="text-neutral-400 hover:text-white">
          <ArrowLeft size={20} />
        </Link>
        {otherUser && (
          <Link href={`/user/${otherUser.id}`} className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-full overflow-hidden relative">
              <Image
                src={otherUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUser.name}`}
                alt={otherUser.name}
                fill
                className="object-cover"
              />
            </div>
            <span className="font-medium text-white group-hover:text-accent">
              {otherUser.username}
            </span>
          </Link>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => {
          const isMine = msg.senderId === userId;
          return (
            <div
              key={msg.id}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                  isMine
                    ? "bg-accent text-white rounded-br-md"
                    : "bg-neutral-800 text-neutral-200 rounded-bl-md"
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <p className={`text-[10px] mt-1 ${isMine ? "text-white/60" : "text-neutral-500"}`}>
                  {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t border-white/10 flex gap-3">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-neutral-800 border border-white/10 rounded-full px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-accent"
        />
        <button
          type="submit"
          disabled={!newMessage.trim() || sending}
          className="bg-accent hover:bg-accent/80 text-white p-2.5 rounded-full transition-colors disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
