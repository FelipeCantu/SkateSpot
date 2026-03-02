"use client";

import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { FileUploadButton } from "@/components/FileUploadButton";

interface CreateTutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function CreateTutorialModal({ isOpen, onClose, onCreated }: CreateTutorialModalProps) {
  const [form, setForm] = useState({
    trickName: "",
    difficulty: "beginner",
    videoUrl: "",
    thumbnail: "",
    description: "",
  });
  const [steps, setSteps] = useState<{ step: number; text: string; timestamp?: number }[]>([
    { step: 1, text: "" },
  ]);
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  function addStep() {
    setSteps([...steps, { step: steps.length + 1, text: "" }]);
  }

  function removeStep(index: number) {
    const newSteps = steps.filter((_, i) => i !== index).map((s, i) => ({ ...s, step: i + 1 }));
    setSteps(newSteps);
  }

  function updateStep(index: number, text: string) {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], text };
    setSteps(newSteps);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/tutorials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          steps: steps.filter((s) => s.text.trim()),
        }),
      });
      if (res.ok) {
        onCreated();
        onClose();
        setForm({ trickName: "", difficulty: "beginner", videoUrl: "", thumbnail: "", description: "" });
        setSteps([{ step: 1, text: "" }]);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-neutral-900 border border-white/10 rounded-2xl w-full max-w-lg mx-4 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-lg font-bold text-white">Create Tutorial</h2>
          <button onClick={onClose} className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-white/10">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">Trick Name</label>
            <input
              type="text"
              value={form.trickName}
              onChange={(e) => setForm({ ...form, trickName: e.target.value })}
              placeholder="e.g. Kickflip"
              required
              className="w-full px-3 py-2 bg-neutral-800 border border-white/10 rounded-lg text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-secondary"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">Difficulty</label>
            <select
              value={form.difficulty}
              onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
              className="w-full px-3 py-2 bg-neutral-800 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-secondary"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">Video</label>
            <FileUploadButton
              accept="video/*"
              onUpload={(url) => setForm({ ...form, videoUrl: url })}
            />
            {form.videoUrl && <p className="text-xs text-green-400 mt-1">Video uploaded</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe the trick and key tips..."
              rows={3}
              className="w-full px-3 py-2 bg-neutral-800 border border-white/10 rounded-lg text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-secondary resize-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-neutral-400">Steps</label>
              <button type="button" onClick={addStep} className="flex items-center gap-1 text-xs text-secondary hover:text-secondary-light">
                <Plus size={12} /> Add Step
              </button>
            </div>
            <div className="space-y-2">
              {steps.map((step, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="w-6 h-8 flex items-center justify-center text-xs text-neutral-500 font-bold shrink-0">
                    {i + 1}.
                  </span>
                  <input
                    type="text"
                    value={step.text}
                    onChange={(e) => updateStep(i, e.target.value)}
                    placeholder={`Step ${i + 1}...`}
                    className="flex-1 px-3 py-1.5 bg-neutral-800 border border-white/10 rounded-lg text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-secondary"
                  />
                  {steps.length > 1 && (
                    <button type="button" onClick={() => removeStep(i)} className="p-1.5 text-neutral-500 hover:text-red-400">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={saving || !form.trickName}
            className="w-full py-2.5 bg-secondary hover:bg-secondary-dark text-white font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? "Creating..." : "Create Tutorial"}
          </button>
        </form>
      </div>
    </div>
  );
}
