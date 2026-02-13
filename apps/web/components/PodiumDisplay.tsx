"use client";

import Image from "next/image";
import Link from "next/link";
import { Trophy, Medal } from "lucide-react";

interface PodiumEntry {
  id: string;
  position: number;
  user: { id: string; username: string; name: string; avatar: string; tier: string };
  clip: {
    id: string;
    thumbnail: string;
    trickName: string;
    _count: { likes: number };
  };
}

const POSITION_STYLES = {
  1: { bg: "bg-yellow-500/20", border: "border-yellow-500/50", icon: "text-yellow-400", label: "Gold" },
  2: { bg: "bg-neutral-400/20", border: "border-neutral-400/50", icon: "text-neutral-300", label: "Silver" },
  3: { bg: "bg-amber-700/20", border: "border-amber-700/50", icon: "text-amber-600", label: "Bronze" },
} as Record<number, { bg: string; border: string; icon: string; label: string }>;

export function PodiumDisplay({ podium }: { podium: PodiumEntry[] }) {
  if (podium.length === 0) {
    return (
      <div className="text-center py-6 text-neutral-500 text-sm">
        No podium holders yet. Upload clips and get likes to claim your spot!
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold text-white flex items-center gap-2">
        <Trophy size={20} className="text-yellow-400" />
        Podium
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {podium.map((entry) => {
          const style = POSITION_STYLES[entry.position] || POSITION_STYLES[3];
          return (
            <div
              key={entry.id}
              className={`${style.bg} border ${style.border} rounded-xl p-3 text-center`}
            >
              <div className="flex justify-center mb-2">
                <Medal size={24} className={style.icon} />
              </div>
              <p className={`text-xs font-bold ${style.icon} mb-2`}>{style.label}</p>
              <Link href={`/user/${entry.user.id}`} className="group">
                <div className="w-12 h-12 rounded-full overflow-hidden relative mx-auto mb-1 border-2 border-white/20">
                  <Image
                    src={entry.user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.user.name}`}
                    alt={entry.user.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-sm font-medium text-white group-hover:text-accent truncate">
                  {entry.user.username}
                </p>
              </Link>
              <p className="text-xs text-neutral-400 mt-1">
                {entry.clip.trickName || "Clip"} - {entry.clip._count.likes} likes
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
