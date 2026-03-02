"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Users } from "lucide-react";
import { format } from "date-fns";

const statusColors: Record<string, string> = {
  active: "bg-green-500/20 text-green-400 border-green-500/30",
  scheduled: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  completed: "bg-neutral-500/20 text-neutral-400 border-neutral-500/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
};

export function SessionCard({ session }: { session: any }) {
  return (
    <Link href={`/sessions/${session.id}`} className="block">
      <div className="bg-neutral-900 border border-white/5 rounded-xl overflow-hidden hover:border-green-500/20 transition-colors">
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-bold text-white text-sm line-clamp-1">{session.title}</h3>
            <span className={`text-[10px] px-2 py-0.5 rounded-full border shrink-0 ml-2 ${statusColors[session.status] || statusColors.active}`}>
              {session.status}
            </span>
          </div>

          {session.spot && (
            <div className="flex items-center gap-1.5 mb-2 text-xs text-neutral-400">
              <MapPin size={12} className="text-green-400" />
              {session.spot.name}
            </div>
          )}

          <div className="flex items-center gap-1.5 mb-3 text-xs text-neutral-400">
            <Calendar size={12} className="text-green-400" />
            {format(new Date(session.startTime), "MMM d, h:mm a")}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {session.user && (
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full overflow-hidden relative bg-neutral-800 ring-2 ring-green-500/30">
                    {session.user.avatar && <Image src={session.user.avatar} alt="" fill className="object-cover" />}
                  </div>
                  <span className="text-xs text-neutral-400">{session.user.username}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Participant avatars */}
              {session.participants && session.participants.length > 0 && (
                <div className="flex -space-x-2">
                  {session.participants.slice(0, 3).map((p: any) => (
                    <div key={p.id} className="w-5 h-5 rounded-full overflow-hidden relative bg-neutral-800 border border-neutral-900">
                      {p.user?.avatar && <Image src={p.user.avatar} alt="" fill className="object-cover" />}
                    </div>
                  ))}
                </div>
              )}
              <span className="flex items-center gap-1 text-xs text-neutral-500">
                <Users size={12} />
                {session.participantCount || 0}
                {session.maxParticipants && `/${session.maxParticipants}`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
