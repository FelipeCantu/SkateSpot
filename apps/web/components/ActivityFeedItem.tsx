"use client";

import Link from "next/link";
import Image from "next/image";
import { Film, Swords, Award, MapPin, Zap, Users, Trophy, UserPlus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const EVENT_CONFIG: Record<string, { icon: React.ReactNode; label: (meta: any) => string; color: string }> = {
  clip_upload: {
    icon: <Film size={16} />,
    label: () => "uploaded a new clip",
    color: "text-blue-400",
  },
  battle_win: {
    icon: <Swords size={16} />,
    label: () => "won a battle",
    color: "text-orange-400",
  },
  badge_earned: {
    icon: <Award size={16} />,
    label: (meta: any) => `unlocked "${meta?.name || "achievement"}"`,
    color: "text-purple-400",
  },
  spot_created: {
    icon: <MapPin size={16} />,
    label: () => "added a new spot",
    color: "text-green-400",
  },
  trick_landed: {
    icon: <Zap size={16} />,
    label: (meta: any) => `landed ${meta?.trickName || "a trick"}`,
    color: "text-yellow-400",
  },
  crew_joined: {
    icon: <Users size={16} />,
    label: (meta: any) => `joined crew "${meta?.crewName || ""}"`,
    color: "text-purple-400",
  },
  challenge_won: {
    icon: <Trophy size={16} />,
    label: () => "won a challenge",
    color: "text-yellow-400",
  },
  podium_earned: {
    icon: <Trophy size={16} />,
    label: (meta: any) => `earned a podium position`,
    color: "text-yellow-400",
  },
  follow: {
    icon: <UserPlus size={16} />,
    label: () => "followed someone",
    color: "text-blue-400",
  },
};

interface ActivityFeedItemProps {
  event: {
    id: string;
    type: string;
    metadata: string;
    createdAt: string;
    user: { id: string; username: string; name: string; avatar: string; tier: string };
  };
}

export function ActivityFeedItem({ event }: ActivityFeedItemProps) {
  const config = EVENT_CONFIG[event.type] || {
    icon: <Film size={16} />,
    label: () => event.type,
    color: "text-neutral-400",
  };

  let meta: any = {};
  try {
    meta = JSON.parse(event.metadata);
  } catch {}

  return (
    <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
      <Link href={`/user/${event.user.id}`}>
        <div className="w-10 h-10 rounded-full overflow-hidden relative flex-shrink-0">
          <Image
            src={event.user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${event.user.name}`}
            alt={event.user.name}
            fill
            className="object-cover"
          />
        </div>
      </Link>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-neutral-300">
          <Link href={`/user/${event.user.id}`} className="font-medium text-white hover:text-accent">
            {event.user.username}
          </Link>{" "}
          {config.label(meta)}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className={config.color}>{config.icon}</span>
          <span className="text-xs text-neutral-500">
            {formatDistanceToNow(new Date(event.createdAt), { addSuffix: true })}
          </span>
        </div>
      </div>
    </div>
  );
}
