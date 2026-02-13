"use client";

import { useState, useEffect } from "react";
import { Zap, Check, Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import { TRICKS, TRICK_CATEGORIES } from "@skatespot/shared";

export default function TricksPage() {
  const { data: session } = useSession();
  const [landedTricks, setLandedTricks] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState("flatground");
  const [isLoading, setIsLoading] = useState(true);
  const [landing, setLanding] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user) return;
    fetch("/api/tricks")
      .then((r) => r.json())
      .then((data) => {
        const items = data.data ?? data;
        setLandedTricks(new Set(items.map((t: any) => t.trickName)));
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [session]);

  async function handleLand(trickName: string, category: string) {
    if (landing || landedTricks.has(trickName)) return;
    setLanding(trickName);
    try {
      const res = await fetch("/api/tricks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trickName, category }),
      });
      if (res.ok) {
        setLandedTricks((prev) => new Set([...prev, trickName]));
      }
    } finally {
      setLanding(null);
    }
  }

  const categories = Object.entries(TRICK_CATEGORIES);
  const currentTricks = TRICKS[selectedCategory] || [];
  const totalLanded = landedTricks.size;
  const totalTricks = Object.values(TRICKS).flat().length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Zap size={28} className="text-yellow-400" />
          Trick Tracker
        </h1>
        <div className="text-sm text-neutral-400">
          <span className="text-white font-bold">{totalLanded}</span> / {totalTricks} tricks landed
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-neutral-800 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-500"
          style={{ width: `${(totalLanded / totalTricks) * 100}%` }}
        />
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map(([key, label]) => {
          const catTricks = TRICKS[key] || [];
          const catLanded = catTricks.filter((t) => landedTricks.has(t)).length;
          return (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === key
                  ? "bg-yellow-500 text-black"
                  : "bg-neutral-800 text-neutral-400 hover:text-white"
              }`}
            >
              {label} ({catLanded}/{catTricks.length})
            </button>
          );
        })}
      </div>

      {/* Tricks grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-16 bg-neutral-900 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {currentTricks.map((trick) => {
            const isLanded = landedTricks.has(trick);
            const isLandingThis = landing === trick;
            return (
              <button
                key={trick}
                onClick={() => !isLanded && handleLand(trick, selectedCategory)}
                disabled={isLanded || !!landing}
                className={`p-4 rounded-xl border text-left transition-all ${
                  isLanded
                    ? "bg-green-500/10 border-green-500/30 cursor-default"
                    : "bg-neutral-900 border-white/10 hover:border-yellow-500/30 hover:bg-yellow-500/5"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${isLanded ? "text-green-400" : "text-white"}`}>
                    {trick}
                  </span>
                  {isLanded ? (
                    <Check size={16} className="text-green-400" />
                  ) : isLandingThis ? (
                    <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Plus size={16} className="text-neutral-500" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
