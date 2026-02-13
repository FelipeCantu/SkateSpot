"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";

interface ConversationSummary {
  id: string;
  participants: { id: string; username: string; name: string; avatar: string }[];
  lastMessage: {
    id: string;
    content: string;
    type: string;
    sender: { id: string; username: string; name: string };
    createdAt: string;
  } | null;
  unread: boolean;
  updatedAt: string;
}

interface MessagingContextType {
  conversations: ConversationSummary[];
  unreadCount: number;
  isLoading: boolean;
  refreshConversations: () => void;
  createConversation: (participantId: string) => Promise<string | null>;
}

const MessagingContext = createContext<MessagingContextType | undefined>(undefined);

export function MessagingProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchConversations = useCallback(async () => {
    if (!session?.user) return;
    try {
      const res = await fetch("/api/conversations");
      if (res.ok) {
        const json = await res.json();
        setConversations(json.data ?? json);
      }
    } catch (err) {
      console.error("Failed to fetch conversations", err);
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 10000);
    return () => clearInterval(interval);
  }, [fetchConversations]);

  const unreadCount = conversations.filter((c) => c.unread).length;

  const createConversation = useCallback(async (participantId: string): Promise<string | null> => {
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantId }),
      });
      if (res.ok) {
        const data = await res.json();
        await fetchConversations();
        return data.id;
      }
      return null;
    } catch {
      return null;
    }
  }, [fetchConversations]);

  return (
    <MessagingContext.Provider value={{
      conversations,
      unreadCount,
      isLoading,
      refreshConversations: fetchConversations,
      createConversation,
    }}>
      {children}
    </MessagingContext.Provider>
  );
}

export function useMessaging() {
  const context = useContext(MessagingContext);
  if (context === undefined) {
    throw new Error("useMessaging must be used within a MessagingProvider");
  }
  return context;
}
