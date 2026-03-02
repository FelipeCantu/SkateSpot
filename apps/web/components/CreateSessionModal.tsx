"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useSpots } from "@/context/SpotContext";

interface CreateSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function CreateSessionModal({ isOpen, onClose, onCreated }: CreateSessionModalProps) {
  const { spots } = useSpots();
  const [form, setForm] = useState({
    title: "",
    description: "",
    spotId: "",
    startTime: "",
    maxParticipants: "",
  });
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          maxParticipants: form.maxParticipants ? parseInt(form.maxParticipants) : null,
          startTime: form.startTime ? new Date(form.startTime).toISOString() : undefined,
        }),
      });
      if (res.ok) {
        onCreated();
        onClose();
        setForm({ title: "", description: "", spotId: "", startTime: "", maxParticipants: "" });
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-neutral-900 border border-white/10 rounded-2xl w-full max-w-lg mx-4 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-lg font-bold text-white">Create Session</h2>
          <button onClick={onClose} className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-white/10">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Sunday Park Session"
              required
              className="w-full px-3 py-2 bg-neutral-800 border border-white/10 rounded-lg text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">Spot</label>
            <select
              value={form.spotId}
              onChange={(e) => setForm({ ...form, spotId: e.target.value })}
              required
              className="w-full px-3 py-2 bg-neutral-800 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-green-500"
            >
              <option value="">Select a spot...</option>
              {spots.map((spot) => (
                <option key={spot.id} value={spot.id}>{spot.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="What's the session about?"
              rows={3}
              className="w-full px-3 py-2 bg-neutral-800 border border-white/10 rounded-lg text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-green-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">Start Time</label>
            <input
              type="datetime-local"
              value={form.startTime}
              onChange={(e) => setForm({ ...form, startTime: e.target.value })}
              className="w-full px-3 py-2 bg-neutral-800 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">Max Participants (optional)</label>
            <input
              type="number"
              value={form.maxParticipants}
              onChange={(e) => setForm({ ...form, maxParticipants: e.target.value })}
              placeholder="Leave empty for unlimited"
              min="2"
              className="w-full px-3 py-2 bg-neutral-800 border border-white/10 rounded-lg text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-green-500"
            />
          </div>

          <button
            type="submit"
            disabled={saving || !form.title || !form.spotId}
            className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? "Creating..." : "Create Session"}
          </button>
        </form>
      </div>
    </div>
  );
}
