"use client";

import Link from "next/link";
import Image from "next/image";
import { Swords, Clock, Trophy } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface BattleCardProps {
  battle: {
    id: string;
    clip1Votes: number;
    clip2Votes: number;
    status: string;
    winnerId?: string;
    expiresAt: string;
    spot: { id: string; name: string };
    clip1: {
      id: string;
      thumbnail: string;
      trickName: string;
      user: { id: string; username: string; name: string; avatar: string };
    };
    clip2: {
      id: string;
      thumbnail: string;
      trickName: string;
      user: { id: string; username: string; name: string; avatar: string };
    };
  };
}

export function BattleCard({ battle }: BattleCardProps) {
  const totalVotes = battle.clip1Votes + battle.clip2Votes;
  const clip1Pct = totalVotes > 0 ? Math.round((battle.clip1Votes / totalVotes) * 100) : 50;
  const clip2Pct = 100 - clip1Pct;
  const isActive = battle.status === "active";
  const timeLeft = isActive
    ? formatDistanceToNow(new Date(battle.expiresAt), { addSuffix: false })
    : null;

  return (
    <Link
      href={`/battles/${battle.id}`}
      className="block bg-neutral-900 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all"
    >
      <div className="p-3 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2">
          <Swords size={16} className="text-orange-400" />
          <span className="text-sm text-neutral-400">{battle.spot.name}</span>
        </div>
        {isActive && timeLeft && (
          <div className="flex items-center gap-1 text-xs text-neutral-500">
            <Clock size={12} />
            <span>{timeLeft} left</span>
          </div>
        )}
        {!isActive && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">
            Completed
          </span>
        )}
      </div>

      <div className="flex">
        {/* Clip 1 */}
        <div className={`flex-1 p-3 ${battle.winnerId === battle.clip1.id ? "bg-yellow-500/5" : ""}`}>
          <div className="relative aspect-video rounded-lg overflow-hidden mb-2">
            <Image
              src={battle.clip1.thumbnail || "/globe.svg"}
              alt={battle.clip1.trickName}
              fill
              className="object-cover"
            />
            {battle.winnerId === battle.clip1.id && (
              <div className="absolute top-1 right-1 bg-yellow-500 text-black p-1 rounded-full">
                <Trophy size={12} />
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 rounded-full overflow-hidden relative">
              <Image
                src={battle.clip1.user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${battle.clip1.user.name}`}
                alt={battle.clip1.user.name}
                fill
                className="object-cover"
              />
            </div>
            <span className="text-xs text-neutral-300 truncate">{battle.clip1.user.username}</span>
          </div>
          <p className="text-xs text-neutral-500">{battle.clip1.trickName || "No trick"}</p>
        </div>

        {/* VS divider */}
        <div className="flex flex-col items-center justify-center px-2">
          <span className="text-sm font-bold text-orange-400">VS</span>
          {totalVotes > 0 && (
            <div className="text-xs text-neutral-500 mt-1">
              {clip1Pct}% - {clip2Pct}%
            </div>
          )}
        </div>

        {/* Clip 2 */}
        <div className={`flex-1 p-3 ${battle.winnerId === battle.clip2.id ? "bg-yellow-500/5" : ""}`}>
          <div className="relative aspect-video rounded-lg overflow-hidden mb-2">
            <Image
              src={battle.clip2.thumbnail || "/globe.svg"}
              alt={battle.clip2.trickName}
              fill
              className="object-cover"
            />
            {battle.winnerId === battle.clip2.id && (
              <div className="absolute top-1 right-1 bg-yellow-500 text-black p-1 rounded-full">
                <Trophy size={12} />
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 rounded-full overflow-hidden relative">
              <Image
                src={battle.clip2.user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${battle.clip2.user.name}`}
                alt={battle.clip2.user.name}
                fill
                className="object-cover"
              />
            </div>
            <span className="text-xs text-neutral-300 truncate">{battle.clip2.user.username}</span>
          </div>
          <p className="text-xs text-neutral-500">{battle.clip2.trickName || "No trick"}</p>
        </div>
      </div>

      {totalVotes > 0 && (
        <div className="h-1 flex">
          <div className="bg-blue-500 transition-all" style={{ width: `${clip1Pct}%` }} />
          <div className="bg-red-500 transition-all" style={{ width: `${clip2Pct}%` }} />
        </div>
      )}
    </Link>
  );
}
