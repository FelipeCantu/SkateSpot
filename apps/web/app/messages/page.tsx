"use client";

import Link from "next/link";
import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { useMessaging } from "@/context/MessagingContext";
import { formatDistanceToNow } from "date-fns";
import { EmptyState } from "@/components/EmptyState";

export default function MessagesPage() {
  const { conversations, isLoading } = useMessaging();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white flex items-center gap-3 mb-6">
        <MessageCircle size={28} className="text-accent" />
        Messages
      </h1>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-neutral-900 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : conversations.length === 0 ? (
        <EmptyState
          icon={<MessageCircle size={48} />}
          title="No conversations yet"
          description="Start a conversation by visiting a user's profile and clicking Message."
        />
      ) : (
        <div className="space-y-2">
          {conversations.map((conv) => {
            const other = conv.participants[0];
            if (!other) return null;
            return (
              <Link
                key={conv.id}
                href={`/messages/${conv.id}`}
                className={`flex items-center gap-4 p-4 rounded-xl transition-colors hover:bg-white/5 ${
                  conv.unread ? "bg-accent/5 border border-accent/20" : "bg-neutral-900 border border-white/10"
                }`}
              >
                <div className="w-12 h-12 rounded-full overflow-hidden relative flex-shrink-0">
                  <Image
                    src={other.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${other.name}`}
                    alt={other.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-white">{other.username}</p>
                    {conv.lastMessage && (
                      <p className="text-xs text-neutral-500">
                        {formatDistanceToNow(new Date(conv.lastMessage.createdAt), { addSuffix: true })}
                      </p>
                    )}
                  </div>
                  {conv.lastMessage && (
                    <p className={`text-sm truncate ${conv.unread ? "text-white font-medium" : "text-neutral-400"}`}>
                      {conv.lastMessage.sender.id === other.id ? "" : "You: "}
                      {conv.lastMessage.content}
                    </p>
                  )}
                </div>
                {conv.unread && (
                  <span className="w-2.5 h-2.5 bg-accent rounded-full flex-shrink-0" />
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
