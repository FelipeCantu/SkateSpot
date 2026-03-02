"use client";

import Image from "next/image";
import { Swords, Clock, Trophy } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const statusColors: Record<string, string> = {
  active: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  voting: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  completed: "bg-neutral-500/20 text-neutral-400 border-neutral-500/30",
};

export function CrewBattleCard({ battle, onClick }: { battle: any; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className="bg-neutral-900 border border-white/5 rounded-xl overflow-hidden hover:border-purple-500/20 transition-colors cursor-pointer"
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className={`text-[10px] px-2 py-0.5 rounded-full border ${statusColors[battle.status] || statusColors.active}`}>
            {battle.status}
          </span>
          {battle.endDate && battle.status !== "completed" && (
            <span className="flex items-center gap-1 text-[10px] text-neutral-500">
              <Clock size={10} />
              {formatDistanceToNow(new Date(battle.endDate), { addSuffix: true })}
            </span>
          )}
        </div>

        {/* VS Display */}
        <div className="flex items-center justify-between gap-3 mb-3">
          {/* Crew 1 */}
          <div className="flex-1 text-center">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-lg mx-auto mb-1 overflow-hidden relative">
              {battle.crew1?.avatar ? (
                <Image src={battle.crew1.avatar} alt={battle.crew1.name} fill className="object-cover" />
              ) : (
                battle.crew1?.name?.[0]?.toUpperCase()
              )}
            </div>
            <p className="text-xs font-medium text-white truncate">{battle.crew1?.name}</p>
            {battle.crew1VoteCount !== undefined && (
              <p className="text-xs text-purple-400 font-bold">{battle.crew1VoteCount} votes</p>
            )}
          </div>

          {/* VS */}
          <div className="shrink-0">
            <Swords size={20} className="text-orange-400" />
          </div>

          {/* Crew 2 */}
          <div className="flex-1 text-center">
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold text-lg mx-auto mb-1 overflow-hidden relative">
              {battle.crew2?.avatar ? (
                <Image src={battle.crew2.avatar} alt={battle.crew2.name} fill className="object-cover" />
              ) : (
                battle.crew2?.name?.[0]?.toUpperCase()
              )}
            </div>
            <p className="text-xs font-medium text-white truncate">{battle.crew2?.name}</p>
            {battle.crew2VoteCount !== undefined && (
              <p className="text-xs text-orange-400 font-bold">{battle.crew2VoteCount} votes</p>
            )}
          </div>
        </div>

        {/* Theme */}
        <div className="text-center">
          <span className="text-xs text-neutral-400">Theme: </span>
          <span className="text-xs font-medium text-white">{battle.theme}</span>
        </div>

        {/* Winner */}
        {battle.winner && (
          <div className="flex items-center justify-center gap-1.5 mt-2 pt-2 border-t border-white/10 text-xs text-yellow-400">
            <Trophy size={12} />
            Winner: {battle.winner.name}
          </div>
        )}
      </div>
    </div>
  );
}
