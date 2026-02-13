"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Users, Plus, Trophy } from "lucide-react";
import { useSession } from "next-auth/react";
import { EmptyState } from "@/components/EmptyState";
import { CardSkeleton } from "@/components/LoadingSkeleton";

export default function CrewsPage() {
  const { data: session } = useSession();
  const [crews, setCrews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/crews")
      .then((r) => r.json())
      .then(setCrews)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Users size={28} className="text-purple-400" />
          Crews
        </h1>
        {session?.user && (
          <Link
            href="/crews/create"
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            Create Crew
          </Link>
        )}
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : crews.length === 0 ? (
        <EmptyState
          icon={<Users size={48} />}
          title="No crews yet"
          description="Be the first to create a skate crew and earn 50 points!"
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {crews.map((crew) => (
            <Link
              key={crew.id}
              href={`/crews/${crew.id}`}
              className="bg-neutral-900 border border-white/10 rounded-xl p-4 hover:border-purple-500/30 transition-all group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-lg overflow-hidden relative">
                  {crew.avatar ? (
                    <Image src={crew.avatar} alt={crew.name} fill className="object-cover" />
                  ) : (
                    crew.name[0].toUpperCase()
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white group-hover:text-purple-400 transition-colors truncate">
                    {crew.name}
                  </h3>
                  <p className="text-xs text-neutral-500">
                    {crew.memberCount} member{crew.memberCount !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              {crew.description && (
                <p className="text-sm text-neutral-400 line-clamp-2 mb-3">{crew.description}</p>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Trophy size={14} className="text-yellow-400" />
                <span className="text-neutral-300 font-medium">{crew.totalPoints.toLocaleString()} pts</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
