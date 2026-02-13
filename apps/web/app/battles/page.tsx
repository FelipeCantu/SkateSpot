"use client";

import { useState, useEffect } from "react";
import { Swords } from "lucide-react";
import { BattleCard } from "@/components/BattleCard";
import { EmptyState } from "@/components/EmptyState";
import { CardSkeleton } from "@/components/LoadingSkeleton";

export default function BattlesPage() {
  const [battles, setBattles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tab, setTab] = useState<"active" | "completed">("active");

  useEffect(() => {
    fetchBattles(tab);
  }, [tab]);

  async function fetchBattles(status: string) {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/battles?status=${status}`);
      if (res.ok) setBattles(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Swords size={28} className="text-orange-400" />
          Battles
        </h1>
      </div>

      <div className="flex gap-2 mb-6">
        {(["active", "completed"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
              tab === t
                ? "bg-orange-500 text-white"
                : "bg-neutral-800 text-neutral-400 hover:text-white"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : battles.length === 0 ? (
        <EmptyState
          icon={<Swords size={48} />}
          title={tab === "active" ? "No Active Battles" : "No Completed Battles"}
          description={
            tab === "active"
              ? "Battles auto-trigger when clips at a spot reach 10 likes."
              : "Completed battles will appear here."
          }
        />
      ) : (
        <div className="space-y-4">
          {battles.map((battle) => (
            <BattleCard key={battle.id} battle={battle} />
          ))}
        </div>
      )}
    </div>
  );
}
