"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Spot } from "@/types/models";

export type { Spot };

interface SpotContextType {
    spots: Spot[];
    isLoading: boolean;
    addSpot: (spot: Omit<Spot, "id" | "createdAt" | "createdBy" | "isVerified"> & { images?: string[] }) => void;
    deleteSpot: (id: string) => void;
    rateSpot: (spotId: string, value: number) => void;
    getSpot: (id: string) => Spot | undefined;
    refreshSpots: () => void;
}

const SpotContext = createContext<SpotContextType | undefined>(undefined);

export function SpotProvider({ children }: { children: React.ReactNode }) {
    const [spots, setSpots] = useState<Spot[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchSpots = useCallback(async () => {
        try {
            const res = await fetch("/api/spots?limit=50");
            if (res.ok) {
                const json = await res.json();
                setSpots(json.data ?? json);
            }
        } catch (error) {
            console.error("Failed to fetch spots", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSpots();
    }, [fetchSpots]);

    const addSpot = useCallback(async (spotData: Omit<Spot, "id" | "createdAt" | "createdBy" | "isVerified"> & { images?: string[] }) => {
        try {
            const res = await fetch("/api/spots", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(spotData),
            });
            if (res.ok) {
                const newSpot = await res.json();
                setSpots((prev) => [newSpot, ...prev]);
            }
        } catch (error) {
            console.error("Failed to create spot", error);
        }
    }, []);

    const deleteSpot = useCallback(async (id: string) => {
        try {
            const res = await fetch(`/api/spots/${id}`, { method: "DELETE" });
            if (res.ok) {
                setSpots((prev) => prev.filter((s) => s.id !== id));
            }
        } catch (error) {
            console.error("Failed to delete spot", error);
        }
    }, []);

    const rateSpot = useCallback(async (spotId: string, value: number) => {
        try {
            const res = await fetch(`/api/spots/${spotId}/rate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ value }),
            });
            if (res.ok) {
                const { rating } = await res.json();
                setSpots((prev) =>
                    prev.map((s) => (s.id === spotId ? { ...s, rating } : s))
                );
            }
        } catch (error) {
            console.error("Failed to rate spot", error);
        }
    }, []);

    const getSpot = useCallback(
        (id: string) => spots.find((s) => s.id === id),
        [spots]
    );

    return (
        <SpotContext.Provider value={{ spots, isLoading, addSpot, deleteSpot, rateSpot, getSpot, refreshSpots: fetchSpots }}>
            {children}
        </SpotContext.Provider>
    );
}

export function useSpots() {
    const context = useContext(SpotContext);
    if (context === undefined) {
        throw new Error("useSpots must be used within a SpotProvider");
    }
    return context;
}
