"use client";

import { X, Loader2 } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/context/UserContext";
import { FileUploadButton } from "@/components/FileUploadButton";

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
    const { currentUser, updateProfile } = useUser();
    const [name, setName] = useState(currentUser?.name || "");
    const [bio, setBio] = useState(currentUser?.bio || "");
    const [location, setLocation] = useState(currentUser?.location || "");
    const [avatar, setAvatar] = useState(currentUser?.avatar || "");
    const [instagram, setInstagram] = useState(currentUser?.socialLinks?.instagram || "");
    const [youtube, setYoutube] = useState(currentUser?.socialLinks?.youtube || "");
    const [tiktok, setTiktok] = useState(currentUser?.socialLinks?.tiktok || "");
    const [saving, setSaving] = useState(false);

    const handleSubmit = async () => {
        setSaving(true);
        await updateProfile({
            name,
            bio,
            location,
            avatar,
            socialLinks: { instagram, youtube, tiktok },
        });
        setSaving(false);
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
                    <div className="p-4 border-b border-white/10 flex items-center justify-between sticky top-0 bg-neutral-900 z-10">
                        <h2 className="text-lg font-bold text-white">Edit Profile</h2>
                        <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-6 space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-neutral-300">Avatar</label>
                            <FileUploadButton
                                accept="image/*"
                                onUpload={(url) => setAvatar(url)}
                                maxSizeMB={5}
                                label="Upload Avatar"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-neutral-300">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-neutral-300">Bio</label>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                rows={3}
                                className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50 resize-none"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-neutral-300">Location</label>
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="London, UK"
                                className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-neutral-500 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-neutral-300">Instagram</label>
                            <input
                                type="text"
                                value={instagram}
                                onChange={(e) => setInstagram(e.target.value)}
                                placeholder="username"
                                className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-neutral-500 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-neutral-300">YouTube</label>
                            <input
                                type="text"
                                value={youtube}
                                onChange={(e) => setYoutube(e.target.value)}
                                placeholder="channel name"
                                className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-neutral-500 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-neutral-300">TikTok</label>
                            <input
                                type="text"
                                value={tiktok}
                                onChange={(e) => setTiktok(e.target.value)}
                                placeholder="username"
                                className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-neutral-500 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50"
                            />
                        </div>
                    </div>

                    <div className="p-4 border-t border-white/10 flex justify-end gap-3 bg-neutral-900/50 sticky bottom-0">
                        <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-neutral-300 hover:text-white transition-colors">Cancel</button>
                        <button
                            onClick={handleSubmit}
                            disabled={saving}
                            className="px-4 py-2 bg-secondary hover:bg-secondary-dark disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                        >
                            {saving && <Loader2 size={16} className="animate-spin" />}
                            Save Changes
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
