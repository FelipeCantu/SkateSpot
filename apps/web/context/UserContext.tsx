"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { User } from "@/types/models";

interface UserContextType {
    currentUser: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (username: string) => void;
    logout: () => void;
    updateProfile: (updates: Partial<User>) => void;
    addPoints: (amount: number) => void;
    followUser: (userId: string) => void;
    unfollowUser: (userId: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch full user profile when session is available
    useEffect(() => {
        if (status === "loading") return;

        if (session?.user) {
            fetchUserProfile();
        } else {
            setCurrentUser(null);
            setIsLoading(false);
        }
    }, [session, status]);

    const fetchUserProfile = async () => {
        try {
            const res = await fetch("/api/users/me");
            if (res.ok) {
                const data = await res.json();
                setCurrentUser({
                    id: data.id,
                    username: data.username,
                    name: data.name,
                    avatar: data.avatar,
                    bio: data.bio,
                    points: data.points,
                    tier: data.tier,
                    location: data.location,
                    followers: Array(data.followers).fill(""),
                    following: Array(data.following).fill(""),
                    joinedAt: data.joinedAt,
                    socialLinks: data.socialLinks,
                });
            }
        } catch (error) {
            console.error("Failed to fetch user profile", error);
        } finally {
            setIsLoading(false);
        }
    };

    const login = useCallback(() => {
        // Auth is now handled by NextAuth, this is a no-op
    }, []);

    const logout = useCallback(() => {
        setCurrentUser(null);
    }, []);

    const updateProfile = useCallback(async (updates: Partial<User>) => {
        try {
            const res = await fetch("/api/users/me", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates),
            });
            if (res.ok) {
                const data = await res.json();
                setCurrentUser((prev) => prev ? { ...prev, ...data } : null);
            }
        } catch (error) {
            console.error("Failed to update profile", error);
        }
    }, []);

    const addPoints = useCallback((amount: number) => {
        // Points are managed server-side now, just refresh profile
        fetchUserProfile();
    }, []);

    const followUser = useCallback(async (userId: string) => {
        try {
            const res = await fetch(`/api/users/${userId}/follow`, { method: "POST" });
            if (res.ok) {
                // Optimistic update
                setCurrentUser((prev) => {
                    if (!prev) return null;
                    return { ...prev, following: [...prev.following, userId] };
                });
            }
        } catch (error) {
            console.error("Failed to follow user", error);
        }
    }, []);

    const unfollowUser = useCallback(async (userId: string) => {
        try {
            const res = await fetch(`/api/users/${userId}/follow`, { method: "POST" });
            if (res.ok) {
                setCurrentUser((prev) => {
                    if (!prev) return null;
                    return { ...prev, following: prev.following.filter(id => id !== userId) };
                });
            }
        } catch (error) {
            console.error("Failed to unfollow user", error);
        }
    }, []);

    return (
        <UserContext.Provider value={{
            currentUser,
            isAuthenticated: !!currentUser,
            isLoading,
            login,
            logout,
            updateProfile,
            addPoints,
            followUser,
            unfollowUser
        }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}
