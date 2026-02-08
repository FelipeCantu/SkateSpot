"use client";

import { Clip } from "@/types/models";
import { useFeed } from "@/context/FeedContext";
import { useUser } from "@/context/UserContext";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import Link from "next/link";
import { Heart, MessageCircle, Share2, MapPin, Bookmark, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { CommentList } from "@/components/CommentList";

type ExtendedClip = Clip & {
    _user?: { id: string; username: string; name: string; avatar: string };
    _spot?: { id: string; name: string };
    _likeCount?: number;
    _commentCount?: number;
};

export function FeedCard({ clip }: { clip: Clip }) {
    const { likeClip, addComment, saveClip } = useFeed();
    const { currentUser } = useUser();
    const [commentText, setCommentText] = useState("");
    const [showComments, setShowComments] = useState(false);

    const ext = clip as ExtendedClip;
    const isLiked = currentUser ? clip.likes.includes(currentUser.id) : false;
    const likeCount = ext._likeCount ?? clip.likes.length;
    const commentCount = ext._commentCount ?? clip.comments.length;

    const handleLike = () => likeClip(clip.id);

    const handleComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        addComment(clip.id, commentText);
        setCommentText("");
    };

    const handleSave = () => saveClip?.(clip.id);

    const userName = ext._user?.username || clip.userId;
    const userAvatar = ext._user?.avatar;
    const userDisplayName = ext._user?.name || clip.userId;
    const spotName = ext._spot?.name;

    return (
        <div className="bg-neutral-900 border border-white/5 rounded-xl overflow-hidden mb-6 max-w-xl mx-auto shadow-lg hover:border-white/10 transition-colors">
            {/* Header */}
            <div className="p-4 flex items-center justify-between">
                <Link href={`/user/${clip.userId}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-neutral-800 overflow-hidden relative">
                        {userAvatar ? (
                            <Image src={userAvatar} alt={userName} fill className="object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center text-white font-bold text-lg">
                                {userName.slice(0, 2).toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm text-white">{userDisplayName}</h3>
                        <p className="text-xs text-neutral-400">@{userName}</p>
                    </div>
                </Link>
                <button className="text-neutral-400 hover:text-white transition-colors">
                    <MoreHorizontal size={20} />
                </button>
            </div>

            {/* Content */}
            <div className="aspect-[4/5] bg-neutral-950 relative w-full group cursor-pointer">
                {clip.thumbnail ? (
                    <Image
                        src={clip.thumbnail}
                        alt={clip.description}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-600">
                        No thumbnail
                    </div>
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

                {clip.trickName && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur-sm rounded-full text-xs font-medium text-white">
                        {clip.trickName}
                    </div>
                )}

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                        <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[20px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
                    </div>
                </div>
            </div>

            {/* Actions & Description */}
            <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                        <ActionButton
                            icon={<Heart size={24} className={isLiked ? "fill-red-500 text-red-500" : ""} />}
                            count={likeCount}
                            onClick={handleLike}
                        />
                        <ActionButton
                            icon={<MessageCircle size={24} />}
                            count={commentCount}
                            onClick={() => setShowComments(!showComments)}
                        />
                        <ActionButton icon={<Share2 size={24} />} count={0} onClick={() => { }} />
                    </div>
                    <div className="flex items-center gap-2">
                        {clip.spotId && (
                            <Link
                                href={`/spot/${clip.spotId}`}
                                className="flex items-center gap-1 text-xs text-primary-light font-medium bg-primary-dark/30 px-2 py-1 rounded-full hover:bg-primary-dark/50 transition-colors"
                            >
                                <MapPin size={12} />
                                {spotName || `Spot`}
                            </Link>
                        )}
                        <button
                            onClick={handleSave}
                            className="text-neutral-400 hover:text-white transition-colors"
                        >
                            <Bookmark size={20} />
                        </button>
                    </div>
                </div>

                <div className="space-y-1">
                    <p className="text-sm text-neutral-300">
                        <Link href={`/user/${clip.userId}`} className="font-semibold text-white mr-2 hover:underline">
                            {userName}
                        </Link>
                        {clip.description}
                    </p>
                    <p className="text-xs text-neutral-500 uppercase tracking-wide">
                        {formatDistanceToNow(clip.createdAt, { addSuffix: true })}
                    </p>
                </div>

                {/* Comments Section */}
                {showComments && (
                    <div className="mt-4 pt-3 border-t border-white/10">
                        <CommentList clipId={clip.id} />
                        <form onSubmit={handleComment} className="flex gap-2 mt-3">
                            <input
                                type="text"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Add a comment..."
                                className="flex-1 bg-transparent text-sm text-white placeholder:text-neutral-500 focus:outline-none"
                            />
                            <button
                                type="submit"
                                disabled={!commentText.trim()}
                                className="text-xs font-bold text-secondary disabled:opacity-50"
                            >
                                POST
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

function ActionButton({ icon, count, onClick }: { icon: React.ReactNode; count: number; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-1.5 text-neutral-300 hover:text-secondary hover:fill-current group transition-colors"
        >
            {icon}
            <span className="text-sm font-medium group-hover:text-white">{formatNumber(count)}</span>
        </button>
    );
}

function formatNumber(num: number): string {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
}
