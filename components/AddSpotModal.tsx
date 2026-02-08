"use client";

import { X, MapPin, Star } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSpots } from "@/context/SpotContext";
import { FileUploadButton } from "@/components/FileUploadButton";

const FEATURE_OPTIONS = ["Stairs", "Rail", "Ledge", "Gap", "Bank", "Manual Pad", "Flatground", "Bowl", "Snake Run", "Hips", "Quarter Pipe", "Half Pipe", "Path", "Curb"];

interface AddSpotModalProps {
    isOpen: boolean;
    onClose: () => void;
    location: [number, number] | null;
}

export function AddSpotModal({ isOpen, onClose, location }: AddSpotModalProps) {
    const { addSpot } = useSpots();
    const [rating, setRating] = useState(0);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [difficulty, setDifficulty] = useState("Beginner");
    const [type, setType] = useState("Street");
    const [features, setFeatures] = useState<string[]>([]);
    const [images, setImages] = useState<string[]>([]);

    const toggleFeature = (feature: string) => {
        setFeatures((prev) =>
            prev.includes(feature)
                ? prev.filter((f) => f !== feature)
                : [...prev, feature]
        );
    };

    const handleSubmit = () => {
        if (!location || !name) return;

        addSpot({
            name,
            description,
            difficulty: difficulty as any,
            type: type as any,
            rating,
            location: location,
            features,
            images,
        });

        // Reset form
        setName("");
        setDescription("");
        setRating(0);
        setDifficulty("Beginner");
        setType("Street");
        setFeatures([]);
        setImages([]);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-neutral-900 border border-white/10 rounded-xl w-full max-w-md shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
                >
                    {/* Header */}
                    <div className="p-4 border-b border-white/10 flex items-center justify-between sticky top-0 bg-neutral-900 z-10">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <MapPin className="text-secondary" size={20} />
                            Add New Spot
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-1 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-neutral-300">Spot Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Southbank Undercroft"
                                className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-neutral-500 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-neutral-300">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="What kind of obstacles are here?"
                                rows={3}
                                className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-neutral-500 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50 resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-neutral-300">Type</label>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-secondary"
                                >
                                    <option>Street</option>
                                    <option>Park</option>
                                    <option>DIY</option>
                                    <option>Transition</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-neutral-300">Difficulty</label>
                                <select
                                    value={difficulty}
                                    onChange={(e) => setDifficulty(e.target.value)}
                                    className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-secondary"
                                >
                                    <option>Beginner</option>
                                    <option>Intermediate</option>
                                    <option>Pro</option>
                                    <option>Legendary</option>
                                </select>
                            </div>
                        </div>

                        {/* Features Multi-select */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-neutral-300">Features</label>
                            <div className="flex flex-wrap gap-2">
                                {FEATURE_OPTIONS.map((feat) => (
                                    <button
                                        key={feat}
                                        type="button"
                                        onClick={() => toggleFeature(feat)}
                                        className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                                            features.includes(feat)
                                                ? "bg-secondary/20 border-secondary/50 text-secondary"
                                                : "bg-neutral-800 border-white/10 text-neutral-400 hover:text-white hover:border-white/20"
                                        }`}
                                    >
                                        {feat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-neutral-300">Rating</label>
                            <div className="flex items-center gap-1 h-10">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => setRating(star)}
                                        className={`transition-colors ${rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-neutral-600'}`}
                                    >
                                        <Star size={20} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Photo Upload */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-neutral-300">
                                Photos {images.length > 0 && `(${images.length}/5)`}
                            </label>
                            {images.length < 5 && (
                                <FileUploadButton
                                    accept="image/*"
                                    onUpload={(url) => setImages((prev) => [...prev, url].slice(0, 5))}
                                    maxSizeMB={10}
                                    label="Upload Photos"
                                    multiple
                                />
                            )}
                            {images.length > 0 && (
                                <div className="flex gap-2 flex-wrap">
                                    {images.map((url, i) => (
                                        <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-white/10">
                                            <img src={url} alt="" className="w-full h-full object-cover" />
                                            <button
                                                onClick={() => setImages((prev) => prev.filter((_, j) => j !== i))}
                                                className="absolute top-0.5 right-0.5 p-0.5 bg-black/60 rounded-full text-white"
                                            >
                                                <X size={10} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <p className="text-xs text-neutral-500 text-center">
                                Location: {location ? `${location[0].toFixed(4)}, ${location[1].toFixed(4)}` : 'Select on map'}
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-white/10 flex justify-end gap-3 bg-neutral-900/50 sticky bottom-0">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-neutral-300 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!name || !location}
                            className="px-4 py-2 bg-secondary hover:bg-secondary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-secondary/20"
                        >
                            Create Spot
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
