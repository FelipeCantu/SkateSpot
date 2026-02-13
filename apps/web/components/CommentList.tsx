"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";

interface CommentData {
    id: string;
    content: string;
    userId: string;
    user?: { id: string; username: string; name: string; avatar: string };
    createdAt: number;
}

export function CommentList({ clipId }: { clipId: string }) {
    const [comments, setComments] = useState<CommentData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/clips/${clipId}/comment`)
            .then((res) => res.json())
            .then((json) => setComments(json.data ?? json))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [clipId]);

    if (loading) {
        return (
            <div className="space-y-2 mt-2">
                {[1, 2].map((i) => (
                    <div key={i} className="flex gap-2 animate-pulse">
                        <div className="w-6 h-6 rounded-full bg-neutral-700" />
                        <div className="flex-1 h-4 rounded bg-neutral-700" />
                    </div>
                ))}
            </div>
        );
    }

    if (comments.length === 0) {
        return <p className="text-xs text-neutral-500 mt-2">No comments yet</p>;
    }

    return (
        <div className="space-y-3 mt-2 max-h-48 overflow-y-auto">
            {comments.map((comment) => (
                <div key={comment.id} className="flex gap-2">
                    <div className="w-6 h-6 rounded-full overflow-hidden relative shrink-0 bg-neutral-800">
                        {comment.user?.avatar ? (
                            <Image
                                src={comment.user.avatar}
                                alt={comment.user.name}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center text-[8px] font-bold text-white">
                                {(comment.user?.username || "?").slice(0, 2).toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-neutral-300">
                            <Link
                                href={`/user/${comment.userId}`}
                                className="font-semibold text-white hover:underline mr-1"
                            >
                                {comment.user?.username || comment.userId}
                            </Link>
                            {comment.content}
                        </p>
                        <p className="text-[10px] text-neutral-500 mt-0.5">
                            {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
