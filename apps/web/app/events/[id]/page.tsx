"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trophy, MapPin, Calendar, ArrowLeft, Users, ThumbsUp, Medal, Crown } from "lucide-react";
import { useSession } from "next-auth/react";
import { format } from "date-fns";

const podiumIcons = [
  <Crown key={0} size={16} className="text-yellow-400" />,
  <Medal key={1} size={16} className="text-gray-400" />,
  <Medal key={2} size={16} className="text-amber-700" />,
];

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: session } = useSession();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [clipId, setClipId] = useState("");
  const userId = (session?.user as any)?.id;

  useEffect(() => {
    fetchEvent();
  }, [id]);

  async function fetchEvent() {
    try {
      const res = await fetch(`/api/events/${id}`);
      if (res.ok) setEvent(await res.json());
    } finally {
      setLoading(false);
    }
  }

  async function handleJoin() {
    setJoining(true);
    try {
      const body: any = {};
      if (clipId) body.clipId = clipId;
      const res = await fetch(`/api/events/${id}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) fetchEvent();
    } finally {
      setJoining(false);
    }
  }

  async function handleVote(voteClipId: string) {
    const res = await fetch(`/api/events/${id}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clipId: voteClipId }),
    });
    if (res.ok) fetchEvent();
  }

  async function handleStatusChange(newStatus: string) {
    const res = await fetch(`/api/events/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) fetchEvent();
  }

  async function handleFinalize() {
    const res = await fetch(`/api/events/${id}/results`, { method: "POST" });
    if (res.ok) fetchEvent();
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

  if (!event) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center text-neutral-400">
        Event not found.
      </div>
    );
  }

  const isCreator = userId === event.createdById;
  const isParticipant = event.participants?.some((p: any) => p.userId === userId);
  const hasVoted = event.votes?.some((v: any) => v.userId === userId);
  const isVoting = event.status === "voting";
  const isCompleted = event.status === "completed";

  const statusColors: Record<string, string> = {
    upcoming: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    active: "bg-green-500/20 text-green-400 border-green-500/30",
    voting: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    completed: "bg-neutral-500/20 text-neutral-400 border-neutral-500/30",
  };

  const sortedParticipants = [...(event.participants || [])].sort(
    (a: any, b: any) => (b.voteCount || 0) - (a.voteCount || 0)
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/events" className="flex items-center gap-2 text-neutral-400 hover:text-white mb-6 text-sm">
        <ArrowLeft size={16} />
        All Events
      </Link>

      {/* Header Card */}
      <div className="bg-neutral-900 border border-white/10 rounded-xl p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1 className="text-2xl font-bold text-white">{event.name}</h1>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[event.status]}`}>
                {event.status}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="text-xs px-2 py-0.5 rounded-full border border-purple-500/30 bg-purple-500/20 text-purple-400">
                {event.type}
              </span>
              {event.category && event.category !== "open" && (
                <span className="text-xs px-2 py-0.5 rounded-full border border-white/10 text-neutral-400">
                  {event.category}
                </span>
              )}
            </div>
            {event.description && (
              <p className="text-neutral-300 text-sm mb-3">{event.description}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          {event.spot && (
            <Link href={`/spot/${event.spot.id}`} className="flex items-center gap-2 text-neutral-400 hover:text-cyan-400 transition-colors">
              <MapPin size={16} className="text-cyan-400" />
              {event.spot.name}
            </Link>
          )}
          <div className="flex items-center gap-2 text-neutral-400">
            <Calendar size={16} className="text-cyan-400" />
            {format(new Date(event.startTime), "MMM d, h:mm a")}
          </div>
          <div className="flex items-center gap-2 text-neutral-400">
            <Calendar size={16} className="text-cyan-400" />
            Ends {format(new Date(event.endTime), "MMM d, h:mm a")}
          </div>
          <div className="flex items-center gap-2 text-neutral-400">
            <Users size={16} className="text-cyan-400" />
            {event.participantCount} participants
          </div>
        </div>

        {/* Prizes */}
        {event.prizes && event.prizes.length > 0 && event.prizes.some((p: string) => p) && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <h3 className="text-xs font-medium text-neutral-400 mb-2">Prizes</h3>
            <div className="space-y-1">
              {event.prizes.map((prize: string, i: number) => prize && (
                <div key={i} className="flex items-center gap-2 text-sm">
                  {podiumIcons[i] || <span className="text-xs text-neutral-500 w-4">{i + 1}.</span>}
                  <span className="text-white">{prize}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Creator controls */}
        {isCreator && !isCompleted && (
          <div className="mt-4 pt-4 border-t border-white/10 flex gap-3 flex-wrap">
            {event.status === "upcoming" && (
              <button
                onClick={() => handleStatusChange("active")}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Start Event
              </button>
            )}
            {event.status === "active" && (
              <button
                onClick={() => handleStatusChange("voting")}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Start Voting
              </button>
            )}
            {event.status === "voting" && (
              <button
                onClick={handleFinalize}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Finalize Results
              </button>
            )}
          </div>
        )}

        {/* Join button */}
        {session?.user && !isParticipant && !isCompleted && (
          <div className="mt-4 pt-4 border-t border-white/10">
            {event.type === "contest" && (
              <div className="mb-3">
                <label className="block text-xs font-medium text-neutral-400 mb-1">Submit Clip ID</label>
                <input
                  type="text"
                  value={clipId}
                  onChange={(e) => setClipId(e.target.value)}
                  placeholder="Paste your clip ID..."
                  className="w-full px-3 py-2 bg-neutral-800 border border-white/10 rounded-lg text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            )}
            <button
              onClick={handleJoin}
              disabled={joining || (event.type === "contest" && !clipId)}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              {joining ? "Joining..." : "Join Event"}
            </button>
          </div>
        )}
      </div>

      {/* Participants / Results */}
      <h2 className="text-lg font-bold text-white mb-4">
        {isCompleted ? "Results" : "Participants"} ({event.participantCount})
      </h2>
      <div className="space-y-2">
        {sortedParticipants.length === 0 ? (
          <div className="text-center py-8 text-neutral-500 text-sm bg-neutral-900 border border-white/5 rounded-xl">
            No participants yet
          </div>
        ) : (
          sortedParticipants.map((p: any, index: number) => (
            <div
              key={p.id}
              className="flex items-center gap-3 p-3 bg-neutral-900 border border-white/10 rounded-xl"
            >
              {/* Rank */}
              {(isVoting || isCompleted) && (
                <div className="w-6 text-center shrink-0">
                  {podiumIcons[index] || <span className="text-xs text-neutral-500">#{index + 1}</span>}
                </div>
              )}

              <Link href={`/user/${p.user.id}`} className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-full overflow-hidden relative bg-neutral-800">
                  {p.user.avatar && (
                    <Image src={p.user.avatar} alt={p.user.name} fill className="object-cover" />
                  )}
                </div>
                <div className="flex-1">
                  <span className="text-sm font-medium text-white">{p.user.username}</span>
                  {p.clip && (
                    <p className="text-xs text-neutral-500 truncate">{p.clip.description}</p>
                  )}
                </div>
              </Link>

              {/* Vote count & button */}
              <div className="flex items-center gap-3">
                {(isVoting || isCompleted) && (
                  <span className="text-xs text-neutral-400">{p.voteCount || 0} votes</span>
                )}
                {isVoting && !hasVoted && p.clipId && p.userId !== userId && (
                  <button
                    onClick={() => handleVote(p.clipId)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 rounded-lg text-xs font-medium transition-colors"
                  >
                    <ThumbsUp size={12} />
                    Vote
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
