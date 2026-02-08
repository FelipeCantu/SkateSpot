"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, Film, MapPin } from "lucide-react";
import { Spot } from "@/types/models";

const DIFFICULTY_COLORS: Record<string, string> = {
    Beginner: "bg-green-500/20 text-green-400 border-green-500/30",
    Intermediate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    Pro: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    Legendary: "bg-red-500/20 text-red-400 border-red-500/30",
};

interface SpotCardProps {
    spot: Spot & { clipCount?: number };
    distance?: string | null;
}

export function SpotCard({ spot, distance }: SpotCardProps) {
    const heroImage = spot.images?.[0];
    const difficultyClass = DIFFICULTY_COLORS[spot.difficulty] ?? DIFFICULTY_COLORS.Beginner;
    const displayFeatures = spot.features?.slice(0, 3) ?? [];

    return (
        <Link href={`/spot/${spot.id}`} className="block group">
            <div className="bg-neutral-900 border border-white/5 rounded-xl overflow-hidden shadow-lg hover:border-white/10 transition-colors">
                {/* Hero Image */}
                <div className="aspect-[16/10] bg-neutral-950 relative overflow-hidden">
                    {heroImage ? (
                        <Image
                            src={heroImage}
                            alt={spot.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary-dark to-accent-dark flex items-center justify-center">
                            <MapPin className="text-white/20" size={40} />
                        </div>
                    )}

                    {/* Badges overlay */}
                    <div className="absolute top-2 left-2 flex gap-1.5">
                        <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-primary-light/80 text-white backdrop-blur-sm">
                            {spot.type}
                        </span>
                        <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border backdrop-blur-sm ${difficultyClass}`}>
                            {spot.difficulty}
                        </span>
                    </div>
                </div>

                {/* Info */}
                <div className="p-3 space-y-2">
                    <h3 className="font-semibold text-white text-sm truncate group-hover:text-secondary transition-colors">
                        {spot.name}
                    </h3>

                    {/* Rating + clips + distance */}
                    <div className="flex items-center gap-3 text-xs text-neutral-400">
                        {spot.rating > 0 && (
                            <span className="flex items-center gap-1">
                                <Star size={12} className="text-yellow-400 fill-yellow-400" />
                                {spot.rating.toFixed(1)}
                            </span>
                        )}
                        <span className="flex items-center gap-1">
                            <Film size={12} />
                            {(spot as any).clipCount ?? 0} clips
                        </span>
                        {distance && (
                            <span className="flex items-center gap-1 ml-auto text-accent-light">
                                <MapPin size={12} />
                                {distance}
                            </span>
                        )}
                    </div>

                    {/* Feature pills */}
                    {displayFeatures.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {displayFeatures.map((feat) => (
                                <span
                                    key={feat}
                                    className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-white/5 text-neutral-400 border border-white/5"
                                >
                                    {feat}
                                </span>
                            ))}
                            {spot.features.length > 3 && (
                                <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-white/5 text-neutral-500">
                                    +{spot.features.length - 3}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}
