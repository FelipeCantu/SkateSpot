"use client";

import Link from "next/link";
import Image from "next/image";
import { Eye, ThumbsUp, BookOpen } from "lucide-react";

const difficultyColors: Record<string, string> = {
  beginner: "bg-green-500/20 text-green-400 border-green-500/30",
  intermediate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  advanced: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  expert: "bg-red-500/20 text-red-400 border-red-500/30",
};

export function TutorialCard({ tutorial }: { tutorial: any }) {
  return (
    <Link href={`/tutorials/${tutorial.id}`} className="block">
      <div className="bg-neutral-900 border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-colors">
        <div className="aspect-video bg-neutral-950 relative">
          {tutorial.thumbnail ? (
            <Image src={tutorial.thumbnail} alt={tutorial.trickName} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen size={32} className="text-neutral-600" />
            </div>
          )}
          <div className="absolute top-2 right-2">
            <span className={`text-xs px-2 py-0.5 rounded-full border ${difficultyColors[tutorial.difficulty] || difficultyColors.beginner}`}>
              {tutorial.difficulty}
            </span>
          </div>
        </div>
        <div className="p-3">
          <h3 className="font-bold text-white text-sm mb-1">{tutorial.trickName}</h3>
          <p className="text-xs text-neutral-400 line-clamp-2 mb-2">{tutorial.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {tutorial.user && (
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full overflow-hidden relative bg-neutral-800">
                    {tutorial.user.avatar && <Image src={tutorial.user.avatar} alt="" fill className="object-cover" />}
                  </div>
                  <span className="text-xs text-neutral-400">{tutorial.user.username}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-neutral-500">
              <span className="flex items-center gap-1"><Eye size={12} />{tutorial.views}</span>
              <span className="flex items-center gap-1"><ThumbsUp size={12} />{tutorial.helpfulCount}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
