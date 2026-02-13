"use client";

import { useState, useMemo } from "react";
import { useSpots } from "@/context/SpotContext";
import { useGeolocation } from "@/utils/useGeolocation";
import { haversineDistance, formatDistance } from "@/utils/distance";
import { SpotCard } from "@/components/SpotCard";
import { SpotCardSkeleton } from "@/components/SpotCardSkeleton";
import { MapPickerOverlay } from "@/components/MapPickerOverlay";
import { AddSpotModal } from "@/components/AddSpotModal";
import { Plus, MapPin, SlidersHorizontal } from "lucide-react";

const TYPES = ["Street", "Park", "DIY", "Transition"] as const;
const DIFFICULTIES = ["Beginner", "Intermediate", "Pro", "Legendary"] as const;

export default function SpotsPage() {
    const { spots, isLoading } = useSpots();
    const geo = useGeolocation();

    const [typeFilter, setTypeFilter] = useState<string | null>(null);
    const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);
    const [showFilters, setShowFilters] = useState(false);

    // Add spot flow
    const [isMapPickerOpen, setIsMapPickerOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);

    const handleLocationConfirm = (location: [number, number]) => {
        setSelectedLocation(location);
        setIsMapPickerOpen(false);
        setIsModalOpen(true);
    };

    // Filter + sort spots
    const sortedSpots = useMemo(() => {
        let filtered = spots;

        if (typeFilter) {
            filtered = filtered.filter((s) => s.type === typeFilter);
        }
        if (difficultyFilter) {
            filtered = filtered.filter((s) => s.difficulty === difficultyFilter);
        }

        if (geo.position) {
            return [...filtered].sort((a, b) => {
                const distA = haversineDistance(geo.position!, a.location);
                const distB = haversineDistance(geo.position!, b.location);
                return distA - distB;
            });
        }

        // Fallback: sort by recency
        return [...filtered].sort((a, b) => b.createdAt - a.createdAt);
    }, [spots, typeFilter, difficultyFilter, geo.position]);

    const getDistance = (location: [number, number]): string | null => {
        if (!geo.position) return null;
        const km = haversineDistance(geo.position, location);
        return formatDistance(km);
    };

    const isPageLoading = isLoading || geo.loading;
    const hasGeo = !!geo.position;

    return (
        <div className="min-h-screen bg-background pt-20 pb-12">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-light to-accent-light">
                            {hasGeo ? "Spots Near You" : "All Spots"}
                        </h1>
                        {!hasGeo && !geo.loading && (
                            <p className="text-xs text-neutral-500 mt-1 flex items-center gap-1">
                                <MapPin size={12} />
                                Enable location for distance sorting
                            </p>
                        )}
                    </div>

                    <button
                        onClick={() => setIsMapPickerOpen(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-secondary hover:bg-secondary-dark text-white text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-secondary/20"
                    >
                        <Plus size={16} />
                        <span className="hidden sm:inline">Add Spot</span>
                    </button>
                </div>

                {/* Filter pills */}
                <div className="mb-6 space-y-3">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors md:hidden"
                    >
                        <SlidersHorizontal size={14} />
                        Filters
                        {(typeFilter || difficultyFilter) && (
                            <span className="w-2 h-2 rounded-full bg-secondary" />
                        )}
                    </button>

                    <div className={`space-y-2 ${showFilters ? "block" : "hidden md:block"}`}>
                        {/* Type filters */}
                        <div className="flex flex-wrap gap-2">
                            <span className="text-xs text-neutral-500 self-center mr-1">Type:</span>
                            {TYPES.map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setTypeFilter(typeFilter === t ? null : t)}
                                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                                        typeFilter === t
                                            ? "bg-secondary/20 border-secondary/50 text-secondary"
                                            : "bg-neutral-800 border-white/10 text-neutral-400 hover:text-white hover:border-white/20"
                                    }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>

                        {/* Difficulty filters */}
                        <div className="flex flex-wrap gap-2">
                            <span className="text-xs text-neutral-500 self-center mr-1">Difficulty:</span>
                            {DIFFICULTIES.map((d) => (
                                <button
                                    key={d}
                                    onClick={() => setDifficultyFilter(difficultyFilter === d ? null : d)}
                                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                                        difficultyFilter === d
                                            ? "bg-secondary/20 border-secondary/50 text-secondary"
                                            : "bg-neutral-800 border-white/10 text-neutral-400 hover:text-white hover:border-white/20"
                                    }`}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Grid */}
                {isPageLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <SpotCardSkeleton key={i} />
                        ))}
                    </div>
                ) : sortedSpots.length === 0 ? (
                    <div className="text-center py-20">
                        <MapPin className="mx-auto mb-4 text-neutral-600" size={48} />
                        <h2 className="text-lg font-semibold text-neutral-300 mb-2">
                            {typeFilter || difficultyFilter ? "No spots match your filters" : "No spots yet"}
                        </h2>
                        <p className="text-sm text-neutral-500 mb-6">
                            {typeFilter || difficultyFilter
                                ? "Try removing some filters or add a new spot."
                                : "Be the first to add a spot!"}
                        </p>
                        {(typeFilter || difficultyFilter) && (
                            <button
                                onClick={() => { setTypeFilter(null); setDifficultyFilter(null); }}
                                className="text-sm text-secondary hover:text-secondary-light transition-colors"
                            >
                                Clear all filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {sortedSpots.map((spot) => (
                            <SpotCard
                                key={spot.id}
                                spot={spot}
                                distance={getDistance(spot.location)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Map Picker Overlay */}
            <MapPickerOverlay
                isOpen={isMapPickerOpen}
                onClose={() => setIsMapPickerOpen(false)}
                onConfirm={handleLocationConfirm}
            />

            {/* Add Spot Modal */}
            <AddSpotModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                location={selectedLocation}
            />
        </div>
    );
}
