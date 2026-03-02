"use client";

import { useState, useEffect } from "react";
import { Wrench, Plus } from "lucide-react";
import { GearSetupCard } from "@/components/GearSetupCard";
import { GearSetupForm } from "@/components/GearSetupForm";

export default function GearPage() {
  const [setups, setSetups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editSetup, setEditSetup] = useState<any>(null);

  useEffect(() => {
    fetchSetups();
  }, []);

  async function fetchSetups() {
    try {
      const res = await fetch("/api/gear");
      if (res.ok) setSetups(await res.json());
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this gear setup?")) return;
    await fetch(`/api/gear/${id}`, { method: "DELETE" });
    fetchSetups();
  }

  async function handleActivate(id: string) {
    await fetch(`/api/gear/${id}/activate`, { method: "POST" });
    fetchSetups();
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Wrench size={24} className="text-secondary" />
          My Gear
        </h1>
        <button
          onClick={() => { setEditSetup(null); setIsFormOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary-dark text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus size={16} />
          Add Setup
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-40 bg-neutral-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : setups.length === 0 ? (
        <div className="text-center py-16">
          <Wrench size={48} className="mx-auto mb-4 text-neutral-600" />
          <h3 className="text-lg font-medium text-white mb-2">No gear setups yet</h3>
          <p className="text-neutral-400 text-sm mb-4">Add your board setup to show off your gear!</p>
          <button
            onClick={() => setIsFormOpen(true)}
            className="px-4 py-2 bg-secondary hover:bg-secondary-dark text-white text-sm font-medium rounded-lg transition-colors"
          >
            Create First Setup
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {setups.map((setup) => (
            <GearSetupCard
              key={setup.id}
              setup={setup}
              isOwner={true}
              onEdit={() => { setEditSetup(setup); setIsFormOpen(true); }}
              onDelete={() => handleDelete(setup.id)}
              onActivate={() => handleActivate(setup.id)}
            />
          ))}
        </div>
      )}

      <GearSetupForm
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditSetup(null); }}
        onSaved={fetchSetups}
        editSetup={editSetup}
      />
    </div>
  );
}
