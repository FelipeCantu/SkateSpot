"use client";

import { X, Upload, MapPin } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSpots } from "@/context/SpotContext";
import { useFeed } from "@/context/FeedContext";
import { FileUploadButton } from "@/components/FileUploadButton";

interface UploadClipModalProps {
    isOpen: boolean;
    onClose: () => void;
    preSelectedSpotId?: string;
}

export function UploadClipModal({ isOpen, onClose, preSelectedSpotId }: UploadClipModalProps) {
    const { spots } = useSpots();
    const { uploadClip } = useFeed();
    const [description, setDescription] = useState("");
    const [trickName, setTrickName] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [thumbnailUrl, setThumbnailUrl] = useState("");
    const [selectedSpotId, setSelectedSpotId] = useState(preSelectedSpotId || "");

    const handleSubmit = () => {
        if (!selectedSpotId || !videoUrl) return;

        uploadClip({
            spotId: selectedSpotId,
            type: "video",
            url: videoUrl,
            thumbnail: thumbnailUrl || "https://images.unsplash.com/photo-1574261271360-1e569550b069?q=80&w=600",
            description,
            trickName,
        });

        // Reset
        setDescription("");
        setTrickName("");
        setVideoUrl("");
        setThumbnailUrl("");
        if (!preSelectedSpotId) setSelectedSpotId("");
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
                    <div className="p-4 border-b border-white/10 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <Upload className="text-accent" size={20} />
                            Upload Clip
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
                        {/* Video Upload */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-neutral-300">Video File</label>
                            <FileUploadButton
                                accept="video/*"
                                onUpload={(url) => setVideoUrl(url)}
                                maxSizeMB={50}
                                label="Upload Video"
                                preview={false}
                            />
                            {videoUrl && (
                                <p className="text-xs text-green-400">Video uploaded successfully</p>
                            )}
                        </div>

                        {/* Thumbnail Upload */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-neutral-300">Thumbnail (optional)</label>
                            <FileUploadButton
                                accept="image/*"
                                onUpload={(url) => setThumbnailUrl(url)}
                                maxSizeMB={10}
                                label="Upload Thumbnail"
                            />
                        </div>

                        {/* Trick Name */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-neutral-300">Trick Name</label>
                            <input
                                type="text"
                                value={trickName}
                                onChange={(e) => setTrickName(e.target.value)}
                                placeholder="e.g. Kickflip, Ollie, Heelflip"
                                className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-neutral-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-neutral-300">Spot</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-2.5 text-neutral-400" size={16} />
                                <select
                                    value={selectedSpotId}
                                    onChange={(e) => setSelectedSpotId(e.target.value)}
                                    disabled={!!preSelectedSpotId}
                                    className="w-full bg-neutral-800 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-white focus:outline-none focus:border-accent disabled:opacity-50"
                                >
                                    <option value="" disabled>Select a spot</option>
                                    {spots.map(spot => (
                                        <option key={spot.id} value={spot.id}>
                                            {spot.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-neutral-300">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="What trick did you land? Tag your friends!"
                                rows={3}
                                className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-neutral-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 resize-none"
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-white/10 flex justify-end gap-3 bg-neutral-900/50">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-neutral-300 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!selectedSpotId || !videoUrl}
                            className="px-4 py-2 bg-accent hover:bg-accent-dark disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-accent/20"
                        >
                            Post Clip
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
