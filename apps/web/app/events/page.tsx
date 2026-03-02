"use client";

import { useState, useEffect } from "react";
import { Trophy, Plus } from "lucide-react";
import { EventCard } from "@/components/EventCard";
import { CreateEventModal } from "@/components/CreateEventModal";
import { useSession } from "next-auth/react";

const statusTabs = [
  { value: "all", label: "All" },
  { value: "upcoming", label: "Upcoming" },
  { value: "active", label: "Active" },
  { value: "voting", label: "Voting" },
  { value: "completed", label: "Completed" },
];

export default function EventsPage() {
  const { data: session } = useSession();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const [category, setCategory] = useState("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, [status, type, category]);

  async function fetchEvents() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (status !== "all") params.set("status", status);
      if (type !== "all") params.set("type", type);
      if (category !== "all") params.set("category", category);
      const res = await fetch(`/api/events?${params}`);
      if (res.ok) setEvents(await res.json());
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Trophy size={24} className="text-cyan-400" />
          Events
        </h1>
        {session?.user && (
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus size={16} />
            Create Event
          </button>
        )}
      </div>

      {/* Status Tabs */}
      <div className="flex gap-1 mb-4 bg-neutral-800/50 p-1 rounded-lg w-fit overflow-x-auto">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatus(tab.value)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
              status === tab.value
                ? "bg-cyan-600 text-white"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="px-3 py-2 bg-neutral-800 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500"
        >
          <option value="all">All Types</option>
          <option value="contest">Contest</option>
          <option value="jam">Jam</option>
          <option value="meetup">Meetup</option>
        </select>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2 bg-neutral-800 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500"
        >
          <option value="all">All Categories</option>
          <option value="open">Open</option>
          <option value="flatground">Flatground</option>
          <option value="grinds">Grinds</option>
          <option value="best-trick">Best Trick</option>
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-44 bg-neutral-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-16">
          <Trophy size={48} className="mx-auto mb-4 text-neutral-600" />
          <h3 className="text-lg font-medium text-white mb-2">No events found</h3>
          <p className="text-neutral-400 text-sm">Create an event to get the competition started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      )}

      <CreateEventModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={fetchEvents}
      />
    </div>
  );
}
