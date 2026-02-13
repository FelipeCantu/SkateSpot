"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Users } from "lucide-react";
import Link from "next/link";

export default function CreateCrewPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    setError("");

    try {
      const res = await fetch("/api/crews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), description: description.trim() }),
      });

      if (res.ok) {
        const crew = await res.json();
        router.push(`/crews/${crew.id}`);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to create crew");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <Link href="/crews" className="flex items-center gap-2 text-neutral-400 hover:text-white mb-6 text-sm">
        <ArrowLeft size={16} />
        All Crews
      </Link>

      <h1 className="text-2xl font-bold text-white flex items-center gap-3 mb-6">
        <Users size={28} className="text-purple-400" />
        Create a Crew
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-1">
            Crew Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Night Shredders"
            className="w-full bg-neutral-800 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500"
            maxLength={50}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What's your crew about?"
            rows={3}
            className="w-full bg-neutral-800 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500 resize-none"
            maxLength={300}
          />
        </div>

        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}

        <p className="text-xs text-neutral-500">
          Creating a crew earns you +50 points!
        </p>

        <button
          type="submit"
          disabled={creating || !name.trim()}
          className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {creating ? "Creating..." : "Create Crew"}
        </button>
      </form>
    </div>
  );
}
