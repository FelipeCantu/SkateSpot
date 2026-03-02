"use client";

import { useState, useEffect } from "react";
import { Calendar, Plus, Search } from "lucide-react";
import { SessionCard } from "@/components/SessionCard";
import { CreateSessionModal } from "@/components/CreateSessionModal";
import { useSession } from "next-auth/react";

const statusTabs = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "scheduled", label: "Scheduled" },
  { value: "completed", label: "Completed" },
];

export default function SessionsPage() {
  const { data: session } = useSession();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("all");
  const [spotFilter, setSpotFilter] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, [status]);

  async function fetchSessions() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (status !== "all") params.set("status", status);
      if (spotFilter) params.set("spotId", spotFilter);
      const res = await fetch(`/api/sessions?${params}`);
      if (res.ok) setSessions(await res.json());
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Calendar size={24} className="text-green-400" />
          Sessions
        </h1>
        {session?.user && (
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus size={16} />
            Create Session
          </button>
        )}
      </div>

      {/* Status Tabs */}
      <div className="flex gap-1 mb-6 bg-neutral-800/50 p-1 rounded-lg w-fit">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatus(tab.value)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              status === tab.value
                ? "bg-green-600 text-white"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-40 bg-neutral-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-16">
          <Calendar size={48} className="mx-auto mb-4 text-neutral-600" />
          <h3 className="text-lg font-medium text-white mb-2">No sessions found</h3>
          <p className="text-neutral-400 text-sm">Create a session to start skating with others!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sessions.map((s) => (
            <SessionCard key={s.id} session={s} />
          ))}
        </div>
      )}

      <CreateSessionModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={fetchSessions}
      />
    </div>
  );
}
