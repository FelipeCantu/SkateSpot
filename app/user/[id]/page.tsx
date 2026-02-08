"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Link as LinkIcon, Calendar, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { FollowButton } from "@/components/FollowButton";
import { FeedCard } from "@/components/FeedCard";
import { useFeed } from "@/context/FeedContext";

interface UserProfile {
    id: string;
    username: string;
    name: string;
    avatar: string;
    bio: string;
    points: number;
    tier: string;
    location: string;
    socialLinks: { instagram?: string; youtube?: string; tiktok?: string };
    followers: number;
    following: number;
    clipCount: number;
    isFollowing: boolean;
    joinedAt: number;
}

export default function UserProfilePage() {
    const params = useParams();
    const userId = params.id as string;
    const { data: session } = useSession();
    const { getClipsByUser } = useFeed();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/users/${userId}`)
            .then((r) => r.json())
            .then(setUser)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [userId]);

    const userClips = getClipsByUser(userId);
    const isOwnProfile = session?.user?.id === userId;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="animate-spin text-neutral-500" size={32} />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[50vh] text-neutral-500">
                User not found
            </div>
        );
    }

    return (
        <div className="pb-20">
            {/* Cover */}
            <div className="h-32 bg-neutral-800 relative" />

            <div className="max-w-2xl mx-auto px-4 pb-4">
                <div className="relative -mt-16 mb-4 flex justify-between items-end">
                    <div className="w-32 h-32 rounded-full border-4 border-black bg-neutral-800 overflow-hidden relative">
                        {user.avatar ? (
                            <Image src={user.avatar} alt={user.name} fill className="object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center text-4xl font-bold text-white">
                                {user.username.slice(0, 2).toUpperCase()}
                            </div>
                        )}
                    </div>
                    {!isOwnProfile && session?.user && (
                        <FollowButton userId={userId} initialFollowing={user.isFollowing} />
                    )}
                    {isOwnProfile && (
                        <Link
                            href="/profile"
                            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 border border-white/10 rounded-lg text-sm font-medium text-white transition-colors"
                        >
                            Edit Profile
                        </Link>
                    )}
                </div>

                <div className="space-y-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                            {user.name}
                            <span className="px-2 py-0.5 rounded text-xs bg-secondary/20 text-secondary border border-secondary/30 uppercase">
                                {user.tier}
                            </span>
                        </h1>
                        <p className="text-neutral-400">@{user.username}</p>
                    </div>

                    {user.bio && (
                        <p className="text-neutral-200 text-sm leading-relaxed">{user.bio}</p>
                    )}

                    <div className="flex flex-wrap gap-4 text-sm text-neutral-400">
                        {user.location && (
                            <div className="flex items-center gap-1.5">
                                <MapPin size={16} className="text-neutral-500" />
                                {user.location}
                            </div>
                        )}
                        {user.socialLinks?.instagram && (
                            <div className="flex items-center gap-1.5">
                                <LinkIcon size={16} className="text-neutral-500" />
                                <a href={`https://instagram.com/${user.socialLinks.instagram}`} target="_blank" rel="noopener noreferrer" className="hover:text-secondary hover:underline">
                                    @{user.socialLinks.instagram}
                                </a>
                            </div>
                        )}
                        <div className="flex items-center gap-1.5">
                            <Calendar size={16} className="text-neutral-500" />
                            Joined {new Date(user.joinedAt).toLocaleDateString()}
                        </div>
                    </div>

                    <div className="flex gap-6 py-2">
                        <div className="text-center">
                            <div className="font-bold text-white text-lg">{user.followers}</div>
                            <div className="text-xs text-neutral-500 uppercase tracking-wide">Followers</div>
                        </div>
                        <div className="text-center">
                            <div className="font-bold text-white text-lg">{user.following}</div>
                            <div className="text-xs text-neutral-500 uppercase tracking-wide">Following</div>
                        </div>
                        <div className="text-center">
                            <div className="font-bold text-white text-lg">{user.points}</div>
                            <div className="text-xs text-neutral-500 uppercase tracking-wide">Points</div>
                        </div>
                    </div>
                </div>

                {/* User's Clips */}
                <div className="mt-6 border-t border-white/5 pt-6">
                    <h2 className="text-lg font-bold text-white mb-4">Clips ({userClips.length})</h2>
                    {userClips.length > 0 ? (
                        <div className="space-y-4">
                            {userClips.map((clip) => (
                                <FeedCard key={clip.id} clip={clip} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-neutral-500">
                            No clips uploaded yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
