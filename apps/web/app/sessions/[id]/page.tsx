"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Users, ArrowLeft, Clock, LogIn, LogOut } from "lucide-react";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import { WeatherWidget } from "@/components/WeatherWidget";

export default function SessionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: authSession } = useSession();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const userId = (authSession?.user as any)?.id;

  useEffect(() => {
    fetchSession();
  }, [id]);

  async function fetchSession() {
    try {
      const res = await fetch(`/api/sessions/${id}`);
      if (res.ok) setSession(await res.json());
    } finally {
      setLoading(false);
    }
  }

  async function handleJoin() {
    const res = await fetch(`/api/sessions/${id}/join`, { method: "POST" });
    if (res.ok) fetchSession();
  }

  async function handleLeave() {
    const res = await fetch(`/api/sessions/${id}/leave`, { method: "POST" });
    if (res.ok) fetchSession();
  }

  async function handleEnd() {
    const res = await fetch(`/api/sessions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "completed" }),
    });
    if (res.ok) fetchSession();
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-neutral-800 rounded" />
          <div className="h-48 bg-neutral-800 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center text-neutral-400">
        Session not found.
      </div>
    );
  }

  const isHost = userId === session.userId;
  const isParticipant = session.participants?.some((p: any) => p.userId === userId);
  const isActive = session.status === "active" || session.status === "scheduled";
  const isFull = session.maxParticipants && session.participants?.length >= session.maxParticipants;

  const statusColors: Record<string, string> = {
    active: "bg-green-500/20 text-green-400 border-green-500/30",
    scheduled: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    completed: "bg-neutral-500/20 text-neutral-400 border-neutral-500/30",
    cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/sessions" className="flex items-center gap-2 text-neutral-400 hover:text-white mb-6 text-sm">
        <ArrowLeft size={16} />
        All Sessions
      </Link>

      {/* Header Card */}
      <div className="bg-neutral-900 border border-white/10 rounded-xl p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-white">{session.title}</h1>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[session.status]}`}>
                {session.status}
              </span>
            </div>
            {session.description && (
              <p className="text-neutral-300 text-sm mb-3">{session.description}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          {session.spot && (
            <Link href={`/spot/${session.spot.id}`} className="flex items-center gap-2 text-neutral-400 hover:text-green-400 transition-colors">
              <MapPin size={16} className="text-green-400" />
              {session.spot.name}
            </Link>
          )}
          <div className="flex items-center gap-2 text-neutral-400">
            <Calendar size={16} className="text-green-400" />
            {format(new Date(session.startTime), "MMM d, yyyy h:mm a")}
          </div>
          {session.endTime && (
            <div className="flex items-center gap-2 text-neutral-400">
              <Clock size={16} className="text-green-400" />
              Ends {format(new Date(session.endTime), "h:mm a")}
            </div>
          )}
          <div className="flex items-center gap-2 text-neutral-400">
            <Users size={16} className="text-green-400" />
            {session.participants?.length || 0}
            {session.maxParticipants ? ` / ${session.maxParticipants}` : ""} participants
          </div>
        </div>

        {/* Host info */}
        {session.user && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10 text-sm text-neutral-400">
            <span>Hosted by</span>
            <Link href={`/user/${session.user.id}`} className="flex items-center gap-1.5 text-white hover:text-green-400">
              <div className="w-5 h-5 rounded-full overflow-hidden relative bg-neutral-800">
                {session.user.avatar && <Image src={session.user.avatar} alt="" fill className="object-cover" />}
              </div>
              @{session.user.username}
            </Link>
          </div>
        )}

        {/* Action Buttons */}
        {authSession?.user && isActive && (
          <div className="mt-4 pt-4 border-t border-white/10 flex gap-3">
            {isHost ? (
              <button
                onClick={handleEnd}
                className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg text-sm font-medium transition-colors"
              >
                End Session
              </button>
            ) : isParticipant ? (
              <button
                onClick={handleLeave}
                className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg text-sm font-medium transition-colors"
              >
                <LogOut size={16} />
                Leave Session
              </button>
            ) : (
              <button
                onClick={handleJoin}
                disabled={!!isFull}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                <LogIn size={16} />
                {isFull ? "Session Full" : "Join Session"}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Weather */}
      {session.spot && (
        <div className="mb-6">
          <WeatherWidget lat={session.spot.lat} lng={session.spot.lng} />
        </div>
      )}

      {/* Participants */}
      <h2 className="text-lg font-bold text-white mb-4">
        Participants ({session.participants?.length || 0})
      </h2>
      <div className="space-y-2">
        {session.participants?.length === 0 ? (
          <div className="text-center py-8 text-neutral-500 text-sm">
            No participants yet. Be the first to join!
          </div>
        ) : (
          session.participants?.map((p: any) => (
            <Link
              key={p.id}
              href={`/user/${p.user.id}`}
              className="flex items-center gap-3 p-3 bg-neutral-900 border border-white/10 rounded-xl hover:border-white/20 transition-colors"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden relative bg-neutral-800">
                {p.user.avatar && (
                  <Image src={p.user.avatar} alt={p.user.name} fill className="object-cover" />
                )}
              </div>
              <div className="flex-1">
                <span className="text-sm font-medium text-white">{p.user.username}</span>
                <span className="text-xs text-neutral-500 ml-2">{p.status}</span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
