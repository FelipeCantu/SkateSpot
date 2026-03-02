"use client";

import { useState, useEffect } from "react";
import { BookOpen, Plus, Search } from "lucide-react";
import { TutorialCard } from "@/components/TutorialCard";
import { CreateTutorialModal } from "@/components/CreateTutorialModal";
import { useSession } from "next-auth/react";

const difficulties = ["all", "beginner", "intermediate", "advanced", "expert"];
const sortOptions = [
  { value: "recent", label: "Recent" },
  { value: "popular", label: "Most Viewed" },
  { value: "helpful", label: "Most Helpful" },
];

export default function TutorialsPage() {
  const { data: session } = useSession();
  const [tutorials, setTutorials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("all");
  const [sort, setSort] = useState("recent");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    fetchTutorials();
  }, [difficulty, sort]);

  async function fetchTutorials() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (difficulty !== "all") params.set("difficulty", difficulty);
      if (search) params.set("search", search);
      params.set("sort", sort);
      const res = await fetch(`/api/tutorials?${params}`);
      if (res.ok) setTutorials(await res.json());
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    fetchTutorials();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <BookOpen size={24} className="text-secondary" />
          Tutorials
        </h1>
        {session?.user && (
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary-dark text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus size={16} />
            Create Tutorial
          </button>
        )}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tricks..."
            className="w-full pl-9 pr-3 py-2 bg-neutral-800 border border-white/10 rounded-lg text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-secondary"
          />
        </form>
        <div className="flex gap-2">
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="px-3 py-2 bg-neutral-800 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-secondary"
          >
            {difficulties.map((d) => (
              <option key={d} value={d}>{d === "all" ? "All Levels" : d.charAt(0).toUpperCase() + d.slice(1)}</option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-2 bg-neutral-800 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-secondary"
          >
            {sortOptions.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-[4/3] bg-neutral-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : tutorials.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen size={48} className="mx-auto mb-4 text-neutral-600" />
          <h3 className="text-lg font-medium text-white mb-2">No tutorials found</h3>
          <p className="text-neutral-400 text-sm">Be the first to teach a trick!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tutorials.map((t) => (
            <TutorialCard key={t.id} tutorial={t} />
          ))}
        </div>
      )}

      <CreateTutorialModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={fetchTutorials}
      />
    </div>
  );
}
