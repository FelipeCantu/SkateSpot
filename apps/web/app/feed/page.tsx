"use client";

import { FeedCard } from "@/components/FeedCard";
import { useFeed } from "@/context/FeedContext";
import { UploadClipModal } from "@/components/UploadClipModal";
import { CardSkeleton } from "@/components/LoadingSkeleton";
import { EmptyState } from "@/components/EmptyState";
import { useState } from "react";
import { Plus, Video } from "lucide-react";

export default function FeedPage() {
    const { clips, isLoading } = useFeed();
    const [isUploadOpen, setIsUploadOpen] = useState(false);

    return (
        <div className="max-w-2xl mx-auto px-4 py-8 relative">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">Latest Clips</h1>
                <button
                    onClick={() => setIsUploadOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-dark text-white rounded-lg transition-colors font-medium"
                >
                    <Plus size={18} />
                    Upload Clip
                </button>
            </div>

            <div className="space-y-6">
                {isLoading ? (
                    <>
                        <CardSkeleton />
                        <CardSkeleton />
                        <CardSkeleton />
                    </>
                ) : clips.length === 0 ? (
                    <EmptyState
                        icon={<Video size={48} />}
                        title="No Clips Yet"
                        description="Be the first to upload a clip and share your skills with the community!"
                        actionLabel="Upload Clip"
                        onAction={() => setIsUploadOpen(true)}
                    />
                ) : (
                    <>
                        {clips.map((clip) => (
                            <FeedCard key={clip.id} clip={clip} />
                        ))}
                        <div className="text-center py-8 text-neutral-500 text-sm">
                            You&apos;ve reached the end of the feed.
                        </div>
                    </>
                )}
            </div>

            <UploadClipModal
                isOpen={isUploadOpen}
                onClose={() => setIsUploadOpen(false)}
            />
        </div>
    );
}
