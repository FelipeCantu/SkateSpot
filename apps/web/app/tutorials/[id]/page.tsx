"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Eye, ThumbsUp, ThumbsDown, Loader2 } from "lucide-react";
import { TutorialSteps } from "@/components/TutorialSteps";
import { useSession } from "next-auth/react";

export default function TutorialDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: session } = useSession();
  const [tutorial, setTutorial] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userVote, setUserVote] = useState<boolean | null>(null);

  useEffect(() => {
    fetch(`/api/tutorials/${id}`)
      .then((r) => r.json())
      .then(setTutorial)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  async function handleVote(helpful: boolean) {
    if (!session?.user) return;
    const res = await fetch(`/api/tutorials/${id}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ helpful }),
    });
    if (res.ok) {
      const data = await res.json();
      if (!data.voted) {
        setUserVote(null);
      } else {
        setUserVote(data.helpful);
      }
      // Refresh tutorial data
      const refreshed = await fetch(`/api/tutorials/${id}`).then((r) => r.json());
      setTutorial(refreshed);
    }
  }

  const difficultyColors: Record<string, string> = {
    beginner: "bg-green-500/20 text-green-400 border-green-500/30",
    intermediate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    advanced: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    expert: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="animate-spin text-neutral-500" size={32} />
      </div>
    );
  }

  if (!tutorial) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-neutral-500">
        Tutorial not found
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/tutorials" className="flex items-center gap-2 text-neutral-400 hover:text-white mb-6 text-sm">
        <ArrowLeft size={16} />
        All Tutorials
      </Link>

      {/* Video */}
      {tutorial.videoUrl && (
        <div className="aspect-video bg-neutral-950 rounded-xl overflow-hidden mb-6">
          <video src={tutorial.videoUrl} controls className="w-full h-full" poster={tutorial.thumbnail} />
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h1 className="text-2xl font-bold text-white">{tutorial.trickName}</h1>
          <span className={`text-xs px-2 py-1 rounded-full border shrink-0 ${difficultyColors[tutorial.difficulty] || difficultyColors.beginner}`}>
            {tutorial.difficulty}
          </span>
        </div>

        <div className="flex items-center gap-4 mb-4">
          {tutorial.user && (
            <Link href={`/user/${tutorial.user.id}`} className="flex items-center gap-2 hover:underline">
              <div className="w-8 h-8 rounded-full overflow-hidden relative bg-neutral-800">
                {tutorial.user.avatar && <Image src={tutorial.user.avatar} alt="" fill className="object-cover" />}
              </div>
              <span className="text-sm font-medium text-white">{tutorial.user.username}</span>
            </Link>
          )}
          <span className="flex items-center gap-1 text-sm text-neutral-500">
            <Eye size={14} />
            {tutorial.views} views
          </span>
        </div>

        {tutorial.description && (
          <p className="text-neutral-300 text-sm leading-relaxed">{tutorial.description}</p>
        )}
      </div>

      {/* Steps */}
      <div className="bg-neutral-900 border border-white/5 rounded-xl p-4 mb-6">
        <TutorialSteps steps={tutorial.steps} />
      </div>

      {/* Voting */}
      {session?.user && (
        <div className="bg-neutral-900 border border-white/5 rounded-xl p-4">
          <p className="text-sm text-neutral-400 mb-3">Was this tutorial helpful?</p>
          <div className="flex gap-3">
            <button
              onClick={() => handleVote(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                userVote === true
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
              }`}
            >
              <ThumbsUp size={16} />
              Helpful ({tutorial.helpfulVotes || 0})
            </button>
            <button
              onClick={() => handleVote(false)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                userVote === false
                  ? "bg-red-500/20 text-red-400 border border-red-500/30"
                  : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
              }`}
            >
              <ThumbsDown size={16} />
              Not Helpful ({tutorial.notHelpfulVotes || 0})
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
