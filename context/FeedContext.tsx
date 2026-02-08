"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Clip, Comment, Notification } from "@/types/models";
import { useSession } from "next-auth/react";

interface ApiClip {
    id: string;
    userId: string;
    spotId: string;
    type: "video" | "image";
    url: string;
    thumbnail: string;
    description: string;
    trickName?: string;
    likes: number;
    comments: number;
    isLiked: boolean;
    views: number;
    createdAt: number;
    user?: { id: string; username: string; name: string; avatar: string };
    spot?: { id: string; name: string };
}

interface FeedContextType {
    clips: Clip[];
    isLoading: boolean;
    error: string | null;
    uploadClip: (clip: Omit<Clip, "id" | "createdAt" | "userId" | "likes" | "comments" | "views">) => void;
    likeClip: (clipId: string) => void;
    saveClip: (clipId: string) => void;
    addComment: (clipId: string, content: string) => void;
    getComments: (clipId: string) => Comment[];
    notifications: Notification[];
    markNotificationRead: (id: string) => void;
    markAllNotificationsRead: () => void;
    getClipsBySpot: (spotId: string) => Clip[];
    getClipsByUser: (userId: string) => Clip[];
    refreshClips: () => void;
    refreshNotifications: () => void;
}

const FeedContext = createContext<FeedContextType | undefined>(undefined);

export function FeedProvider({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();
    const [apiClips, setApiClips] = useState<ApiClip[]>([]);
    const [commentsCache, setCommentsCache] = useState<Record<string, Comment[]>>({});
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Convert API clips to old Clip format for backward compatibility
    const clips: Clip[] = apiClips.map((c) => ({
        id: c.id,
        userId: c.userId,
        spotId: c.spotId,
        type: c.type,
        url: c.url,
        thumbnail: c.thumbnail,
        description: c.description,
        trickName: c.trickName,
        likes: c.isLiked && session?.user ? [session.user.id] : [],
        comments: Array(c.comments).fill(""),
        views: c.views,
        createdAt: c.createdAt,
        // Attach extra API data
        _user: c.user,
        _spot: c.spot,
        _likeCount: c.likes,
        _commentCount: c.comments,
    } as Clip & { _user?: any; _spot?: any; _likeCount?: number; _commentCount?: number }));

    const fetchClips = useCallback(async () => {
        try {
            setError(null);
            const res = await fetch("/api/clips");
            if (res.ok) {
                const data = await res.json();
                setApiClips(data);
            }
        } catch (err) {
            console.error("Failed to fetch clips", err);
            setError("Failed to load clips");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchNotifications = useCallback(async () => {
        if (!session?.user) return;
        try {
            const res = await fetch("/api/notifications");
            if (res.ok) {
                const data = await res.json();
                setNotifications(data.map((n: any) => ({
                    id: n.id,
                    userId: n.userId,
                    type: n.type,
                    sourceUserId: n.sourceUserId,
                    resourceId: n.resourceId,
                    read: n.read,
                    createdAt: n.createdAt,
                })));
            }
        } catch (err) {
            console.error("Failed to fetch notifications", err);
        }
    }, [session]);

    useEffect(() => {
        fetchClips();
    }, [fetchClips]);

    useEffect(() => {
        fetchNotifications();
        // Poll notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    const uploadClip = useCallback(async (clipData: Omit<Clip, "id" | "createdAt" | "userId" | "likes" | "comments" | "views">) => {
        try {
            const res = await fetch("/api/clips", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(clipData),
            });
            if (res.ok) {
                const newClip = await res.json();
                setApiClips((prev) => [newClip, ...prev]);
            }
        } catch (err) {
            console.error("Failed to upload clip", err);
        }
    }, []);

    const likeClip = useCallback(async (clipId: string) => {
        // Optimistic update
        setApiClips((prev) =>
            prev.map((c) => {
                if (c.id !== clipId) return c;
                return {
                    ...c,
                    isLiked: !c.isLiked,
                    likes: c.isLiked ? c.likes - 1 : c.likes + 1,
                };
            })
        );

        try {
            await fetch(`/api/clips/${clipId}/like`, { method: "POST" });
        } catch (err) {
            // Revert on failure
            setApiClips((prev) =>
                prev.map((c) => {
                    if (c.id !== clipId) return c;
                    return {
                        ...c,
                        isLiked: !c.isLiked,
                        likes: c.isLiked ? c.likes - 1 : c.likes + 1,
                    };
                })
            );
        }
    }, []);

    const saveClip = useCallback(async (clipId: string) => {
        try {
            await fetch(`/api/clips/${clipId}/save`, { method: "POST" });
        } catch (err) {
            console.error("Failed to save clip", err);
        }
    }, []);

    const addComment = useCallback(async (clipId: string, content: string) => {
        try {
            const res = await fetch(`/api/clips/${clipId}/comment`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content }),
            });
            if (res.ok) {
                const newComment = await res.json();
                setCommentsCache((prev) => ({
                    ...prev,
                    [clipId]: [newComment, ...(prev[clipId] || [])],
                }));
                // Update comment count
                setApiClips((prev) =>
                    prev.map((c) =>
                        c.id === clipId ? { ...c, comments: c.comments + 1 } : c
                    )
                );
            }
        } catch (err) {
            console.error("Failed to add comment", err);
        }
    }, []);

    const getComments = useCallback((clipId: string): Comment[] => {
        // Fetch comments if not cached
        if (!commentsCache[clipId]) {
            fetch(`/api/clips/${clipId}/comment`)
                .then((res) => res.json())
                .then((data) => {
                    setCommentsCache((prev) => ({ ...prev, [clipId]: data }));
                })
                .catch(console.error);
            return [];
        }
        return commentsCache[clipId];
    }, [commentsCache]);

    const markNotificationRead = useCallback(async (id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
        try {
            await fetch(`/api/notifications/${id}`, { method: "PATCH" });
        } catch (err) {
            console.error("Failed to mark notification read", err);
        }
    }, []);

    const markAllNotificationsRead = useCallback(async () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        try {
            await fetch("/api/notifications", { method: "PATCH" });
        } catch (err) {
            console.error("Failed to mark all notifications read", err);
        }
    }, []);

    const getClipsBySpot = useCallback(
        (spotId: string) => clips.filter((c) => c.spotId === spotId),
        [clips]
    );

    const getClipsByUser = useCallback(
        (userId: string) => clips.filter((c) => c.userId === userId),
        [clips]
    );

    return (
        <FeedContext.Provider value={{
            clips,
            isLoading,
            error,
            uploadClip,
            likeClip,
            saveClip,
            addComment,
            getComments,
            notifications,
            markNotificationRead,
            markAllNotificationsRead,
            getClipsBySpot,
            getClipsByUser,
            refreshClips: fetchClips,
            refreshNotifications: fetchNotifications,
        }}>
            {children}
        </FeedContext.Provider>
    );
}

export function useFeed() {
    const context = useContext(FeedContext);
    if (context === undefined) {
        throw new Error("useFeed must be used within a FeedProvider");
    }
    return context;
}
