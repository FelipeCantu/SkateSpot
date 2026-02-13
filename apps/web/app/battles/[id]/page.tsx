"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swords, Clock, Trophy, ArrowLeft, ThumbsUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useSession } from "next-auth/react";

export default function BattleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: session } = useSession();
  const [battle, setBattle] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [voting, setVoting] = useState(false);

  useEffect(() => {
    fetchBattle();
  }, [id]);

  async function fetchBattle() {
    try {
      const res = await fetch(`/api/battles/${id}`);
      if (res.ok) setBattle(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleVote(clipId: string) {
    if (voting || !session?.user) return;
    setVoting(true);
    try {
      const res = await fetch(`/api/battles/${id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clipId }),
      });
      if (res.ok) await fetchBattle();
    } catch (err) {
      console.error(err);
    } finally {
      setVoting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-neutral-800 rounded" />
          <div className="h-64 bg-neutral-800 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!battle) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center text-neutral-400">
        Battle not found.
      </div>
    );
  }

  const totalVotes = battle.clip1Votes + battle.clip2Votes;
  const clip1Pct = totalVotes > 0 ? Math.round((battle.clip1Votes / totalVotes) * 100) : 50;
  const clip2Pct = 100 - clip1Pct;
  const isActive = battle.status === "active";
  const hasVoted = !!battle.userVotedClipId;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/battles" className="flex items-center gap-2 text-neutral-400 hover:text-white mb-6 text-sm">
        <ArrowLeft size={16} />
        Back to Battles
      </Link>

      <div className="bg-neutral-900 border border-white/10 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Swords size={24} className="text-orange-400" />
            <div>
              <h1 className="text-xl font-bold text-white">Battle at {battle.spot.name}</h1>
              <p className="text-sm text-neutral-500">{totalVotes} total votes</p>
            </div>
          </div>
          {isActive ? (
            <div className="flex items-center gap-2 text-sm text-neutral-400">
              <Clock size={16} />
              {formatDistanceToNow(new Date(battle.expiresAt), { addSuffix: false })} left
            </div>
          ) : (
            <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm">
              Completed
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Clip 1 */}
          <ClipSide
            clip={battle.clip1}
            votes={battle.clip1Votes}
            pct={clip1Pct}
            isWinner={battle.winnerId === battle.clip1.id}
            isVoted={battle.userVotedClipId === battle.clip1.id}
            canVote={isActive && !hasVoted && !!session?.user}
            onVote={() => handleVote(battle.clip1.id)}
            voting={voting}
          />

          {/* Clip 2 */}
          <ClipSide
            clip={battle.clip2}
            votes={battle.clip2Votes}
            pct={clip2Pct}
            isWinner={battle.winnerId === battle.clip2.id}
            isVoted={battle.userVotedClipId === battle.clip2.id}
            canVote={isActive && !hasVoted && !!session?.user}
            onVote={() => handleVote(battle.clip2.id)}
            voting={voting}
          />
        </div>

        {totalVotes > 0 && (
          <div className="h-2 flex">
            <div className="bg-blue-500 transition-all duration-500" style={{ width: `${clip1Pct}%` }} />
            <div className="bg-red-500 transition-all duration-500" style={{ width: `${clip2Pct}%` }} />
          </div>
        )}
      </div>
    </div>
  );
}

function ClipSide({
  clip,
  votes,
  pct,
  isWinner,
  isVoted,
  canVote,
  onVote,
  voting,
}: {
  clip: any;
  votes: number;
  pct: number;
  isWinner: boolean;
  isVoted: boolean;
  canVote: boolean;
  onVote: () => void;
  voting: boolean;
}) {
  return (
    <div className={`p-6 ${isWinner ? "bg-yellow-500/5" : ""} border-b md:border-b-0 md:border-r border-white/10 last:border-r-0`}>
      <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
        <Image
          src={clip.thumbnail || "/globe.svg"}
          alt={clip.trickName || "Clip"}
          fill
          className="object-cover"
        />
        {isWinner && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded-full flex items-center gap-1 text-xs font-bold">
            <Trophy size={14} />
            Winner
          </div>
        )}
      </div>

      <Link href={`/user/${clip.user.id}`} className="flex items-center gap-3 mb-3 group">
        <div className="w-10 h-10 rounded-full overflow-hidden relative border border-white/20">
          <Image
            src={clip.user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${clip.user.name}`}
            alt={clip.user.name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <p className="text-sm font-medium text-white group-hover:text-accent">{clip.user.username}</p>
          <p className="text-xs text-neutral-500">{clip.trickName || "No trick"}</p>
        </div>
      </Link>

      <div className="flex items-center justify-between">
        <div className="text-sm text-neutral-400">
          {votes} votes ({pct}%)
        </div>
        {canVote && (
          <button
            onClick={onVote}
            disabled={voting}
            className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/80 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            <ThumbsUp size={16} />
            Vote
          </button>
        )}
        {isVoted && (
          <span className="text-xs text-accent flex items-center gap-1">
            <ThumbsUp size={14} />
            Your vote
          </span>
        )}
      </div>
    </div>
  );
}
