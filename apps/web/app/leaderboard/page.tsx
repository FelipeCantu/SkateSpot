"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { Crown, Trophy, Medal, MapPin, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface LeaderboardUser {
    id: string;
    username: string;
    name: string;
    avatar: string;
    points: number;
    tier: string;
    clipCount: number;
    followerCount: number;
}

interface LeaderboardSpot {
    id: string;
    name: string;
    difficulty: string;
    type: string;
    rating: number;
    clipCount: number;
}

export default function LeaderboardPage() {
    const { currentUser } = useUser();
    const [users, setUsers] = useState<LeaderboardUser[]>([]);
    const [spots, setSpots] = useState<LeaderboardSpot[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/leaderboard")
            .then((r) => r.json())
            .then((data) => {
                setUsers(data.users || []);
                setSpots(data.spots || []);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="animate-spin text-neutral-500" size={32} />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
            <h1 className="text-3xl font-bold mb-8 text-white">Leaderboards</h1>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Skater Rankings */}
                <div className="bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-white/5 bg-gradient-to-r from-secondary/10 to-transparent">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Trophy className="text-yellow-500" />
                            Top Skaters
                        </h2>
                    </div>
                    <div className="divide-y divide-white/5">
                        {users.map((user, index) => (
                            <Link
                                key={user.id}
                                href={`/user/${user.id}`}
                                className={`p-4 flex items-center gap-4 hover:bg-white/5 transition-colors ${user.id === currentUser?.id ? 'bg-secondary/10' : ''}`}
                            >
                                <div className="w-8 flex justify-center font-bold text-neutral-500">
                                    {index === 0 ? <Crown className="text-yellow-500" size={24} /> :
                                        index === 1 ? <Medal className="text-gray-400" size={24} /> :
                                            index === 2 ? <Medal className="text-amber-700" size={24} /> :
                                                `#${index + 1}`}
                                </div>
                                <div className="w-10 h-10 rounded-full bg-neutral-800 overflow-hidden relative border border-white/10">
                                    <Image
                                        src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                                        alt={user.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-white text-sm">{user.name}</h3>
                                    <p className="text-xs text-neutral-400">@{user.username} &middot; {user.clipCount} clips</p>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-secondary">{user.points}</div>
                                    <div className="text-xs text-neutral-500 uppercase">PTS</div>
                                </div>
                            </Link>
                        ))}
                        {users.length === 0 && (
                            <div className="p-8 text-center text-neutral-500">No skaters yet</div>
                        )}
                    </div>
                </div>

                {/* Spot Rankings */}
                <div className="bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-white/5 bg-gradient-to-r from-accent/10 to-transparent">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <MapPin className="text-accent" />
                            Top Spots
                        </h2>
                    </div>
                    <div className="divide-y divide-white/5">
                        {spots.map((spot, index) => (
                            <Link
                                key={spot.id}
                                href={`/spot/${spot.id}`}
                                className="p-4 flex items-center gap-4 hover:bg-white/5 transition-colors"
                            >
                                <div className="w-8 flex justify-center font-bold text-neutral-500">
                                    #{index + 1}
                                </div>
                                <div className="w-12 h-12 rounded-lg bg-neutral-800 overflow-hidden relative border border-white/10 shrink-0 flex items-center justify-center">
                                    <MapPin size={20} className="text-neutral-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-white text-sm">{spot.name}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                                            spot.difficulty === 'Pro' || spot.difficulty === 'Legendary' ? 'border-red-500/50 text-red-500' :
                                            spot.difficulty === 'Intermediate' ? 'border-yellow-500/50 text-yellow-500' :
                                            'border-green-500/50 text-green-500'
                                        }`}>
                                            {spot.difficulty}
                                        </span>
                                        <span className="text-xs text-neutral-500">{spot.type}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-white">
                                        {spot.rating > 0 ? spot.rating.toFixed(1) : '---'} <span className="text-yellow-500">&#9733;</span>
                                    </div>
                                    <div className="text-xs text-neutral-500">{spot.clipCount} clips</div>
                                </div>
                            </Link>
                        ))}
                        {spots.length === 0 && (
                            <div className="p-8 text-center text-neutral-500">No spots yet</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
