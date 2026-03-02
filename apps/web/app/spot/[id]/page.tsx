"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, Video, Crown, Medal, Trophy, Loader2 } from "lucide-react";
import { StarRating } from "@/components/StarRating";
import { UploadClipModal } from "@/components/UploadClipModal";
import { WeatherWidget } from "@/components/WeatherWidget";
import { formatDistanceToNow } from "date-fns";

interface SpotDetail {
    id: string;
    name: string;
    description: string;
    location: [number, number];
    difficulty: string;
    type: string;
    rating: number;
    ratingCount: number;
    features: string[];
    images: string[];
    createdByUser: { id: string; username: string; name: string; avatar: string };
    createdAt: number;
    isVerified: boolean;
    clipCount: number;
    clips: any[];
}

interface LeaderboardEntry {
    rank: number;
    user: { id: string; username: string; name: string; avatar: string; tier: string };
    totalLikes: number;
    clipCount: number;
}

export default function SpotDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const [spot, setSpot] = useState<SpotDetail | null>(null);
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<"clips" | "info">("clips");

    useEffect(() => {
        Promise.all([
            fetch(`/api/spots/${id}`).then((r) => r.json()),
            fetch(`/api/leaderboard/spots/${id}`).then((r) => r.json()).catch(() => ({ leaderboard: [] })),
        ]).then(([spotData, lbData]) => {
            setSpot(spotData);
            setLeaderboard(lbData.leaderboard || []);
            setLoading(false);
        });
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="animate-spin text-neutral-500" size={32} />
            </div>
        );
    }

    if (!spot) {
        return (
            <div className="flex items-center justify-center min-h-[50vh] text-neutral-500">
                Spot not found
            </div>
        );
    }

    const difficultyColor =
        spot.difficulty === "Pro" || spot.difficulty === "Legendary"
            ? "text-red-500 border-red-500/50"
            : spot.difficulty === "Intermediate"
            ? "text-yellow-500 border-yellow-500/50"
            : "text-green-500 border-green-500/50";

    return (
        <div className="pb-20">
            {/* Hero Images */}
            <div className="relative h-64 md:h-80 bg-neutral-800">
                {spot.images.length > 0 ? (
                    <Image
                        src={spot.images[0]}
                        alt={spot.name}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-900">
                        <MapPin size={48} className="text-neutral-600" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            </div>

            <div className="max-w-4xl mx-auto px-4 -mt-20 relative z-10">
                {/* Spot Header */}
                <div className="mb-6">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">{spot.name}</h1>
                            <div className="flex items-center gap-3 flex-wrap">
                                <span className={`text-xs px-2 py-1 rounded border font-medium ${difficultyColor}`}>
                                    {spot.difficulty}
                                </span>
                                <span className="text-xs px-2 py-1 rounded border border-white/20 text-neutral-300">
                                    {spot.type}
                                </span>
                                <div className="flex items-center gap-1">
                                    <StarRating value={spot.rating} readonly size={14} />
                                    <span className="text-xs text-neutral-400 ml-1">({spot.ratingCount})</span>
                                </div>
                                <span className="text-xs text-neutral-400">
                                    {spot.clipCount} clips
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsUploadOpen(true)}
                            className="px-4 py-2 bg-accent hover:bg-accent-dark text-white text-sm font-medium rounded-lg transition-colors shrink-0 flex items-center gap-2"
                        >
                            <Video size={16} />
                            Upload Clip
                        </button>
                    </div>

                    <p className="text-neutral-300 mt-4 leading-relaxed">{spot.description}</p>

                    {spot.features.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                            {spot.features.map((f: string) => (
                                <span key={f} className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-neutral-300">
                                    {f}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="flex items-center gap-2 mt-4 text-sm text-neutral-400">
                        <span>Added by</span>
                        <Link href={`/user/${spot.createdByUser.id}`} className="text-white hover:text-secondary flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full overflow-hidden relative bg-neutral-800">
                                <Image src={spot.createdByUser.avatar} alt="" fill className="object-cover" />
                            </div>
                            @{spot.createdByUser.username}
                        </Link>
                        <span> {formatDistanceToNow(spot.createdAt, { addSuffix: true })}</span>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="md:col-span-2">
                        {/* Tabs */}
                        <div className="flex border-b border-white/10 mb-4">
                            <button
                                onClick={() => setActiveTab("clips")}
                                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                                    activeTab === "clips"
                                        ? "border-secondary text-secondary"
                                        : "border-transparent text-neutral-500 hover:text-white"
                                }`}
                            >
                                Clips ({spot.clips.length})
                            </button>
                            <button
                                onClick={() => setActiveTab("info")}
                                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                                    activeTab === "info"
                                        ? "border-secondary text-secondary"
                                        : "border-transparent text-neutral-500 hover:text-white"
                                }`}
                            >
                                Info
                            </button>
                        </div>

                        {activeTab === "clips" && (
                            <div className="space-y-4">
                                {spot.clips.length === 0 ? (
                                    <div className="text-center py-12 text-neutral-500">
                                        <Video size={32} className="mx-auto mb-2 opacity-50" />
                                        <p>No clips yet. Be the first to upload!</p>
                                    </div>
                                ) : (
                                    spot.clips.map((clip: any) => (
                                        <div key={clip.id} className="bg-neutral-900 border border-white/5 rounded-xl overflow-hidden">
                                            <div className="aspect-video bg-neutral-950 relative">
                                                {clip.thumbnail && (
                                                    <Image src={clip.thumbnail} alt={clip.description} fill className="object-cover" />
                                                )}
                                            </div>
                                            <div className="p-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Link href={`/user/${clip.userId}`} className="flex items-center gap-2 hover:underline">
                                                        <div className="w-6 h-6 rounded-full overflow-hidden relative bg-neutral-800">
                                                            {clip.user?.avatar && <Image src={clip.user.avatar} alt="" fill className="object-cover" />}
                                                        </div>
                                                        <span className="text-sm font-medium text-white">{clip.user?.username}</span>
                                                    </Link>
                                                    {clip.trickName && (
                                                        <span className="text-xs px-2 py-0.5 bg-accent/20 text-accent rounded-full">{clip.trickName}</span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-neutral-300">{clip.description}</p>
                                                <div className="flex items-center gap-4 mt-2 text-xs text-neutral-500">
                                                    <span>{clip.likeCount} likes</span>
                                                    <span>{clip.commentCount} comments</span>
                                                    <span>{clip.views} views</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {activeTab === "info" && (
                            <div className="space-y-4">
                                <div className="bg-neutral-900 border border-white/5 rounded-xl p-4">
                                    <h3 className="font-bold text-white mb-2">Location</h3>
                                    <p className="text-sm text-neutral-400">
                                        {spot.location[0].toFixed(4)}, {spot.location[1].toFixed(4)}
                                    </p>
                                </div>
                                {spot.images.length > 1 && (
                                    <div className="bg-neutral-900 border border-white/5 rounded-xl p-4">
                                        <h3 className="font-bold text-white mb-2">Photos</h3>
                                        <div className="grid grid-cols-3 gap-2">
                                            {spot.images.map((img: string, i: number) => (
                                                <div key={i} className="aspect-square rounded-lg overflow-hidden relative">
                                                    <Image src={img} alt="" fill className="object-cover" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Weather */}
                        <WeatherWidget lat={spot.location[0]} lng={spot.location[1]} />

                        <div className="bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden sticky top-20">
                            <div className="p-4 border-b border-white/5 bg-gradient-to-r from-yellow-500/10 to-transparent">
                                <h3 className="font-bold text-white flex items-center gap-2">
                                    <Crown className="text-yellow-500" size={18} />
                                    King of the Spot
                                </h3>
                            </div>
                            <div className="divide-y divide-white/5">
                                {leaderboard.length === 0 ? (
                                    <div className="p-4 text-center text-neutral-500 text-sm">
                                        No clips yet - be the first!
                                    </div>
                                ) : (
                                    leaderboard.slice(0, 5).map((entry) => (
                                        <Link
                                            key={entry.user.id}
                                            href={`/user/${entry.user.id}`}
                                            className="p-3 flex items-center gap-3 hover:bg-white/5 transition-colors"
                                        >
                                            <div className="w-6 flex justify-center">
                                                {entry.rank === 1 ? <Trophy className="text-yellow-500" size={16} /> :
                                                    entry.rank === 2 ? <Medal className="text-gray-400" size={16} /> :
                                                        entry.rank === 3 ? <Medal className="text-amber-700" size={16} /> :
                                                            <span className="text-xs text-neutral-500">#{entry.rank}</span>}
                                            </div>
                                            <div className="w-8 h-8 rounded-full overflow-hidden relative bg-neutral-800 shrink-0">
                                                <Image src={entry.user.avatar} alt="" fill className="object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-white truncate">{entry.user.name}</p>
                                                <p className="text-xs text-neutral-500">{entry.clipCount} clips</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-bold text-secondary">{entry.totalLikes}</div>
                                                <div className="text-[10px] text-neutral-500">likes</div>
                                            </div>
                                        </Link>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <UploadClipModal
                isOpen={isUploadOpen}
                onClose={() => setIsUploadOpen(false)}
                preSelectedSpotId={id}
            />
        </div>
    );
}
