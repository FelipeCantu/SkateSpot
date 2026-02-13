"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

interface BattleData {
  id: string;
  spotId: string;
  clip1Id: string;
  clip2Id: string;
  clip1Votes: number;
  clip2Votes: number;
  status: string;
  winnerId?: string;
  expiresAt: string;
  createdAt: string;
  spot: { id: string; name: string };
  clip1: any;
  clip2: any;
}

interface BattleContextType {
  battles: BattleData[];
  isLoading: boolean;
  fetchBattles: (status?: string) => void;
  voteBattle: (battleId: string, clipId: string) => Promise<boolean>;
  resolveBattle: (battleId: string) => Promise<boolean>;
}

const BattleContext = createContext<BattleContextType | undefined>(undefined);

export function BattleProvider({ children }: { children: React.ReactNode }) {
  const [battles, setBattles] = useState<BattleData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBattles = useCallback(async (status = "active") => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/battles?status=${status}`);
      if (res.ok) {
        const data = await res.json();
        setBattles(data);
      }
    } catch (err) {
      console.error("Failed to fetch battles", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBattles();
  }, [fetchBattles]);

  const voteBattle = useCallback(async (battleId: string, clipId: string) => {
    try {
      const res = await fetch(`/api/battles/${battleId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clipId }),
      });
      if (res.ok) {
        await fetchBattles();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [fetchBattles]);

  const resolveBattleFn = useCallback(async (battleId: string) => {
    try {
      const res = await fetch(`/api/battles/${battleId}/resolve`, {
        method: "POST",
      });
      if (res.ok) {
        await fetchBattles();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [fetchBattles]);

  return (
    <BattleContext.Provider value={{
      battles,
      isLoading,
      fetchBattles,
      voteBattle,
      resolveBattle: resolveBattleFn,
    }}>
      {children}
    </BattleContext.Provider>
  );
}

export function useBattles() {
  const context = useContext(BattleContext);
  if (context === undefined) {
    throw new Error("useBattles must be used within a BattleProvider");
  }
  return context;
}
