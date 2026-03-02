"use client";

import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { useSpots } from "@/context/SpotContext";

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function CreateEventModal({ isOpen, onClose, onCreated }: CreateEventModalProps) {
  const { spots } = useSpots();
  const [form, setForm] = useState({
    name: "",
    description: "",
    type: "contest",
    category: "open",
    spotId: "",
    startTime: "",
    endTime: "",
  });
  const [prizes, setPrizes] = useState<string[]>([""]);
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          startTime: new Date(form.startTime).toISOString(),
          endTime: new Date(form.endTime).toISOString(),
          prizes: prizes.filter((p) => p.trim()),
        }),
      });
      if (res.ok) {
        onCreated();
        onClose();
        setForm({ name: "", description: "", type: "contest", category: "open", spotId: "", startTime: "", endTime: "" });
        setPrizes([""]);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-neutral-900 border border-white/10 rounded-2xl w-full max-w-lg mx-4 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-lg font-bold text-white">Create Event</h2>
          <button onClick={onClose} className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-white/10">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">Event Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Best Trick Contest"
              required
              className="w-full px-3 py-2 bg-neutral-800 border border-white/10 rounded-lg text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-800 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500"
              >
                <option value="contest">Contest</option>
                <option value="jam">Jam</option>
                <option value="meetup">Meetup</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-800 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500"
              >
                <option value="open">Open</option>
                <option value="flatground">Flatground</option>
                <option value="grinds">Grinds</option>
                <option value="best-trick">Best Trick</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">Spot (optional)</label>
            <select
              value={form.spotId}
              onChange={(e) => setForm({ ...form, spotId: e.target.value })}
              className="w-full px-3 py-2 bg-neutral-800 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500"
            >
              <option value="">No specific spot</option>
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
              placeholder="Describe the event..."
              rows={3}
              className="w-full px-3 py-2 bg-neutral-800 border border-white/10 rounded-lg text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-cyan-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">Start Time</label>
              <input
                type="datetime-local"
                value={form.startTime}
                onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                required
                className="w-full px-3 py-2 bg-neutral-800 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">End Time</label>
              <input
                type="datetime-local"
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                required
                className="w-full px-3 py-2 bg-neutral-800 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Prizes */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-neutral-400">Prizes</label>
              <button
                type="button"
                onClick={() => setPrizes([...prizes, ""])}
                className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300"
              >
                <Plus size={12} /> Add Prize
              </button>
            </div>
            <div className="space-y-2">
              {prizes.map((prize, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-6 text-xs text-neutral-500 font-bold shrink-0">
                    {i === 0 ? "1st" : i === 1 ? "2nd" : i === 2 ? "3rd" : `${i + 1}th`}
                  </span>
                  <input
                    type="text"
                    value={prize}
                    onChange={(e) => {
                      const newPrizes = [...prizes];
                      newPrizes[i] = e.target.value;
                      setPrizes(newPrizes);
                    }}
                    placeholder={`Prize for ${i + 1}${i === 0 ? "st" : i === 1 ? "nd" : i === 2 ? "rd" : "th"} place...`}
                    className="flex-1 px-3 py-1.5 bg-neutral-800 border border-white/10 rounded-lg text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
                  />
                  {prizes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setPrizes(prizes.filter((_, j) => j !== i))}
                      className="p-1.5 text-neutral-500 hover:text-red-400"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={saving || !form.name || !form.startTime || !form.endTime}
            className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? "Creating..." : "Create Event"}
          </button>
        </form>
      </div>
    </div>
  );
}
