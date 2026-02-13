"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Users, Trophy, Shield, ArrowLeft, LogOut, Crown, UserPlus } from "lucide-react";
import { useSession } from "next-auth/react";

export default function CrewDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: session } = useSession();
  const router = useRouter();
  const [crew, setCrew] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const userId = (session?.user as any)?.id;

  useEffect(() => {
    fetchCrew();
  }, [id]);

  async function fetchCrew() {
    try {
      const res = await fetch(`/api/crews/${id}`);
      if (res.ok) setCrew(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleJoin() {
    const res = await fetch(`/api/crews/${id}/join`, { method: "POST" });
    if (res.ok) fetchCrew();
  }

  async function handleLeave() {
    const res = await fetch(`/api/crews/${id}/leave`, { method: "POST" });
    if (res.ok) fetchCrew();
  }

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-neutral-800 rounded" />
          <div className="h-32 bg-neutral-800 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!crew) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center text-neutral-400">
        Crew not found.
      </div>
    );
  }

  const roleIcons: Record<string, React.ReactNode> = {
    owner: <Crown size={14} className="text-yellow-400" />,
    admin: <Shield size={14} className="text-blue-400" />,
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/crews" className="flex items-center gap-2 text-neutral-400 hover:text-white mb-6 text-sm">
        <ArrowLeft size={16} />
        All Crews
      </Link>

      <div className="bg-neutral-900 border border-white/10 rounded-xl p-6 mb-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-2xl overflow-hidden relative flex-shrink-0">
            {crew.avatar ? (
              <Image src={crew.avatar} alt={crew.name} fill className="object-cover" />
            ) : (
              crew.name[0].toUpperCase()
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">{crew.name}</h1>
            <div className="flex items-center gap-4 mt-1 text-sm text-neutral-400">
              <span className="flex items-center gap-1">
                <Users size={14} />
                {crew.memberCount} members
              </span>
              <span className="flex items-center gap-1">
                <Trophy size={14} className="text-yellow-400" />
                {crew.totalPoints.toLocaleString()} pts
              </span>
            </div>
            {crew.description && (
              <p className="text-neutral-300 mt-2">{crew.description}</p>
            )}
          </div>
          {session?.user && (
            <div>
              {!crew.isMember ? (
                <button
                  onClick={handleJoin}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <UserPlus size={16} />
                  Join
                </button>
              ) : crew.userRole !== "owner" ? (
                <button
                  onClick={handleLeave}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg text-sm font-medium transition-colors"
                >
                  <LogOut size={16} />
                  Leave
                </button>
              ) : null}
            </div>
          )}
        </div>
      </div>

      <h2 className="text-lg font-bold text-white mb-4">Members</h2>
      <div className="space-y-2">
        {crew.members.map((member: any) => (
          <Link
            key={member.id}
            href={`/user/${member.user.id}`}
            className="flex items-center gap-3 p-3 bg-neutral-900 border border-white/10 rounded-xl hover:border-white/20 transition-colors"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden relative">
              <Image
                src={member.user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.user.name}`}
                alt={member.user.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white">{member.user.username}</span>
                {roleIcons[member.role]}
              </div>
              <span className="text-xs text-neutral-500">{member.user.points} pts - {member.user.tier}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
