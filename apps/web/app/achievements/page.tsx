"use client";

import { useState, useEffect } from "react";
import { Award, Lock } from "lucide-react";
import { useSession } from "next-auth/react";
import { ACHIEVEMENT_DEFINITIONS } from "@skatespot/shared";

export default function AchievementsPage() {
  const { data: session } = useSession();
  const [unlockedKeys, setUnlockedKeys] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    if (!session?.user) {
      setIsLoading(false);
      return;
    }
    fetch("/api/achievements")
      .then((r) => r.json())
      .then((data) => {
        const items = data.data ?? data;
        setUnlockedKeys(new Set(items.map((a: any) => a.badgeKey)));
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [session]);

  const categories = ["all", "milestone", "activity", "skill", "social", "special"];
  const filtered =
    selectedCategory === "all"
      ? ACHIEVEMENT_DEFINITIONS
      : ACHIEVEMENT_DEFINITIONS.filter((d) => d.category === selectedCategory);

  const unlockedCount = unlockedKeys.size;
  const totalCount = ACHIEVEMENT_DEFINITIONS.length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Award size={28} className="text-purple-400" />
          Achievements
        </h1>
        <div className="text-sm text-neutral-400">
          <span className="text-white font-bold">{unlockedCount}</span> / {totalCount} unlocked
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-neutral-800 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
          style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
        />
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? "bg-purple-500 text-white"
                : "bg-neutral-800 text-neutral-400 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-32 bg-neutral-900 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map((badge) => {
            const isUnlocked = unlockedKeys.has(badge.key);
            const isSecret = badge.secret && !isUnlocked;
            return (
              <div
                key={badge.key}
                className={`p-4 rounded-xl border text-center ${
                  isUnlocked
                    ? "bg-purple-500/10 border-purple-500/30"
                    : "bg-neutral-900 border-white/10 opacity-60"
                }`}
              >
                <div className="flex justify-center mb-2">
                  {isSecret ? (
                    <Lock size={28} className="text-neutral-600" />
                  ) : isUnlocked ? (
                    <Award size={28} className="text-purple-400" />
                  ) : (
                    <Award size={28} className="text-neutral-600" />
                  )}
                </div>
                <h3 className={`text-sm font-bold mb-1 ${isUnlocked ? "text-white" : "text-neutral-400"}`}>
                  {isSecret ? "???" : badge.name}
                </h3>
                <p className="text-xs text-neutral-500">
                  {isSecret ? "Secret achievement" : badge.description}
                </p>
                <p className="text-[10px] text-neutral-600 mt-2 capitalize">
                  {badge.category}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
