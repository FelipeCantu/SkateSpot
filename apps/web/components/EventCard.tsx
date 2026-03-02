"use client";

import Link from "next/link";
import { Trophy, MapPin, Calendar, Users } from "lucide-react";
import { format } from "date-fns";

const statusColors: Record<string, string> = {
  upcoming: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  active: "bg-green-500/20 text-green-400 border-green-500/30",
  voting: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  completed: "bg-neutral-500/20 text-neutral-400 border-neutral-500/30",
};

const typeColors: Record<string, string> = {
  contest: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  jam: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  meetup: "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

export function EventCard({ event }: { event: any }) {
  return (
    <Link href={`/events/${event.id}`} className="block">
      <div className="bg-neutral-900 border border-white/5 rounded-xl overflow-hidden hover:border-cyan-500/20 transition-colors">
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-bold text-white text-sm line-clamp-1">{event.name}</h3>
            <span className={`text-[10px] px-2 py-0.5 rounded-full border shrink-0 ml-2 ${statusColors[event.status] || statusColors.upcoming}`}>
              {event.status}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-3">
            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${typeColors[event.type] || typeColors.meetup}`}>
              {event.type}
            </span>
            {event.category && event.category !== "open" && (
              <span className="text-[10px] px-2 py-0.5 rounded-full border border-white/10 text-neutral-400">
                {event.category}
              </span>
            )}
          </div>

          {event.spot && (
            <div className="flex items-center gap-1.5 mb-2 text-xs text-neutral-400">
              <MapPin size={12} className="text-cyan-400" />
              {event.spot.name}
            </div>
          )}

          <div className="flex items-center gap-1.5 mb-3 text-xs text-neutral-400">
            <Calendar size={12} className="text-cyan-400" />
            {format(new Date(event.startTime), "MMM d, h:mm a")}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {event.createdBy && (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-neutral-500">by {event.createdBy.username}</span>
                </div>
              )}
            </div>
            <span className="flex items-center gap-1 text-xs text-neutral-500">
              <Users size={12} />
              {event.participantCount || 0}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
