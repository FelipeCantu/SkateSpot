"use client";

import { useState } from "react";
import { UserPlus, UserMinus } from "lucide-react";

interface FollowButtonProps {
    userId: string;
    initialFollowing: boolean;
    onToggle?: (following: boolean) => void;
}

export function FollowButton({ userId, initialFollowing, onToggle }: FollowButtonProps) {
    const [following, setFollowing] = useState(initialFollowing);
    const [hover, setHover] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/users/${userId}/follow`, { method: "POST" });
            if (res.ok) {
                const data = await res.json();
                setFollowing(data.following);
                onToggle?.(data.following);
            }
        } catch (err) {
            console.error("Follow toggle failed", err);
        } finally {
            setLoading(false);
        }
    };

    if (following) {
        return (
            <button
                onClick={handleClick}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                disabled={loading}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    hover
                        ? "bg-red-500/10 border border-red-500/30 text-red-400"
                        : "bg-neutral-800 border border-white/10 text-white"
                }`}
            >
                {hover ? <UserMinus size={16} /> : null}
                {hover ? "Unfollow" : "Following"}
            </button>
        );
    }

    return (
        <button
            onClick={handleClick}
            disabled={loading}
            className="px-4 py-2 bg-secondary hover:bg-secondary-dark text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-secondary/20"
        >
            <UserPlus size={16} />
            Follow
        </button>
    );
}
