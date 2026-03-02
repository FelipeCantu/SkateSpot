"use client";

import { Wrench, Check, Edit2, Trash2, Star } from "lucide-react";

interface GearSetupCardProps {
  setup: any;
  isOwner: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onActivate?: () => void;
}

export function GearSetupCard({ setup, isOwner, onEdit, onDelete, onActivate }: GearSetupCardProps) {
  const specs = [
    { label: "Deck", value: setup.deckBrand, detail: setup.deckSize ? `${setup.deckSize}"` : "" },
    { label: "Trucks", value: setup.trucksBrand },
    { label: "Wheels", value: setup.wheelsBrand, detail: setup.wheelsSize ? `${setup.wheelsSize}mm` : "" },
    { label: "Bearings", value: setup.bearingsBrand },
    { label: "Shoes", value: setup.shoesBrand },
  ].filter((s) => s.value);

  return (
    <div className={`bg-neutral-900 border rounded-xl overflow-hidden ${setup.isActive ? "border-secondary/50" : "border-white/5"}`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Wrench size={16} className="text-neutral-400" />
            <h3 className="font-bold text-white">{setup.name}</h3>
            {setup.isActive && (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-secondary/20 text-secondary text-xs rounded-full border border-secondary/30">
                <Check size={12} />
                Active
              </span>
            )}
          </div>
          {isOwner && (
            <div className="flex items-center gap-1">
              {!setup.isActive && onActivate && (
                <button onClick={onActivate} className="p-1.5 rounded-md text-neutral-400 hover:text-secondary hover:bg-white/5" title="Set as active">
                  <Star size={14} />
                </button>
              )}
              {onEdit && (
                <button onClick={onEdit} className="p-1.5 rounded-md text-neutral-400 hover:text-white hover:bg-white/5">
                  <Edit2 size={14} />
                </button>
              )}
              {onDelete && (
                <button onClick={onDelete} className="p-1.5 rounded-md text-neutral-400 hover:text-red-400 hover:bg-white/5">
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {specs.map((spec) => (
            <div key={spec.label} className="bg-neutral-800/50 rounded-lg p-2.5">
              <div className="text-[10px] uppercase tracking-wider text-neutral-500 mb-0.5">{spec.label}</div>
              <div className="text-sm font-medium text-white">
                {spec.value}
                {spec.detail && <span className="text-neutral-400 ml-1">{spec.detail}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
