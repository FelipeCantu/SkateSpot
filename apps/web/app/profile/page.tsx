"use client";

import { Settings, MapPin, Link as LinkIcon, Calendar, Grid, Bookmark, Heart, Edit2 } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { useFeed } from "@/context/FeedContext";
import { FeedCard } from "@/components/FeedCard";
import { EditProfileModal } from "@/components/EditProfileModal";
import Link from "next/link";

export default function ProfilePage() {
    const { currentUser, isLoading } = useUser();
    const { getClipsByUser } = useFeed();
    const [activeTab, setActiveTab] = useState<"clips" | "saved" | "liked">("clips");
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [savedClips, setSavedClips] = useState<any[]>([]);
    const [likedClips, setLikedClips] = useState<any[]>([]);

    useEffect(() => {
        if (activeTab === "saved") {
            fetch("/api/users/me/saved")
                .then((r) => r.json())
                .then((json) => setSavedClips(json.data ?? json))
                .catch(console.error);
        }
        if (activeTab === "liked") {
            fetch("/api/users/me/liked")
                .then((r) => r.json())
                .then((json) => setLikedClips(json.data ?? json))
                .catch(console.error);
        }
    }, [activeTab]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh] text-neutral-500">
                Loading...
            </div>
        );
    }

    if (!currentUser) {
        return (
            <div className="flex items-center justify-center min-h-[50vh] text-neutral-500">
                <div className="text-center">
                    <p className="mb-4">Please log in to view your profile.</p>
                    <Link href="/login" className="px-4 py-2 bg-secondary text-white rounded-lg font-medium">
                        Sign In
                    </Link>
                </div>
            </div>
        );
    }

    const userClips = getClipsByUser(currentUser.id);

    return (
        <div className="pb-20">
            {/* Header / Cover */}
            <div className="h-32 bg-neutral-800 relative">
                <div className="absolute top-4 right-4">
                    <button className="p-2 bg-black/40 backdrop-blur-sm rounded-full text-white hover:bg-black/60 transition-colors">
                        <Settings size={20} />
                    </button>
                </div>
            </div>

            <div className="max-w-2xl mx-auto">
                {/* Profile Info */}
                <div className="px-4 pb-4">
                    <div className="relative -mt-16 mb-4 flex justify-between items-end">
                        <div className="w-32 h-32 rounded-full border-4 border-black bg-neutral-800 overflow-hidden relative">
                            {currentUser.avatar ? (
                                <Image
                                    src={currentUser.avatar}
                                    alt={currentUser.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center text-4xl font-bold text-white">
                                    {currentUser.username.slice(0, 2).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => setIsEditOpen(true)}
                            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 border border-white/10 rounded-lg text-sm font-medium text-white transition-colors flex items-center gap-2"
                        >
                            <Edit2 size={16} />
                            Edit Profile
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                                {currentUser.name}
                                <span className="px-2 py-0.5 rounded text-xs bg-secondary/20 text-secondary border border-secondary/30 uppercase">
                                    {currentUser.tier}
                                </span>
                            </h1>
                            <p className="text-neutral-400">@{currentUser.username}</p>
                        </div>

                        <p className="text-neutral-200 text-sm leading-relaxed max-w-lg">
                            {currentUser.bio}
                        </p>

                        <div className="flex flex-wrap gap-4 text-sm text-neutral-400">
                            {currentUser.location && (
                                <div className="flex items-center gap-1.5">
                                    <MapPin size={16} className="text-neutral-500" />
                                    {currentUser.location}
                                </div>
                            )}
                            {currentUser.socialLinks?.instagram && (
                                <div className="flex items-center gap-1.5">
                                    <LinkIcon size={16} className="text-neutral-500" />
                                    <a href={`https://instagram.com/${currentUser.socialLinks.instagram}`} target="_blank" rel="noopener noreferrer" className="hover:text-secondary hover:underline">
                                        instagram.com/{currentUser.socialLinks.instagram}
                                    </a>
                                </div>
                            )}
                            <div className="flex items-center gap-1.5">
                                <Calendar size={16} className="text-neutral-500" />
                                Joined {new Date(currentUser.joinedAt).toLocaleDateString()}
                            </div>
                        </div>

                        <div className="flex gap-6 py-2">
                            <div className="text-center">
                                <div className="font-bold text-white text-lg">{currentUser.followers.length}</div>
                                <div className="text-xs text-neutral-500 uppercase tracking-wide">Followers</div>
                            </div>
                            <div className="text-center">
                                <div className="font-bold text-white text-lg">{currentUser.following.length}</div>
                                <div className="text-xs text-neutral-500 uppercase tracking-wide">Following</div>
                            </div>
                            <div className="text-center">
                                <div className="font-bold text-white text-lg">{currentUser.points}</div>
                                <div className="text-xs text-neutral-500 uppercase tracking-wide">Points</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Tabs */}
                <div className="border-t border-white/5">
                    <div className="flex">
                        <button
                            onClick={() => setActiveTab("clips")}
                            className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === "clips" ? "border-secondary text-secondary" : "border-transparent text-neutral-500 hover:text-white"}`}
                        >
                            <Grid size={18} />
                            CLIPS
                        </button>
                        <button
                            onClick={() => setActiveTab("saved")}
                            className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === "saved" ? "border-secondary text-secondary" : "border-transparent text-neutral-500 hover:text-white"}`}
                        >
                            <Bookmark size={18} />
                            SAVED
                        </button>
                        <button
                            onClick={() => setActiveTab("liked")}
                            className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === "liked" ? "border-secondary text-secondary" : "border-transparent text-neutral-500 hover:text-white"}`}
                        >
                            <Heart size={18} />
                            LIKED
                        </button>
                    </div>

                    <div className="p-1">
                        {activeTab === "clips" && (
                            <div className="grid grid-cols-1 gap-4">
                                {userClips.length > 0 ? (
                                    userClips.map(clip => (
                                        <FeedCard key={clip.id} clip={clip} />
                                    ))
                                ) : (
                                    <div className="text-center py-12 text-neutral-500">
                                        <p>No clips uploaded yet.</p>
                                    </div>
                                )}
                            </div>
                        )}
                        {activeTab === "saved" && (
                            <div className="grid grid-cols-1 gap-4">
                                {savedClips.length > 0 ? (
                                    savedClips.map((clip: any) => (
                                        <div key={clip.id} className="p-4 bg-neutral-900 border border-white/5 rounded-xl">
                                            <p className="text-sm text-white font-medium">{clip.description}</p>
                                            <p className="text-xs text-neutral-500 mt-1">at {clip.spot?.name}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="h-48 flex items-center justify-center text-neutral-500 text-sm">
                                        <p>No saved clips yet.</p>
                                    </div>
                                )}
                            </div>
                        )}
                        {activeTab === "liked" && (
                            <div className="grid grid-cols-1 gap-4">
                                {likedClips.length > 0 ? (
                                    likedClips.map((clip: any) => (
                                        <div key={clip.id} className="p-4 bg-neutral-900 border border-white/5 rounded-xl">
                                            <p className="text-sm text-white font-medium">{clip.description}</p>
                                            <p className="text-xs text-neutral-500 mt-1">by @{clip.user?.username} at {clip.spot?.name}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="h-48 flex items-center justify-center text-neutral-500 text-sm">
                                        <p>No liked clips yet.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <EditProfileModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} />
        </div>
    );
}
