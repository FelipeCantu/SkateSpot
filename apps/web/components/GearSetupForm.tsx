"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface GearSetupFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  editSetup?: any;
}

export function GearSetupForm({ isOpen, onClose, onSaved, editSetup }: GearSetupFormProps) {
  const [form, setForm] = useState({
    name: editSetup?.name || "",
    deckBrand: editSetup?.deckBrand || "",
    deckSize: editSetup?.deckSize || "",
    trucksBrand: editSetup?.trucksBrand || "",
    wheelsBrand: editSetup?.wheelsBrand || "",
    wheelsSize: editSetup?.wheelsSize || "",
    bearingsBrand: editSetup?.bearingsBrand || "",
    shoesBrand: editSetup?.shoesBrand || "",
  });
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editSetup ? `/api/gear/${editSetup.id}` : "/api/gear";
      const method = editSetup ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        onSaved();
        onClose();
      }
    } finally {
      setSaving(false);
    }
  }

  const fields = [
    { key: "name", label: "Setup Name", placeholder: "e.g. Street Setup", required: true },
    { key: "deckBrand", label: "Deck Brand", placeholder: "e.g. Baker" },
    { key: "deckSize", label: "Deck Size", placeholder: 'e.g. 8.25' },
    { key: "trucksBrand", label: "Trucks", placeholder: "e.g. Independent" },
    { key: "wheelsBrand", label: "Wheels Brand", placeholder: "e.g. Spitfire" },
    { key: "wheelsSize", label: "Wheel Size (mm)", placeholder: "e.g. 52" },
    { key: "bearingsBrand", label: "Bearings", placeholder: "e.g. Bones Reds" },
    { key: "shoesBrand", label: "Shoes", placeholder: "e.g. Nike SB" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-neutral-900 border border-white/10 rounded-2xl w-full max-w-md mx-4 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-lg font-bold text-white">{editSetup ? "Edit" : "New"} Gear Setup</h2>
          <button onClick={onClose} className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-white/10">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="block text-xs font-medium text-neutral-400 mb-1">{f.label}</label>
              <input
                type="text"
                value={(form as any)[f.key]}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                placeholder={f.placeholder}
                required={f.required}
                className="w-full px-3 py-2 bg-neutral-800 border border-white/10 rounded-lg text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-secondary"
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={saving || !form.name}
            className="w-full py-2.5 bg-secondary hover:bg-secondary-dark text-white font-medium rounded-lg transition-colors disabled:opacity-50 mt-4"
          >
            {saving ? "Saving..." : editSetup ? "Update Setup" : "Create Setup"}
          </button>
        </form>
      </div>
    </div>
  );
}
