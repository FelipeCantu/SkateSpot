"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { X, Search, Loader2, MapPin, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { searchPlace } from "@/utils/geocoding";

const SpotMap = dynamic(() => import("@/components/Map"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-neutral-900 text-gray-500">
            Loading Map...
        </div>
    ),
});

interface MapPickerOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (location: [number, number]) => void;
}

export function MapPickerOverlay({ isOpen, onClose, onConfirm }: MapPickerOverlayProps) {
    const [pinnedLocation, setPinnedLocation] = useState<[number, number] | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);

    const handleMapClick = (latlng: [number, number]) => {
        setPinnedLocation(latlng);
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        setIsSearching(true);
        try {
            const results = await searchPlace(searchQuery);
            if (results.length > 0) {
                setMapCenter([parseFloat(results[0].lat), parseFloat(results[0].lon)]);
            }
        } catch (error) {
            console.error("Search failed", error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleConfirm = () => {
        if (pinnedLocation) {
            onConfirm(pinnedLocation);
            setPinnedLocation(null);
            setSearchQuery("");
            setMapCenter(null);
        }
    };

    const handleClose = () => {
        setPinnedLocation(null);
        setSearchQuery("");
        setMapCenter(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9998] bg-background flex flex-col"
            >
                {/* Top bar */}
                <div className="flex items-center gap-3 p-4 border-b border-white/10 bg-neutral-900/80 backdrop-blur-sm">
                    <button
                        onClick={handleClose}
                        className="p-2 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>

                    <form onSubmit={handleSearch} className="relative flex-1">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search city or place..."
                            className="w-full bg-neutral-800 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50 placeholder:text-neutral-500"
                        />
                        <div className="absolute left-3 top-2.5 text-neutral-400">
                            {isSearching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                        </div>
                    </form>
                </div>

                {/* Instruction text */}
                <div className="absolute top-[72px] left-0 right-0 z-10 flex justify-center pointer-events-none">
                    <div className="bg-black/70 backdrop-blur-sm px-4 py-2 rounded-full mt-3 flex items-center gap-2">
                        <MapPin size={14} className="text-secondary" />
                        <span className="text-xs text-neutral-300">
                            {pinnedLocation ? "Pin placed! Confirm or tap to move." : "Tap the map to drop a pin"}
                        </span>
                    </div>
                </div>

                {/* Map */}
                <div className="flex-1 relative">
                    <SpotMap
                        onMapClick={handleMapClick}
                        spots={
                            pinnedLocation
                                ? [{ id: "pin", name: "New Spot", position: pinnedLocation, description: "" }]
                                : []
                        }
                        mapCenter={mapCenter}
                    />
                </div>

                {/* Confirm button */}
                {pinnedLocation && (
                    <motion.div
                        initial={{ y: 80 }}
                        animate={{ y: 0 }}
                        className="p-4 border-t border-white/10 bg-neutral-900/90 backdrop-blur-sm"
                    >
                        <div className="text-xs text-neutral-400 text-center mb-2">
                            {pinnedLocation[0].toFixed(5)}, {pinnedLocation[1].toFixed(5)}
                        </div>
                        <button
                            onClick={handleConfirm}
                            className="w-full py-3 bg-secondary hover:bg-secondary-dark text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-secondary/20"
                        >
                            <Check size={18} />
                            Confirm Location
                        </button>
                    </motion.div>
                )}
            </motion.div>
        </AnimatePresence>
    );
}
